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
        Schema::create('activity_participants', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('activity_id')->nullable();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('correct_activity_answers')->default(0);
            $table->bigInteger('incorrect_activity_answers')->default(0);
            $table->bigInteger('activity_items')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_participants');
    }
};
