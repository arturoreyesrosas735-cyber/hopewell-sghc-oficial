<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class M6PatientRosterSeeder extends Seeder
{
    public function run(): void
    {
        $doctorId = DB::table('tb_doctor')->value('pk_fk_usuario');
        $medicamentoId = DB::table('tb_medicamento')->value('id_medicamento');
        $consultorioId = DB::table('tb_consultorio')->value('id_consultorio');
        $generoId = DB::table('tb_genero')->value('id_genero');
        $grupoId = DB::table('tb_grupo_sanguineo')->value('id_sanguineo');
        $contactoId = DB::table('tb_contacto_emergencia')->value('id_contacto');
        $asentamientoId = DB::table('tb_asentamiento')->value('id_asentamiento');
        $tutorId = DB::table('tb_tutor')->value('id_tutor');
        $enfermedadId = DB::table('tb_enfermedad')->value('id_enfermedad');
        $cronicidadId = DB::table('tb_cronicidad')->value('id_cronico');
        $diagnosticoBaseId = DB::table('tb_diagnostico')->value('id_diagnostico');

        if (! $doctorId || ! $medicamentoId || ! $consultorioId || ! $diagnosticoBaseId) {
            $this->command?->error('Primero ejecuta M6DemoSeeder para crear catalogos base.');
            return;
        }

        DB::table('tb_paciente')
            ->where('id_paciente', 1)
            ->update([
                'nombres' => 'Andres',
                'apellido_paterno' => 'Fabian',
                'apellido_materno' => 'Ramirez',
                'uk_correo_electronico' => 'andres.fabian@paciente.test',
            ]);

        $patients = [
            ['Arely', 'Rivera', 'Guillen', '1998-09-12', 'Migraña recurrente', 'Control de migraña', 'Tomar medicamento al iniciar dolor y evitar desvelo', '1 tableta de 500 mg', 'Cada 12 horas', '3 dias'],
            ['Sofia', 'Hernandez', 'Luna', '1987-02-03', 'Rinitis alergica', 'Tratamiento antihistaminico', 'Evitar polvo y cambios bruscos de temperatura', '1 tableta', 'Cada 24 horas', '7 dias'],
            ['Miguel', 'Torres', 'Salinas', '1979-11-25', 'Dolor lumbar', 'Manejo de dolor lumbar', 'Reposo relativo y ejercicios suaves de estiramiento', '1 tableta de 500 mg', 'Cada 8 horas', '5 dias'],
            ['Valeria', 'Mendoza', 'Cruz', '2001-06-17', 'Gastritis leve', 'Proteccion gastrica', 'Tomar medicamento antes de alimentos y evitar irritantes', '1 capsula', 'Cada 24 horas', '14 dias'],
            ['Daniel', 'Ortega', 'Santos', '1994-12-08', 'Faringitis aguda', 'Tratamiento sintomatico', 'Mantener hidratacion y vigilar fiebre persistente', '1 tableta de 500 mg', 'Cada 8 horas', '4 dias'],
        ];

        foreach ($patients as $index => $patient) {
            [$nombres, $apellidoPaterno, $apellidoMaterno, $nacimiento, $padecimiento, $diagnostico, $indicaciones, $dosis, $frecuencia, $duracion] = $patient;
            $tag = now()->format('His') . $index;

            $pacienteId = $this->insertGetId('tb_paciente', 'id_paciente', [
                'uk_curp' => 'DEMO' . str_pad((string) $index, 14, '0'),
                'nombres' => $nombres,
                'apellido_paterno' => $apellidoPaterno,
                'apellido_materno' => $apellidoMaterno,
                'fecha_nacimiento' => $nacimiento,
                'fk_genero_paciente' => $generoId,
                'uk_telefono' => '56' . str_pad((string) (70000000 + $index), 8, '0'),
                'uk_correo_electronico' => strtolower($nombres . '.' . $apellidoPaterno . '.' . $tag) . '@paciente.test',
                'fk_grupo_paciente' => $grupoId,
                'id_contacto_emergencia_paciente' => $contactoId,
                'id_asentamiento_paciente' => $asentamientoId,
                'calle' => 'Calle Salud ' . ($index + 10),
                'numero_int' => null,
                'numero_ext' => (string) (120 + $index),
                'fk_tutor_paciente' => $tutorId,
                'estatus' => 'activo',
                'vv_alergia' => $index % 2 === 0 ? 'Sin alergias registradas' : 'Alergia leve a polvo',
            ]);

            $padecimientoId = $this->insertGetId('tb_padecimiento', 'id_padecimiento', [
                'uk_nombre_padecimiento' => $padecimiento . ' Demo ' . $tag,
                'uk_codigo_cie' => 'D' . str_pad((string) $index, 4, '0', STR_PAD_LEFT),
                'vv_descripcion' => $padecimiento . ' registrado para simulacion del modulo 6.',
                'fk_enfermedad_padecimiento' => $enfermedadId,
                'fk_cronicidad_padecimiento' => $cronicidadId,
                'fk_paciente_padecimiento' => $pacienteId,
            ]);

            $expedienteId = $this->insertGetId('tb_expediente_clinico', 'id_expediente', [
                'fk_paciente_expediente_clinico' => $pacienteId,
                'motivo' => $padecimiento,
                'fk_diagnostico_expediente_clinico' => $diagnosticoBaseId,
                'antecedente_familiar' => 'Sin antecedentes familiares relevantes',
                'notas' => 'Expediente demo para paciente ' . $nombres . ' ' . $apellidoPaterno,
                'fecha_apertura' => now(),
            ]);

            $consultaId = $this->insertGetId('tb_consulta_medica', 'id_consulta_medica', [
                'fk_consultorio_consulta_medica' => $consultorioId,
                'fk_expediente_consulta_medica' => $expedienteId,
                'fk_tipo_consulta' => 1,
                'horario' => '10:0' . $index . ':00',
                'motivo_consulta' => $padecimiento,
            ]);

            $diagnosticoId = $this->insertGetId('tb_diagnostico', 'id_diagnostico', [
                'fk_consulta_medica_diagnostico' => $consultaId,
                'nombre_diagnostico' => $diagnostico,
                'descripcion_diagnostico' => $diagnostico . ' para pruebas funcionales.',
                'observaciones' => 'Seguimiento en consulta si no mejora.',
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
                'descripcion' => 'Plan terapeutico para ' . strtolower($padecimiento),
                'inicio_tratamiento' => now()->toDateString(),
                'termino_tratamiento' => now()->addDays(7 + $index)->toDateString(),
                'indicaciones' => $indicaciones,
                'fecha_registro' => now(),
                'estatus' => 'activo',
            ]);

            $this->insertGetId('tb_receta', 'id_receta', [
                'fk_tratamiento_receta' => $tratamientoId,
                'fk_doctor_receta' => $doctorId,
                'fk_paciente_receta' => $pacienteId,
                'fecha_receta' => now(),
                'observaciones' => 'Receta demo generada para simulacion.',
                'dosis' => $dosis,
                'frecuencia' => $frecuencia,
                'duracion_receta' => $duracion,
                'estatus' => 'activo',
            ]);
        }

        $this->command?->info('Pacientes demo M6 actualizados y agregados.');
    }

    private function insertGetId(string $table, string $primaryKey, array $values): int
    {
        return (int) DB::table($table)->insertGetId($values, $primaryKey);
    }
}
