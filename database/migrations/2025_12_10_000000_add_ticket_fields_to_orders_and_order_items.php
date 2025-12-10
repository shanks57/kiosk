<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'ticket_code')) {
                $table->string('ticket_code', 20)->unique()->nullable(false)->after('status');
            }
            if (! Schema::hasColumn('orders', 'attendance_status')) {
                $table->string('attendance_status', 50)->default('absent')->after('ticket_code');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (! Schema::hasColumn('order_items', 'booking_code')) {
                $table->string('booking_code', 20)->nullable()->after('price');
            }
            if (! Schema::hasColumn('order_items', 'status')) {
                $table->string('status', 50)->nullable()->after('booking_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('order_items', 'booking_code')) {
                $table->dropColumn('booking_code');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'attendance_status')) {
                $table->dropColumn('attendance_status');
            }
            if (Schema::hasColumn('orders', 'ticket_code')) {
                $table->dropColumn('ticket_code');
            }
        });
    }
};
