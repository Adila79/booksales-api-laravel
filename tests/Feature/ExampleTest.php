<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/api/books');

        $response->assertStatus(200);
    }

    public function test_midtrans_notification_marks_order_as_paid(): void
    {
        config(['services.midtrans.server_key' => 'test-server-key']);

        $user = User::factory()->create();
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => 100000,
            'status' => 'pending',
            'shipping_address' => 'Test address',
            'payment_method' => 'midtrans',
            'payment_status' => 'pending',
            'midtrans_order_id' => 'BOOK-TEST-1',
        ]);

        $payload = [
            'order_id' => 'BOOK-TEST-1',
            'status_code' => '200',
            'gross_amount' => '100000.00',
            'transaction_status' => 'settlement',
        ];
        $payload['signature_key'] = hash(
            'sha512',
            $payload['order_id']
                .$payload['status_code']
                .$payload['gross_amount']
                .'test-server-key'
        );

        $this->postJson('/api/payments/midtrans/notification', $payload)
            ->assertOk();

        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_admin_cannot_manually_confirm_midtrans_payment(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $order = Order::create([
            'user_id' => $admin->id,
            'total_price' => 100000,
            'status' => 'pending',
            'shipping_address' => 'Test address',
            'payment_method' => 'midtrans',
            'payment_status' => 'pending',
            'midtrans_order_id' => 'BOOK-TEST-2',
        ]);

        $this->actingAs($admin)
            ->patchJson('/api/orders/'.$order->id.'/payment')
            ->assertUnprocessable();

        $this->assertSame('pending', $order->fresh()->payment_status);
    }
}
