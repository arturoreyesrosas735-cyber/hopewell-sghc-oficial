<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tb_expediente_clinico', function (Blueprint $table) {
            $table->smallIncrements('id_expediente');
            $table->unsignedSmallInteger('fk_paciente_expediente_clinico');

            $table->string('motivo', 255)->nullable();
            $table->unsignedSmallInteger('fk_diagnostico_expediente_clinico')->nullable();

            $table->text('antecedente_familiar')->nullable();
            $table->text('notas')->nullable();
            $table->timestamp('fecha_apertura');

            $table->string('estatus',20)->default('activo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_expediente_clinico');
    }
};
