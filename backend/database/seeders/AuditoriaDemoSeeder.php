<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuditoriaDemoSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $sedeId = DB::table('tb_sede')->value('id_sede');
        $generoId = DB::table('tb_genero')->value('id_genero');

        $roles = [
            'Administrador General' => 'Acceso administrativo completo',
            'Auditor' => 'Consulta y exportacion de auditoria',
            'Medico' => 'Operacion clinica',
            'Enfermera' => 'Apoyo clinico',
            'Recepcionista' => 'Atencion y agenda',
        ];

        foreach ($roles as $nombre => $descripcion) {
            DB::table('tb_rol')->updateOrInsert(
                ['uk_nombre_rol' => $nombre],
                [
                    'descripcion' => $descripcion,
                    'estatus' => 'activo',
                    'fecha_crecion' => $now,
                    'fecha_modificacion' => $now,
                ],
            );
        }

        $usuarios = [
            ['AUDITOR', 'auditor@hopewell.com', 'Auditor', 'AUD-0001', 'AUPR900101HDFABC01'],
            ['MEDICO', 'medico@hopewell.com', 'Medico', 'MED-0001', 'MEPR900101HDFABC01'],
            ['ENFERMERA', 'enfermera@hopewell.com', 'Enfermera', 'ENF-0001', 'ENPR900101HDFABC01'],
            ['RECEPCION', 'recepcion@hopewell.com', 'Recepcionista', 'REC-0001', 'REPR900101HDFABC01'],
        ];

        foreach ($usuarios as [$nombreUsuario, $correo, $rol, $numeroEmpleado, $curp]) {
            DB::table('tb_personal')->updateOrInsert(
                ['uk_correo_electronico' => $correo],
                [
                    'fk_sede_personal' => $sedeId,
                    'uk_numero_empleado' => $numeroEmpleado,
                    'uk_curp' => $curp,
                    'nombres' => ucfirst(strtolower($nombreUsuario)),
                    'apellido_paterno' => 'Demo',
                    'apellido_materno' => null,
                    'telefono' => '555' . random_int(1000000, 9999999),
                    'estatus' => 'activo',
                    'fecha_crecion' => $now,
                    'fecha_modificacion' => $now,
                ],
            );

            DB::table('tb_usuario')->updateOrInsert(
                ['uk_correo_electronico' => $correo],
                [
                    'nombre_usuario' => $nombreUsuario,
                    'contrasena_hash' => Hash::make('1234'),
                    'estatus' => 'activo',
                    'fk_personal_usuario' => DB::table('tb_personal')->where('uk_correo_electronico', $correo)->value('id_personal'),
                    'fk_rol_usuario' => DB::table('tb_rol')->where('uk_nombre_rol', $rol)->value('id_rol'),
                    'fk_genero_usuario' => $generoId,
                    'requiere_cambio_contrasena' => false,
                    'perfil_completo' => true,
                    'intentos_fallidos' => 0,
                    'bloqueado_hasta' => null,
                    'ultimo_acceso' => $now,
                    'fecha_crecion' => $now,
                    'fecha_modificacion' => $now,
                ],
            );
        }

        $userIds = DB::table('tb_usuario')->pluck('id_usuario')->all();
        $modules = [
            ['M1 - Usuarios y Accesos', 'tb_usuario'],
            ['M2 - Doctores', 'tb_doctor'],
            ['M4 - Consultas Medicas', 'tb_consulta_medica'],
            ['M6 - Gestion de Tratamientos y Recetas', 'tb_tratamiento'],
            ['M10 - Citas', 'tb_cita'],
            ['M12 - Reportes', 'tb_consulta_medica'],
            ['M13 - Auditorias', 'tb_bitacora_auditoria'],
        ];
        $actions = ['CREAR', 'CONSULTAR', 'ACTUALIZAR', 'ELIMINAR', 'EXPORTAR'];

        for ($i = 1; $i <= 45; $i++) {
            [$module, $table] = $modules[array_rand($modules)];
            $action = $actions[array_rand($actions)];
            $userId = $userIds[array_rand($userIds)];
            $registeredAt = $now->copy()
                ->subDays(random_int(0, 25))
                ->subHours(random_int(0, 20))
                ->subMinutes(random_int(0, 59));

            DB::table('tb_bitacora_auditoria')->insert([
                'fk_usuario_auditoria' => $userId,
                'modulo_afectado' => $module,
                'operacion_accion' => $action,
                'fecha_registro' => $registeredAt,
                'fecha_edicion' => $registeredAt,
                'tabla_afectada' => $table,
                'descripcion' => $this->descripcion($action, $table, $i),
                'direccion_ip' => '192.168.1.' . random_int(10, 240),
            ]);
        }
    }

    private function descripcion(string $action, string $table, int $id): string
    {
        return match ($action) {
            'CREAR' => "Se creo un registro demo #{$id} en {$table}.",
            'CONSULTAR' => "Se consulto informacion demo #{$id} de {$table}.",
            'ACTUALIZAR' => "Se actualizo el registro demo #{$id} en {$table}.",
            'ELIMINAR' => "Se elimino logicamente el registro demo #{$id} en {$table}.",
            'EXPORTAR' => "Se exporto informacion demo #{$id} de {$table}.",
            default => "Evento demo #{$id} en {$table}.",
        };
    }
}
