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
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
        
        Schema::create('task_headers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('deskripsi');
            $table->date('dead_line');
            $table->date('start');
            $table->foreignId('board_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
        
        Schema::create('task_details', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('isComplet')->default(false);
            $table->foreignId('task_id')->constrained('task_headers')->onDelete('cascade'); // Perbaikan di sini
            $table->timestamps();
        });
        
        Schema::create('board_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('board_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('member');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boards');
        Schema::dropIfExists('task_headers');
        Schema::dropIfExists('task_details');
        Schema::dropIfExists('board_user');
    }
};
