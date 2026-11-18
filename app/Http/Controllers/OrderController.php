<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Midtrans\Config;
use Midtrans\CoreApi;

class OrderController extends Controller
{
    /**
     * Membuat pesanan COD atau Virtual Account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'payment_method' => [
                'required',
                Rule::in(['cod', 'midtrans']),
            ],
            'bank' => [
                'required_if:payment_method,midtrans',
                'nullable',
                Rule::in([
                    'bca',
                    'bni',
                    'bri',
                    'mandiri',
                    'permata',
                    'cimb',
                ]),
            ],
            'items' => 'required|array|min:1',
            'items.*.book_id' => 'required|exists:books,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $paymentMethod = $validated['payment_method'];
        $selectedBank = $validated['bank'] ?? null;

        try {
            $order = DB::transaction(function () use (
                $request,
                $validated,
                $paymentMethod,
                $selectedBank
            ) {
                $totalPrice = 0;
                $orderItems = [];
                $books = [];

                foreach ($validated['items'] as $item) {
                    $book = Book::findOrFail($item['book_id']);
                    $price = (int) $book->price;

                    $totalPrice += $price * $item['quantity'];

                    $books[$book->id] = $book;

                    $orderItems[] = [
                        'book_id' => $book->id,
                        'quantity' => $item['quantity'],
                        'price' => $price,
                    ];
                }

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'shipping_address' => $validated['shipping_address'],
                    'payment_method' => $paymentMethod,
                    'payment_status' => $paymentMethod === 'midtrans'
                        ? 'pending'
                        : 'unpaid',
                ]);

                $order->items()->createMany($orderItems);

                if ($paymentMethod === 'midtrans') {
                    $serverKey = (string) config(
                        'services.midtrans.server_key'
                    );

                    if ($serverKey === '') {
                        throw new \RuntimeException(
                            'MIDTRANS_SERVER_KEY belum dikonfigurasi.'
                        );
                    }

                    $midtransOrderId = 'BOOK-' . $order->id . '-' .
                        Str::upper(Str::random(8));

                    Config::$serverKey = $serverKey;
                    Config::$isProduction = (bool) config(
                        'services.midtrans.is_production'
                    );
                    Config::$isSanitized = (bool) config(
                        'services.midtrans.is_sanitized'
                    );

                    $itemDetails = [];

                    foreach ($orderItems as $item) {
                        $book = $books[$item['book_id']];

                        $itemDetails[] = [
                            'id' => (string) $item['book_id'],
                            'price' => (int) $item['price'],
                            'quantity' => (int) $item['quantity'],
                            'name' => substr($book->title, 0, 50),
                        ];
                    }

                    $chargeRequest = [
                        'transaction_details' => [
                            'order_id' => $midtransOrderId,
                            'gross_amount' => (int) $totalPrice,
                        ],
                        'item_details' => $itemDetails,
                        'customer_details' => [
                            'first_name' => $request->user()->name,
                            'email' => $request->user()->email,
                            'shipping_address' => [
                                'first_name' => $request->user()->name,
                                'address' => $validated['shipping_address'],
                            ],
                        ],
                    ];

                    if ($selectedBank === 'mandiri') {
                        $chargeRequest['payment_type'] = 'echannel';
                        $chargeRequest['echannel'] = [
                            'bill_info1' => 'Pembayaran',
                            'bill_info2' => 'Pesanan Buku',
                        ];
                    } else {
                        $chargeRequest['payment_type'] = 'bank_transfer';
                        $chargeRequest['bank_transfer'] = [
                            'bank' => $selectedBank,
                        ];
                    }

                    $charge = CoreApi::charge($chargeRequest);

                    $paymentData = is_array($charge)
                        ? $charge
                        : json_decode(json_encode($charge), true);

                    if (!is_array($paymentData)) {
                        throw new \RuntimeException(
                            'Respons pembayaran Midtrans tidak valid.'
                        );
                    }

                    $virtualAccountNumber = null;

                    if ($selectedBank === 'mandiri') {
                        $virtualAccountNumber =
                            $paymentData['bill_key'] ?? null;
                    } elseif ($selectedBank === 'permata') {
                        $virtualAccountNumber =
                            $paymentData['permata_va_number'] ?? null;
                    } else {
                        $virtualAccountNumber =
                            $paymentData['va_numbers'][0]['va_number'] ?? null;
                    }

                    if (!$virtualAccountNumber) {
                        throw new \RuntimeException(
                            $paymentData['status_message'] ??
                            'Nomor Virtual Account tidak ditemukan.'
                        );
                    }

                    $order->update([
                        'midtrans_order_id' => $midtransOrderId,
                        'virtual_account_bank' => $selectedBank,
                        'virtual_account_number' => $virtualAccountNumber,
                        'midtrans_payment_data' => $paymentData,
                    ]);
                }

                return $order;
            });

        } catch (\Throwable $exception) {
            Log::error('Gagal membuat pesanan atau pembayaran', [
                'user_id' => $request->user()->id,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Gagal membuat pesanan atau pembayaran.',
            ], 502);
        }

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'data' => $order->load('items.book'),
        ], 201);
    }

    /**
     * Menerima notifikasi pembayaran dari Midtrans.
     */
    public function midtransNotification(Request $request)
    {
        $payload = $request->validate([
            'order_id' => 'required|string',
            'status_code' => 'required|string',
            'gross_amount' => 'required|string',
            'signature_key' => 'required|string',
            'transaction_status' => 'required|string',
            'fraud_status' => 'sometimes|string',
        ]);

        $serverKey = (string) config(
            'services.midtrans.server_key'
        );

        if ($serverKey === '') {
            Log::error(
                'Notifikasi Midtrans ditolak: Server Key belum dikonfigurasi.'
            );

            return response()->json([
                'message' => 'Konfigurasi pembayaran belum tersedia.',
            ], 503);
        }

        $expectedSignature = hash(
            'sha512',
            $payload['order_id'] .
            $payload['status_code'] .
            $payload['gross_amount'] .
            $serverKey
        );

        if (!hash_equals(
            $expectedSignature,
            $payload['signature_key']
        )) {
            return response()->json([
                'message' => 'Signature Midtrans tidak valid.',
            ], 403);
        }

        return DB::transaction(function () use ($payload) {
            $order = Order::where(
                'midtrans_order_id',
                $payload['order_id']
            )->lockForUpdate()->first();

            if (!$order) {
                return response()->json([
                    'message' => 'Pesanan tidak ditemukan.',
                ], 404);
            }

            if (
                number_format((float) $payload['gross_amount'], 2, '.', '') !==
                number_format((float) $order->total_price, 2, '.', '')
            ) {
                return response()->json([
                    'message' => 'Nominal pembayaran tidak sesuai pesanan.',
                ], 422);
            }

            $transactionStatus = $payload['transaction_status'];
            $fraudStatus = $payload['fraud_status'] ?? null;

            // Jangan menurunkan status pesanan yang sudah lunas.
            if ($order->payment_status === 'paid') {
                return response()->json([
                    'message' => 'Pembayaran sudah lunas.',
                ]);
            }

            if (
                in_array($transactionStatus, ['settlement', 'capture'], true) &&
                ($transactionStatus === 'settlement' || $fraudStatus === 'accept')
            ) {
                $paymentStatus = 'paid';
            } elseif ($transactionStatus === 'pending') {
                $paymentStatus = 'pending';
            } elseif ($transactionStatus === 'expire') {
                $paymentStatus = 'expired';
            } elseif (in_array(
                $transactionStatus,
                ['deny', 'cancel'],
                true
            )) {
                $paymentStatus = 'cancelled';
            } else {
                $paymentStatus = 'failed';
            }

            $order->update([
                'payment_status' => $paymentStatus,
                'midtrans_payment_data' => array_merge(
                    (array) $order->midtrans_payment_data,
                    $payload
                ),
            ]);

            return response()->json([
                'message' => 'Notifikasi pembayaran berhasil diproses.',
            ]);
        });
    }

    /**
     * Daftar seluruh pesanan untuk admin.
     */
    public function index()
    {
        $orders = Order::with(['user', 'items.book'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders,
        ]);
    }

    /**
     * Riwayat pesanan milik user yang sedang login.
     */
    public function myOrders(Request $request)
    {
        $orders = Order::with('items.book')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders,
        ]);
    }

    /**
     * Konfirmasi pembayaran COD oleh admin.
     */
    public function confirmPayment(Order $order)
    {
        if ($order->payment_method !== 'cod') {
            return response()->json([
                'message' => 'Pembayaran Midtrans dikonfirmasi melalui notifikasi otomatis.',
            ], 422);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Pembayaran sudah dikonfirmasi sebelumnya.',
            ], 422);
        }

        $order->update([
            'payment_status' => 'paid',
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dikonfirmasi!',
            'data' => $order,
        ]);
    }

    /**
     * Mengubah status pesanan oleh admin.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'pending',
                    'diproses',
                    'dikirim',
                    'selesai',
                ]),
            ],
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui!',
            'data' => $order,
        ]);
    }
}
