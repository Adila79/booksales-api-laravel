<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'shipping_address',
        'payment_method',
        'payment_status',
        'midtrans_order_id',
        'midtrans_payment_data',
        'virtual_account_bank',
        'virtual_account_number',
    ];

    protected function casts(): array
    {
        return [
            'midtrans_payment_data' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
