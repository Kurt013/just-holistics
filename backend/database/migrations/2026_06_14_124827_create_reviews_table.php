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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('protocol_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating');  // 1–5
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'protocol_id']); // one review per user per protocol
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
