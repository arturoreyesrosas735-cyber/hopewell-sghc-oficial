<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_documento_doctor', function (Blueprint $table) {
            $table->smallIncrements('id_documento_doctor');
            $table->unsignedSmallInteger('fk_doctor');
            $table->string('tipo_documento', 40);
            $table->string('nombre_documento', 150);
            $table->string('extension_archivo', 10);
            $table->string('ruta_archivo', 500);
            $table->decimal('tamano_archivo', 10, 2);
            $table->timestamp('fecha_carga');
            $table->string('estatus', 20);

            $table->unique(['fk_doctor', 'tipo_documento'], 'uk_tb_documento_doctor_tipo');
            $table->foreign('fk_doctor')->references('pk_fk_usuario')->on('tb_doctor')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_documento_doctor');
    }
};
