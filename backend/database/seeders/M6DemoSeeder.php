<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class M6DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
        }

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('SET session_replication_role = replica');
        }

        $suffix = now()->format('His');

        $estadoId = $this->insertGetId('tb_estado', 'id_estado', [
            'uk_nombre_estado' => 'Ciudad Demo ' . $suffix,
        ]);

        $generoId = $this->insertGetId('tb_genero', 'id_genero', [
            'ukTipo_genero' => 'Femenino Demo ' . $suffix,
        ]);

        $grupoId = $this->insertGetId('tb_grupo_sanguineo', 'id_sanguineo', [
            'ukTipo_grupo' => 'O+ Demo ' . $suffix,
        ]);

        $parentescoId = $this->insertGetId('tb_parentesco', 'id_parentesco', [
            'ukTipo_parentesco' => 'Madre Demo ' . $suffix,
        ]);

        $rolId = $this->insertGetId('tb_rol', 'id_rol', [
            'uk_nombre_rol' => 'Medico Demo ' . $suffix,
            'descripcion' => 'Rol medico para pruebas del modulo 6',
            'estatus' => 'activo',
            'fecha_crecion' => now(),
            'fecha_modificacion' => now(),
        ]);

        $estadoEmpleadoId = $this->insertGetId('tb_estado_empleado', 'id_estado_empleado', [
            'ukTipo_estado' => 'Activo Demo ' . $suffix,
            'vv_descripcion' => 'Empleado activo para pruebas',
        ]);

        $especialidadId = $this->insertGetId('tb_especialidad', 'id_especialidad', [
            'uk_nombre' => 'Medicina General Demo ' . $suffix,
            'estatus' => 'activo',
            'vv_descripcion' => 'Especialidad demo',
        ]);

        $tipoSedeId = $this->insertGetId('tb_tipo_sede', 'id_tipo_sede', [
            'uk_nombre_tipo_sede' => 'Clinica Demo ' . $suffix,
            'vv_descripcion' => 'Sede de demostracion',
            'estatus' => 'activo',
        ]);

        $medicamentoId = $this->insertGetId('tb_medicamento', 'id_medicamento', [
            'uk_nombre_medicamento' => 'Paracetamol Demo ' . $suffix,
            'descripcion' => 'Analgesico y antipiretico',
            'presentacion' => 'Tabletas',
            'concentracion' => '500 mg',
        ]);

        $cronicidadId = $this->insertGetId('tb_cronicidad', 'id_cronico', [
            'ukTipo_cronicidad' => 'Agudo Demo ' . $suffix,
        ]);

        $capituloId = $this->insertGetId('tb_capitulo', 'id_capitulo', [
            'uk_nombrecapitulo' => 'Sintomas generales Demo ' . $suffix,
        ]);

        $municipioId = $this->insertGetId('tb_municipio_alcaldia', 'id_municipio_alcaldia', [
            'uk_nombremunicipio_alcaldia' => 'Alcaldia Demo ' . $suffix,
            'fk_estadomunicipio_alcaldia' => $estadoId,
        ]);

        $tutorId = $this->insertGetId('tb_tutor', 'id_tutor', [
            'vv_nombre_completo' => 'Tutor Demo ' . $suffix,
            'uk_telefono' => '5510' . $suffix,
            'fk_parentesco_tutor' => $parentescoId,
        ]);

        $contactoId = $this->insertGetId('tb_contacto_emergencia', 'id_contacto', [
            'vv_nombre_completo' => 'Contacto Demo ' . $suffix,
            'uk_telefono' => '5520' . $suffix,
            'fk_parentesco_contacto_emergencia' => $parentescoId,
        ]);

        $bloqueId = 'BD' . substr($suffix, -4);
        DB::table('tb_bloque')->insert([
            'id_bloque' => $bloqueId,
            'uk_nombre_bloque' => 'Bloque demo ' . $suffix,
            'id_capitulo_bloque' => $capituloId,
        ]);

        $codigoPostalId = $this->insertGetId('tb_codigo_postal', 'id_codigo_postal', [
            'uk_numero_codigo_postal' => substr('10' . $suffix, 0, 5),
            'fk_municipio_alcaldia_codigo_postal' => $municipioId,
        ]);

        $enfermedadId = 'ED' . substr($suffix, -4);
        DB::table('tb_enfermedad')->insert([
            'id_enfermedad' => $enfermedadId,
            'uk_tipo_enfermedad' => 'Fiebre demo ' . $suffix,
            'fk_bloque_enfermedad' => $bloqueId,
        ]);

        $asentamientoId = $this->insertGetId('tb_asentamiento', 'id_asentamiento', [
            'uk_nombre_colonia' => 'Colonia Demo ' . $suffix,
            'fk_codigo_postal_asentamiento' => $codigoPostalId,
        ]);

        $sedeId = $this->insertGetId('tb_sede', 'id_sede', [
            'nombre_sede' => 'Hopewell Demo',
            'fk_tipo_sede' => $tipoSedeId,
            'fk_asentamiento_sede' => $asentamientoId,
            'telefono' => '5530' . $suffix,
            'uk_correo' => 'sede.demo.' . $suffix . '@hopewell.test',
            'responsable' => 'Responsable Demo',
            'fecha_crecion' => now(),
            'estatus_operativo' => 'activo',
        ]);

        $personalId = $this->insertGetId('tb_personal', 'id_personal', [
            'fk_sede_personal' => $sedeId,
            'uk_numero_empleado' => 'EMP' . $suffix,
            'uk_curp' => 'DEMO900101MDFXXX' . substr($suffix, -1),
            'nombres' => 'Laura',
            'apellido_paterno' => 'Medina',
            'apellido_materno' => 'Demo',
            'telefono' => '5540' . $suffix,
            'uk_correo_electronico' => 'laura.medina.' . $suffix . '@hopewell.test',
            'estatus' => 'activo',
            'fecha_crecion' => now(),
            'fecha_modificacion' => now(),
        ]);

        $pacienteId = $this->insertGetId('tb_paciente', 'id_paciente', [
            'uk_curp' => 'PACD010101HDFXXX' . substr($suffix, -1),
            'nombres' => 'Carlos',
            'apellido_paterno' => 'Ramirez',
            'apellido_materno' => 'Demo',
            'fecha_nacimiento' => '1992-04-18',
            'fk_genero_paciente' => $generoId,
            'uk_telefono' => '5550' . $suffix,
            'uk_correo_electronico' => 'carlos.ramirez.' . $suffix . '@paciente.test',
            'fk_grupo_paciente' => $grupoId,
            'id_contacto_emergencia_paciente' => $contactoId,
            'id_asentamiento_paciente' => $asentamientoId,
            'calle' => 'Calle Demo',
            'numero_int' => null,
            'numero_ext' => '123',
            'fk_tutor_paciente' => $tutorId,
            'estatus' => 'activo',
            'vv_alergia' => 'Sin alergias registradas',
        ]);

        $usuarioId = $this->insertGetId('tb_usuario', 'id_usuario', [
            'nombre_usuario' => 'dra.demo.' . $suffix,
            'contrasena_hash' => Hash::make('Demo12345'),
            'estatus' => 'activo',
            'fk_personal_usuario' => $personalId,
            'fk_rol_usuario' => $rolId,
            'fk_genero_usuario' => $generoId,
            'uk_correo_electronico' => 'dra.demo.' . $suffix . '@hopewell.test',
            'requiere_cambio_contrasena' => false,
            'perfil_completo' => true,
            'intentos_fallidos' => 0,
            'bloqueado_hasta' => null,
            'ultimo_acceso' => now(),
            'fecha_crecion' => now(),
            'fecha_modificacion' => now(),
        ]);

        DB::table('tb_doctor')->insert([
            'pk_fk_usuario' => $usuarioId,
            'uk_cedula_profesional' => 'CED' . $suffix,
            'uk_rfc_personal' => 'DEMO900101AB' . substr($suffix, -1),
            'fk_asentamiento_doctor' => $asentamientoId,
            'fk_estado_empleado_doctor' => $estadoEmpleadoId,
        ]);

        DB::table('tb_especialidad_doctor')->insert([
            'fk_doctor' => $usuarioId,
            'fk_especialidad' => $especialidadId,
        ]);

        $padecimientoId = $this->insertGetId('tb_padecimiento', 'id_padecimiento', [
            'uk_nombre_padecimiento' => 'Fiebre estacional Demo ' . $suffix,
            'uk_codigo_cie' => 'R50' . substr($suffix, -2),
            'vv_descripcion' => 'Padecimiento demo para tratamiento',
            'fk_enfermedad_padecimiento' => $enfermedadId,
            'fk_cronicidad_padecimiento' => $cronicidadId,
            'fk_paciente_padecimiento' => $pacienteId,
        ]);

        $consultorioId = $this->insertGetId('tb_consultorio', 'id_consultorio', [
            'fk_sede_consultorio' => $sedeId,
            'observaciones' => 'Consultorio demo',
            'piso' => '1',
            'estatus' => 'activo',
            'nombre_consultorio' => 'Consultorio Demo',
            'numero_consultorio' => 'D-' . substr($suffix, -3),
            'fecha_crecion' => now(),
        ]);

        $expedienteId = $this->insertGetId('tb_expediente_clinico', 'id_expediente', [
            'fk_paciente_expediente_clinico' => $pacienteId,
            'motivo' => 'Fiebre y malestar general',
            'fk_diagnostico_expediente_clinico' => 1,
            'antecedente_familiar' => 'Sin antecedentes relevantes',
            'notas' => 'Expediente demo para M6',
            'fecha_apertura' => now(),
        ]);

        $consultaId = $this->insertGetId('tb_consulta_medica', 'id_consulta_medica', [
            'fk_consultorio_consulta_medica' => $consultorioId,
            'fk_expediente_consulta_medica' => $expedienteId,
            'fk_tipo_consulta' => 1,
            'horario' => '09:30:00',
            'motivo_consulta' => 'Fiebre desde hace 24 horas',
        ]);

        $diagnosticoId = $this->insertGetId('tb_diagnostico', 'id_diagnostico', [
            'fk_consulta_medica_diagnostico' => $consultaId,
            'nombre_diagnostico' => 'Fiebre viral demo',
            'descripcion_diagnostico' => 'Cuadro compatible con infeccion viral leve',
            'observaciones' => 'Reposo e hidratacion',
            'fecha_crecion' => now(),
        ]);

        DB::table('tb_expediente_clinico')
            ->where('id_expediente', $expedienteId)
            ->update(['fk_diagnostico_expediente_clinico' => $diagnosticoId]);

        $tratamientoId = $this->insertGetId('tb_tratamiento', 'id_tratamiento', [
            'fk_paciente_tratamiento' => $pacienteId,
            'fk_diagnostico_tratamiento' => $diagnosticoId,
            'fk_padecimiento_tratamiento' => $padecimientoId,
            'fk_medicamento_tratamiento' => $medicamentoId,
            'descripcion' => 'Tratamiento inicial para fiebre',
            'inicio_tratamiento' => now()->toDateString(),
            'termino_tratamiento' => now()->addDays(5)->toDateString(),
            'indicaciones' => 'Tomar medicamento cada 8 horas y mantener hidratacion',
            'fecha_registro' => now(),
            'estatus' => 'activo',
        ]);

        $recetaId = $this->insertGetId('tb_receta', 'id_receta', [
            'fk_tratamiento_receta' => $tratamientoId,
            'fk_doctor_receta' => $usuarioId,
            'fk_paciente_receta' => $pacienteId,
            'fecha_receta' => now(),
            'observaciones' => 'Suspender si presenta reaccion adversa',
            'dosis' => '1 tableta de 500 mg',
            'frecuencia' => 'Cada 8 horas',
            'duracion_receta' => '5 dias',
            'estatus' => 'activo',
        ]);

        DB::table('tb_bitacora_auditoria')->insert([
            'fk_usuario_auditoria' => $usuarioId,
            'modulo_afectado' => 'M6 - Gestion de Tratamientos y Recetas',
            'operacion_accion' => 'SEED_DEMO',
            'fecha_registro' => now(),
            'fecha_edicion' => now(),
            'tabla_afectada' => 'tb_tratamiento,tb_receta',
            'descripcion' => 'Datos demo M6 creados. Paciente #' . $pacienteId . ', tratamiento #' . $tratamientoId . ', receta #' . $recetaId . '.',
            'direccion_ip' => '127.0.0.1',
        ]);

        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON');
        }

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('SET session_replication_role = DEFAULT');
        }

        $this->command?->info('Datos demo M6 creados:');
        $this->command?->line('Paciente ID: ' . $pacienteId);
        $this->command?->line('Doctor/Usuario ID: ' . $usuarioId);
        $this->command?->line('Diagnostico ID: ' . $diagnosticoId);
        $this->command?->line('Tratamiento ID: ' . $tratamientoId);
        $this->command?->line('Receta ID: ' . $recetaId);
    }

    private function insertGetId(string $table, string $primaryKey, array $values): int
    {
        return (int) DB::table($table)->insertGetId($values, $primaryKey);
    }
}
