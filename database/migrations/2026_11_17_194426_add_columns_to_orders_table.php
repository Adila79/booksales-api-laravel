
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable();
            }
            if (! Schema::hasColumn('orders', 'total_price')) {
                $table->decimal('total_price', 12, 2)->default(0);
            }
            if (! Schema::hasColumn('orders', 'status')) {
                $table->string('status')->default('pending');
            }
            if (! Schema::hasColumn('orders', 'shipping_address')) {
                $table->text('shipping_address')->nullable();
            }
        });
    }

    public function down(): void
    {
        // These columns belong to the original orders migration.
    }
};
