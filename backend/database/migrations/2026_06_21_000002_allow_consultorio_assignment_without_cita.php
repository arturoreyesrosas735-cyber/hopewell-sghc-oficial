<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE tb_doctor_consultorio ALTER COLUMN fk_cita DROP NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE tb_doctor_consultorio ALTER COLUMN fk_cita SET NOT NULL');
    }
};
