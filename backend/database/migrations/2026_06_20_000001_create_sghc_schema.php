<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_estado', function (Blueprint $table) {
            $table->smallIncrements('id_estado');
            $table->string('uk_nombre_estado', 150);
            $table->unique('uk_nombre_estado', 'uk_tb_estado_nombre_estado');
        });

        Schema::create('tb_genero', function (Blueprint $table) {
            $table->smallIncrements('id_genero');
            $table->string('ukTipo_genero', 255);
            $table->unique('ukTipo_genero', 'uk_tb_genero_tipo_genero');
        });

        Schema::create('tb_grupo_sanguineo', function (Blueprint $table) {
            $table->smallIncrements('id_sanguineo');
            $table->string('ukTipo_grupo', 255);
            $table->unique('ukTipo_grupo', 'uk_tb_grupo_sanguineo_tipo_grupo');
        });

        Schema::create('tb_parentesco', function (Blueprint $table) {
            $table->smallIncrements('id_parentesco');
            $table->string('ukTipo_parentesco', 255);
            $table->unique('ukTipo_parentesco', 'uk_tb_parentesco_tipo_parentesco');
        });

        Schema::create('tb_rol', function (Blueprint $table) {
            $table->smallIncrements('id_rol');
            $table->string('uk_nombre_rol', 150);
            $table->string('descripcion', 255)->nullable();
            $table->string('estatus', 20);
            $table->timestamp('fecha_crecion');
            $table->timestamp('fecha_modificacion')->nullable();
            $table->unique('uk_nombre_rol', 'uk_tb_rol_nombre_rol');
        });

        Schema::create('tb_permiso', function (Blueprint $table) {
            $table->smallIncrements('id_permiso');
            $table->string('nombre_permiso', 150);
            $table->string('modulo', 100);
            $table->string('accion', 100);
            $table->string('descripcion', 255)->nullable();
            $table->string('estatus', 20);
        });

        Schema::create('tb_estado_empleado', function (Blueprint $table) {
            $table->smallIncrements('id_estado_empleado');
            $table->string('ukTipo_estado', 255);
            $table->string('vv_descripcion', 255)->nullable();
            $table->unique('ukTipo_estado', 'uk_tb_estado_empleado_tipo_estado');
        });

        Schema::create('tb_especialidad', function (Blueprint $table) {
            $table->smallIncrements('id_especialidad');
            $table->string('uk_nombre', 150);
            $table->string('estatus', 20);
            $table->string('vv_descripcion', 255)->nullable();
            $table->unique('uk_nombre', 'uk_tb_especialidad_nombre');
        });

        Schema::create('tb_tipo_sede', function (Blueprint $table) {
            $table->smallIncrements('id_tipo_sede');
            $table->string('uk_nombre_tipo_sede', 150);
            $table->string('vv_descripcion', 255)->nullable();
            $table->string('estatus', 20);
            $table->unique('uk_nombre_tipo_sede', 'uk_tb_tipo_sede_nombre_tipo_sede');
        });

        Schema::create('tb_estado_cita', function (Blueprint $table) {
            $table->smallIncrements('id_estado_cita');
            $table->string('uk_nombre_estado', 150);
            $table->string('descripcion', 255)->nullable();
            $table->unique('uk_nombre_estado', 'uk_tb_estado_cita_nombre_estado');
        });

        Schema::create('tb_metodo_pago', function (Blueprint $table) {
            $table->smallIncrements('id_metodo_pago');
            $table->string('uk_nombre', 150);
            $table->boolean('requiere_referencia');
            $table->unique('uk_nombre', 'uk_tb_metodo_pago_nombre');
        });

        Schema::create('tb_concepto', function (Blueprint $table) {
            $table->smallIncrements('id_concepto');
            $table->string('uk_nombre', 150);
            $table->unique('uk_nombre', 'uk_tb_concepto_nombre');
        });

        Schema::create('tb_medicamento', function (Blueprint $table) {
            $table->smallIncrements('id_medicamento');
            $table->string('uk_nombremedicamento', 150);
            $table->string('descripcion', 255)->nullable();
            $table->string('presentacion', 100);
            $table->string('concentracion', 100);
            $table->unique('uk_nombremedicamento', 'uk_tb_medicamento_nombremedicamento');
        });

        Schema::create('tb_cronicidad', function (Blueprint $table) {
            $table->smallIncrements('id_cronico');
            $table->string('ukTipo_cronicidad', 255);
            $table->unique('ukTipo_cronicidad', 'uk_tb_cronicidad_tipo_cronicidad');
        });

        Schema::create('tb_capitulo', function (Blueprint $table) {
            $table->smallIncrements('id_capitulo');
            $table->string('uk_nombrecapitulo', 150);
            $table->unique('uk_nombrecapitulo', 'uk_tb_capitulo_nombrecapitulo');
        });

        Schema::create('tb_municipio_alcaldia', function (Blueprint $table) {
            $table->smallIncrements('id_municipio_alcaldia');
            $table->string('uk_nombremunicipio_alcaldia', 150);
            $table->unsignedSmallInteger('fk_estadomunicipio_alcaldia');
            $table->unique('uk_nombremunicipio_alcaldia', 'uk_tb_municipio_alcaldia_nombremunicipio_alcaldia');
            $table->foreign('fk_estadomunicipio_alcaldia')->references('id_estado')->on('tb_estado');
        });

        Schema::create('tb_tutor', function (Blueprint $table) {
            $table->smallIncrements('id_tutor');
            $table->string('vv_nombre_completo', 150);
            $table->string('uk_telefono', 15)->nullable();
            $table->unsignedSmallInteger('fk_parentesco_tutor');
            $table->unique('uk_telefono', 'uk_tb_tutor_telefono');
            $table->foreign('fk_parentesco_tutor')->references('id_parentesco')->on('tb_parentesco');
        });

        Schema::create('tb_contacto_emergencia', function (Blueprint $table) {
            $table->smallIncrements('id_contacto');
            $table->string('vv_nombre_completo', 150);
            $table->string('uk_telefono', 15)->nullable();
            $table->unsignedSmallInteger('fk_parentesco_contacto_emergencia');
            $table->unique('uk_telefono', 'uk_tb_contacto_emergencia_telefono');
            $table->foreign('fk_parentesco_contacto_emergencia')->references('id_parentesco')->on('tb_parentesco');
        });

        Schema::create('tb_bloque', function (Blueprint $table) {
            $table->string('id_bloque', 20)->primary();
            $table->string('uk_nombre_bloque', 150);
            $table->unsignedSmallInteger('id_capitulo_bloque');
            $table->unique('uk_nombre_bloque', 'uk_tb_bloque_nombre_bloque');
            $table->foreign('id_capitulo_bloque')->references('id_capitulo')->on('tb_capitulo');
        });

        Schema::create('tb_codigo_postal', function (Blueprint $table) {
            $table->smallIncrements('id_codigo_postal');
            $table->char('uk_numero_codigo_postal', 5);
            $table->unsignedSmallInteger('fk_municipio_alcaldia_codigo_postal');
            $table->unique('uk_numero_codigo_postal', 'uk_tb_codigo_postal_numero_codigo_postal');
            $table->foreign('fk_municipio_alcaldia_codigo_postal')->references('id_municipio_alcaldia')->on('tb_municipio_alcaldia');
        });

        Schema::create('tb_enfermedad', function (Blueprint $table) {
            $table->string('id_enfermedad', 10)->primary();
            $table->string('uk_tipo_enfermedad', 255);
            $table->string('fk_bloque_enfermedad', 20);
            $table->unique('uk_tipo_enfermedad', 'uk_tb_enfermedad_tipo_enfermedad');
            $table->foreign('fk_bloque_enfermedad')->references('id_bloque')->on('tb_bloque');
        });

        Schema::create('tb_asentamiento', function (Blueprint $table) {
            $table->smallIncrements('id_asentamiento');
            $table->string('uk_nombre_colonia', 150);
            $table->unsignedSmallInteger('fk_codigo_postal_asentamiento');
            $table->unique('uk_nombre_colonia', 'uk_tb_asentamiento_nombre_colonia');
            $table->foreign('fk_codigo_postal_asentamiento')->references('id_codigo_postal')->on('tb_codigo_postal');
        });

        Schema::create('tb_sede', function (Blueprint $table) {
            $table->smallIncrements('id_sede');
            $table->string('nombre_sede', 150);
            $table->unsignedSmallInteger('fk_tipo_sede');
            $table->unsignedSmallInteger('fk_asentamiento_sede');
            $table->string('telefono', 15)->nullable();
            $table->string('uk_correo', 255);
            $table->string('responsable', 150);
            $table->timestamp('fecha_crecion');
            $table->string('estatus_operativo', 20);
            $table->unique('uk_correo', 'uk_tb_sede_correo');
            $table->foreign('fk_tipo_sede')->references('id_tipo_sede')->on('tb_tipo_sede');
            $table->foreign('fk_asentamiento_sede')->references('id_asentamiento')->on('tb_asentamiento');
        });

        Schema::create('tb_personal', function (Blueprint $table) {
            $table->smallIncrements('id_personal');
            $table->unsignedSmallInteger('fk_sede_personal');
            $table->string('uk_numero_empleado', 30);
            $table->char('uk_curp', 18);
            $table->string('nombres', 150);
            $table->string('apellido_paterno', 150);
            $table->string('apellido_materno', 150)->nullable();
            $table->string('telefono', 15)->nullable();
            $table->string('uk_correo_electronico', 255);
            $table->string('estatus', 20);
            $table->timestamp('fecha_crecion');
            $table->timestamp('fecha_modificacion')->nullable();
            $table->unique('uk_numero_empleado', 'uk_tb_personal_numero_empleado');
            $table->unique('uk_curp', 'uk_tb_personal_curp');
            $table->unique('uk_correo_electronico', 'uk_tb_personal_correo_electronico');
            $table->foreign('fk_sede_personal')->references('id_sede')->on('tb_sede');
        });

        Schema::create('tb_paciente', function (Blueprint $table) {
            $table->smallIncrements('id_paciente');
            $table->char('uk_curp', 18);
            $table->string('nombres', 150);
            $table->string('apellido_paterno', 150);
            $table->string('apellido_materno', 150)->nullable();
            $table->date('fecha_nacimiento');
            $table->unsignedSmallInteger('fk_genero_paciente');
            $table->string('uk_telefono', 15)->nullable();
            $table->string('uk_correo_electronico', 255)->nullable();
            $table->unsignedSmallInteger('fk_grupo_paciente');
            $table->unsignedSmallInteger('id_contacto_emergencia_paciente');
            $table->unsignedSmallInteger('id_asentamiento_paciente');
            $table->string('calle', 150);
            $table->string('numero_int', 20)->nullable();
            $table->string('numero_ext', 20)->nullable();
            $table->unsignedSmallInteger('fk_tutor_paciente')->nullable();
            $table->string('estatus', 20);
            $table->text('vv_alergia')->nullable();
            $table->unique('uk_curp', 'uk_tb_paciente_curp');
            $table->unique('uk_telefono', 'uk_tb_paciente_telefono');
            $table->unique('uk_correo_electronico', 'uk_tb_paciente_correo_electronico');
            $table->foreign('fk_genero_paciente')->references('id_genero')->on('tb_genero');
            $table->foreign('fk_grupo_paciente')->references('id_sanguineo')->on('tb_grupo_sanguineo');
            $table->foreign('id_contacto_emergencia_paciente')->references('id_contacto')->on('tb_contacto_emergencia');
            $table->foreign('id_asentamiento_paciente')->references('id_asentamiento')->on('tb_asentamiento');
            $table->foreign('fk_tutor_paciente')->references('id_tutor')->on('tb_tutor');
        });

        Schema::create('tb_consultorio', function (Blueprint $table) {
            $table->smallIncrements('id_consultorio');
            $table->unsignedSmallInteger('fk_sede_consultorio');
            $table->text('observaciones')->nullable();
            $table->string('piso', 20)->nullable();
            $table->string('estatus', 20);
            $table->string('nombre_consultorio', 150);
            $table->string('numero_consultorio', 30);
            $table->timestamp('fecha_crecion');
            $table->foreign('fk_sede_consultorio')->references('id_sede')->on('tb_sede');
        });

        Schema::create('tb_usuario', function (Blueprint $table) {
            $table->smallIncrements('id_usuario');
            $table->string('nombre_usuario', 150);
            $table->string('contrasena_hash', 255);
            $table->string('estatus', 20);
            $table->unsignedSmallInteger('fk_personal_usuario');
            $table->unsignedSmallInteger('fk_rol_usuario');
            $table->unsignedSmallInteger('fk_genero_usuario');
            $table->string('uk_correo_electronico', 255);
            $table->boolean('requiere_cambio_contrasena');
            $table->boolean('perfil_completo');
            $table->unsignedSmallInteger('intentos_fallidos');
            $table->timestamp('bloqueado_hasta')->nullable();
            $table->timestamp('ultimo_acceso')->nullable();
            $table->timestamp('fecha_crecion');
            $table->timestamp('fecha_modificacion')->nullable();
            $table->unique('uk_correo_electronico', 'uk_tb_usuario_correo_electronico');
            $table->foreign('fk_personal_usuario')->references('id_personal')->on('tb_personal');
            $table->foreign('fk_rol_usuario')->references('id_rol')->on('tb_rol');
            $table->foreign('fk_genero_usuario')->references('id_genero')->on('tb_genero');
        });

        Schema::create('tb_doctor', function (Blueprint $table) {
            $table->unsignedSmallInteger('pk_fk_usuario')->primary();
            $table->string('uk_cedula_profesional', 20);
            $table->char('uk_rfc_personal', 13);
            $table->unsignedSmallInteger('fk_asentamiento_doctor');
            $table->unsignedSmallInteger('fk_estado_empleado_doctor');
            $table->unique('uk_cedula_profesional', 'uk_tb_doctor_cedula_profesional');
            $table->unique('uk_rfc_personal', 'uk_tb_doctor_rfc_personal');
            $table->foreign('pk_fk_usuario')->references('id_usuario')->on('tb_usuario');
            $table->foreign('fk_asentamiento_doctor')->references('id_asentamiento')->on('tb_asentamiento');
            $table->foreign('fk_estado_empleado_doctor')->references('id_estado_empleado')->on('tb_estado_empleado');
        });

        Schema::create('tb_enfermera', function (Blueprint $table) {
            $table->unsignedSmallInteger('pk_fk_usuario')->primary();
            $table->string('uk_cedula_profesional', 20);
            $table->char('uk_rfc_personal', 13);
            $table->unsignedSmallInteger('fk_asentamiento_enfermera');
            $table->unsignedSmallInteger('fk_asignacion_enfermera');
            $table->unsignedSmallInteger('fk_estado_empleado_enfermera');
            $table->unique('uk_cedula_profesional', 'uk_tb_enfermera_cedula_profesional');
            $table->unique('uk_rfc_personal', 'uk_tb_enfermera_rfc_personal');
            $table->foreign('pk_fk_usuario')->references('id_usuario')->on('tb_usuario');
            $table->foreign('fk_asentamiento_enfermera')->references('id_asentamiento')->on('tb_asentamiento');
            $table->foreign('fk_estado_empleado_enfermera')->references('id_estado_empleado')->on('tb_estado_empleado');
        });

        Schema::create('tb_sesion_usuario', function (Blueprint $table) {
            $table->smallIncrements('id_sesion');
            $table->unsignedSmallInteger('fk_usuario_sesion');
            $table->string('uk_token_sesion', 500);
            $table->timestamp('fecha_inicio');
            $table->timestamp('fecha_fin')->nullable();
            $table->string('direccion_ip', 45)->nullable();
            $table->string('navegador', 255)->nullable();
            $table->string('estatus', 20);
            $table->unique('uk_token_sesion', 'uk_tb_sesion_usuario_token_sesion');
            $table->foreign('fk_usuario_sesion')->references('id_usuario')->on('tb_usuario');
        });

        Schema::create('tb_recuperacion_acceso', function (Blueprint $table) {
            $table->smallIncrements('id_recuperacion');
            $table->unsignedSmallInteger('fk_usuario_recuperacion');
            $table->string('uk_token_recuperacion', 255);
            $table->timestamp('fecha_solicitud');
            $table->timestamp('fecha_expiracion');
            $table->boolean('utilizado');
            $table->timestamp('fecha_uso')->nullable();
            $table->unique('uk_token_recuperacion', 'uk_tb_recuperacion_acceso_token_recuperacion');
            $table->foreign('fk_usuario_recuperacion')->references('id_usuario')->on('tb_usuario');
        });

        Schema::create('tb_rol_permiso', function (Blueprint $table) {
            $table->smallIncrements('id_rol_permiso');
            $table->unsignedSmallInteger('fk_rol_permiso');
            $table->unsignedSmallInteger('fk_permiso_rol_permiso');
            $table->unsignedSmallInteger('fk_usuario_asigna_rolpermiso');
            $table->timestamp('fecha_asignacion');
            $table->string('estatus', 20);
            $table->foreign('fk_rol_permiso')->references('id_rol')->on('tb_rol');
            $table->foreign('fk_permiso_rol_permiso')->references('id_permiso')->on('tb_permiso');
            $table->foreign('fk_usuario_asigna_rolpermiso')->references('id_usuario')->on('tb_usuario');
        });

        Schema::create('tb_especialidad_doctor', function (Blueprint $table) {
            $table->smallIncrements('id_especialidad_doctor');
            $table->unsignedSmallInteger('fk_doctor');
            $table->unsignedSmallInteger('fk_especialidad');
            $table->foreign('fk_doctor')->references('pk_fk_usuario')->on('tb_doctor');
            $table->foreign('fk_especialidad')->references('id_especialidad')->on('tb_especialidad');
        });

        Schema::create('tb_especialidad_enfermera', function (Blueprint $table) {
            $table->smallIncrements('id_especialidad_enfermera');
            $table->unsignedSmallInteger('fk_enfermera');
            $table->unsignedSmallInteger('fk_especialidad');
            $table->foreign('fk_enfermera')->references('pk_fk_usuario')->on('tb_enfermera');
            $table->foreign('fk_especialidad')->references('id_especialidad')->on('tb_especialidad');
        });

        Schema::create('tb_padecimiento', function (Blueprint $table) {
            $table->smallIncrements('id_padecimiento');
            $table->string('uk_nombre_padecimiento', 150);
            $table->string('uk_codigo_cie', 15);
            $table->text('vv_descripcion')->nullable();
            $table->string('fk_enfermedad_padecimiento', 10);
            $table->unsignedSmallInteger('fk_cronicidad_padecimiento');
            $table->unsignedSmallInteger('fk_paciente_padecimiento');
            $table->unique('uk_nombre_padecimiento', 'uk_tb_padecimiento_nombre_padecimiento');
            $table->unique('uk_codigo_cie', 'uk_tb_padecimiento_codigo_cie');
            $table->foreign('fk_enfermedad_padecimiento')->references('id_enfermedad')->on('tb_enfermedad');
            $table->foreign('fk_cronicidad_padecimiento')->references('id_cronico')->on('tb_cronicidad');
            $table->foreign('fk_paciente_padecimiento')->references('id_paciente')->on('tb_paciente');
        });

        Schema::create('tb_paciente_padecimiento', function (Blueprint $table) {
            $table->smallIncrements('id_paciente_padecimiento');
            $table->unsignedSmallInteger('fk_padecimiento');
            $table->unsignedSmallInteger('fk_paciente');
            $table->foreign('fk_padecimiento')->references('id_padecimiento')->on('tb_padecimiento');
            $table->foreign('fk_paciente')->references('id_paciente')->on('tb_paciente');
        });

        Schema::create('tb_bitacora_auditoria', function (Blueprint $table) {
            $table->smallIncrements('id_auditoria');
            $table->unsignedSmallInteger('fk_usuario_auditoria');
            $table->string('modulo_afectado', 100);
            $table->string('operacion_accion', 50);
            $table->timestamp('fecha_registro');
            $table->timestamp('fecha_edicion');
            $table->string('tabla_afectada', 100);
            $table->text('descripcion')->nullable();
            $table->string('direccion_ip', 45)->nullable();
            $table->foreign('fk_usuario_auditoria')->references('id_usuario')->on('tb_usuario');
        });

        Schema::create('tb_expediente_clinico', function (Blueprint $table) {
            $table->smallIncrements('id_expediente');
            $table->unsignedSmallInteger('fk_paciente_expediente_clinico');
            $table->string('motivo', 255)->nullable();
            $table->unsignedSmallInteger('fk_diagnostico_expediente_clinico');
            $table->text('antecedente_familiar')->nullable();
            $table->text('notas')->nullable();
            $table->timestamp('fecha_apertura');
            $table->foreign('fk_paciente_expediente_clinico')->references('id_paciente')->on('tb_paciente');
        });

        Schema::create('tb_documento', function (Blueprint $table) {
            $table->smallIncrements('id_documento');
            $table->unsignedSmallInteger('fk_expediente_clinico_documento');
            $table->string('nombre_documento', 150);
            $table->string('extension_archivo', 10);
            $table->string('ruta_archivo', 500)->nullable();
            $table->decimal('tamano_archivo', 10, 2);
            $table->timestamp('fecha_carga');
            $table->string('estatus', 20);
            $table->foreign('fk_expediente_clinico_documento')->references('id_expediente')->on('tb_expediente_clinico');
        });

        Schema::create('tb_cita', function (Blueprint $table) {
            $table->smallIncrements('id_cita');
            $table->unsignedSmallInteger('fk_paciente_cita');
            $table->unsignedSmallInteger('fk_asignacion_cita');
            $table->timestamp('fecha_hora_cita');
            $table->unsignedSmallInteger('fk_estado_cita');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->string('motivo_cita', 255)->nullable();
            $table->text('observaciones')->nullable();
            $table->foreign('fk_paciente_cita')->references('id_paciente')->on('tb_paciente');
            $table->foreign('fk_estado_cita')->references('id_estado_cita')->on('tb_estado_cita');
        });

        Schema::create('tb_doctor_consultorio', function (Blueprint $table) {
            $table->smallIncrements('id_asignacion');
            $table->unsignedSmallInteger('fk_doctor');
            $table->unsignedSmallInteger('fk_cita');
            $table->unsignedSmallInteger('fk_consultorio');
            $table->string('dia_semana', 20);
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->foreign('fk_doctor')->references('pk_fk_usuario')->on('tb_doctor');
            $table->foreign('fk_cita')->references('id_cita')->on('tb_cita');
            $table->foreign('fk_consultorio')->references('id_consultorio')->on('tb_consultorio');
        });

        Schema::create('tb_enfermera_doctor_consultorio', function (Blueprint $table) {
            $table->smallIncrements('id_asignacion_enfermera');
            $table->unsignedSmallInteger('fk_enfermera');
            $table->unsignedSmallInteger('fk_doctor_consultorio');
            $table->string('dia_semana', 20);
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->foreign('fk_enfermera')->references('pk_fk_usuario')->on('tb_enfermera');
            $table->foreign('fk_doctor_consultorio')->references('id_asignacion')->on('tb_doctor_consultorio');
        });

        Schema::create('tb_consulta_medica', function (Blueprint $table) {
            $table->smallIncrements('id_consulta_medica');
            $table->unsignedSmallInteger('fk_consultorio_consulta_medica');
            $table->unsignedSmallInteger('fk_expediente_consulta_medica');
            $table->unsignedSmallInteger('fk_tipo_consulta');
            $table->time('horario');
            $table->string('motivo_consulta', 500);
            $table->foreign('fk_consultorio_consulta_medica')->references('id_consultorio')->on('tb_consultorio');
            $table->foreign('fk_expediente_consulta_medica')->references('id_expediente')->on('tb_expediente_clinico');
        });

        Schema::create('tb_signo_vital', function (Blueprint $table) {
            $table->smallIncrements('id_signo');
            $table->unsignedSmallInteger('fk_consulta_signos_vitales');
            $table->decimal('temperatura_c', 4, 1);
            $table->decimal('peso_kg', 5, 2);
            $table->decimal('estatura_cm', 5, 2);
            $table->unsignedSmallInteger('presion_sistolica');
            $table->unsignedSmallInteger('presion_diastolica');
            $table->timestamp('fecha_registro');
            $table->foreign('fk_consulta_signos_vitales')->references('id_consulta_medica')->on('tb_consulta_medica');
        });

        Schema::create('tb_diagnostico', function (Blueprint $table) {
            $table->smallIncrements('id_diagnostico');
            $table->unsignedSmallInteger('fk_consulta_medica_diagnostico');
            $table->string('nombre_diagnostico', 150);
            $table->string('descripcion_diagnostico', 255);
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_crecion');
            $table->foreign('fk_consulta_medica_diagnostico')->references('id_consulta_medica')->on('tb_consulta_medica');
        });

        Schema::table('tb_expediente_clinico', function (Blueprint $table) {
            $table->foreign('fk_diagnostico_expediente_clinico')->references('id_diagnostico')->on('tb_diagnostico');
        });

        Schema::create('tb_tratamiento', function (Blueprint $table) {
            $table->smallIncrements('id_tratamiento');
            $table->unsignedSmallInteger('fk_paciente_tratamiento');
            $table->unsignedSmallInteger('fk_diagnostico_tratamiento');
            $table->unsignedSmallInteger('fk_padecimiento_tratamiento');
            $table->unsignedSmallInteger('fk_medicamento_tratamiento');
            $table->string('descripcion', 255)->nullable();
            $table->date('inicio_tratamiento');
            $table->date('termino_tratamiento');
            $table->string('indicaciones', 255);
            $table->timestamp('fecha_registro');
            $table->foreign('fk_paciente_tratamiento')->references('id_paciente')->on('tb_paciente');
            $table->foreign('fk_diagnostico_tratamiento')->references('id_diagnostico')->on('tb_diagnostico');
            $table->foreign('fk_padecimiento_tratamiento')->references('id_padecimiento')->on('tb_padecimiento');
            $table->foreign('fk_medicamento_tratamiento')->references('id_medicamento')->on('tb_medicamento');
        });

        Schema::create('tb_receta', function (Blueprint $table) {
            $table->smallIncrements('id_receta');
            $table->unsignedSmallInteger('fk_tratamiento_receta');
            $table->unsignedSmallInteger('fk_doctor_receta');
            $table->unsignedSmallInteger('fk_paciente_receta');
            $table->timestamp('fecha_receta');
            $table->text('observaciones')->nullable();
            $table->foreign('fk_tratamiento_receta')->references('id_tratamiento')->on('tb_tratamiento');
            $table->foreign('fk_doctor_receta')->references('pk_fk_usuario')->on('tb_doctor');
            $table->foreign('fk_paciente_receta')->references('id_paciente')->on('tb_paciente');
        });

        Schema::create('tb_tratamiento_medicamento', function (Blueprint $table) {
            $table->smallIncrements('id_medicamento_tratamiento');
            $table->unsignedSmallInteger('fk_medicamento');
            $table->unsignedSmallInteger('fk_tratamiento');
            $table->foreign('fk_medicamento')->references('id_medicamento')->on('tb_medicamento');
            $table->foreign('fk_tratamiento')->references('id_tratamiento')->on('tb_tratamiento');
        });

        Schema::create('tb_tratamiento_padecimiento', function (Blueprint $table) {
            $table->smallIncrements('id_padecimiento_tratamiento');
            $table->unsignedSmallInteger('fk_padecimiento');
            $table->unsignedSmallInteger('fk_tratamiento');
            $table->foreign('fk_padecimiento')->references('id_padecimiento')->on('tb_padecimiento');
            $table->foreign('fk_tratamiento')->references('id_tratamiento')->on('tb_tratamiento');
        });

        Schema::create('tb_pago', function (Blueprint $table) {
            $table->smallIncrements('id_pago');
            $table->unsignedSmallInteger('fk_cita');
            $table->unsignedSmallInteger('fk_consulta_medica');
            $table->unsignedSmallInteger('id_metodo_pago');
            $table->unsignedSmallInteger('fk_paciente');
            $table->decimal('monto', 10, 2);
            $table->timestamp('fecha_hora_pago');
            $table->string('folio_transaccion', 30)->nullable();
            $table->string('estatus_pago', 20)->nullable();
            $table->foreign('fk_cita')->references('id_cita')->on('tb_cita');
            $table->foreign('fk_consulta_medica')->references('id_consulta_medica')->on('tb_consulta_medica');
            $table->foreign('id_metodo_pago')->references('id_metodo_pago')->on('tb_metodo_pago');
            $table->foreign('fk_paciente')->references('id_paciente')->on('tb_paciente');
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('tb_expediente_clinico')) {
            Schema::table('tb_expediente_clinico', function (Blueprint $table) {
                $table->dropForeign(['fk_diagnostico_expediente_clinico']);
            });
        }

        Schema::dropIfExists('tb_pago');
        Schema::dropIfExists('tb_tratamiento_padecimiento');
        Schema::dropIfExists('tb_tratamiento_medicamento');
        Schema::dropIfExists('tb_receta');
        Schema::dropIfExists('tb_tratamiento');
        Schema::dropIfExists('tb_diagnostico');
        Schema::dropIfExists('tb_signo_vital');
        Schema::dropIfExists('tb_consulta_medica');
        Schema::dropIfExists('tb_enfermera_doctor_consultorio');
        Schema::dropIfExists('tb_doctor_consultorio');
        Schema::dropIfExists('tb_cita');
        Schema::dropIfExists('tb_documento');
        Schema::dropIfExists('tb_expediente_clinico');
        Schema::dropIfExists('tb_bitacora_auditoria');
        Schema::dropIfExists('tb_paciente_padecimiento');
        Schema::dropIfExists('tb_padecimiento');
        Schema::dropIfExists('tb_especialidad_enfermera');
        Schema::dropIfExists('tb_especialidad_doctor');
        Schema::dropIfExists('tb_rol_permiso');
        Schema::dropIfExists('tb_recuperacion_acceso');
        Schema::dropIfExists('tb_sesion_usuario');
        Schema::dropIfExists('tb_enfermera');
        Schema::dropIfExists('tb_doctor');
        Schema::dropIfExists('tb_usuario');
        Schema::dropIfExists('tb_consultorio');
        Schema::dropIfExists('tb_paciente');
        Schema::dropIfExists('tb_personal');
        Schema::dropIfExists('tb_sede');
        Schema::dropIfExists('tb_asentamiento');
        Schema::dropIfExists('tb_enfermedad');
        Schema::dropIfExists('tb_codigo_postal');
        Schema::dropIfExists('tb_bloque');
        Schema::dropIfExists('tb_contacto_emergencia');
        Schema::dropIfExists('tb_tutor');
        Schema::dropIfExists('tb_municipio_alcaldia');
        Schema::dropIfExists('tb_capitulo');
        Schema::dropIfExists('tb_cronicidad');
        Schema::dropIfExists('tb_medicamento');
        Schema::dropIfExists('tb_concepto');
        Schema::dropIfExists('tb_metodo_pago');
        Schema::dropIfExists('tb_estado_cita');
        Schema::dropIfExists('tb_tipo_sede');
        Schema::dropIfExists('tb_especialidad');
        Schema::dropIfExists('tb_estado_empleado');
        Schema::dropIfExists('tb_permiso');
        Schema::dropIfExists('tb_rol');
        Schema::dropIfExists('tb_parentesco');
        Schema::dropIfExists('tb_grupo_sanguineo');
        Schema::dropIfExists('tb_genero');
        Schema::dropIfExists('tb_estado');
    }
};
