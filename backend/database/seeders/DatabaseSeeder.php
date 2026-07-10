<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $now = now();

        DB::table('tb_estado')->updateOrInsert(
            ['uk_nombre_estado' => 'Ciudad de Mexico'],
            ['uk_nombre_estado' => 'Ciudad de Mexico'],
        );
        $estadoId = DB::table('tb_estado')->where('uk_nombre_estado', 'Ciudad de Mexico')->value('id_estado');

        DB::table('tb_genero')->updateOrInsert(
            ['ukTipo_genero' => 'No especificado'],
            ['ukTipo_genero' => 'No especificado'],
        );
        $generoId = DB::table('tb_genero')->where('ukTipo_genero', 'No especificado')->value('id_genero');

        DB::table('tb_tipo_sede')->updateOrInsert(
            ['uk_nombre_tipo_sede' => 'Clinica'],
            ['vv_descripcion' => 'Sede clinica principal', 'estatus' => 'activo'],
        );
        $tipoSedeId = DB::table('tb_tipo_sede')->where('uk_nombre_tipo_sede', 'Clinica')->value('id_tipo_sede');

        DB::table('tb_municipio_alcaldia')->updateOrInsert(
            ['uk_nombremunicipio_alcaldia' => 'Benito Juarez'],
            ['fk_estadomunicipio_alcaldia' => $estadoId],
        );
        $municipioId = DB::table('tb_municipio_alcaldia')->where('uk_nombremunicipio_alcaldia', 'Benito Juarez')->value('id_municipio_alcaldia');

        DB::table('tb_codigo_postal')->updateOrInsert(
            ['uk_numero_codigo_postal' => '03100'],
            ['fk_municipio_alcaldia_codigo_postal' => $municipioId],
        );
        $codigoPostalId = DB::table('tb_codigo_postal')->where('uk_numero_codigo_postal', '03100')->value('id_codigo_postal');

        DB::table('tb_asentamiento')->updateOrInsert(
            ['uk_nombre_colonia' => 'Del Valle'],
            ['fk_codigo_postal_asentamiento' => $codigoPostalId],
        );
        $asentamientoId = DB::table('tb_asentamiento')->where('uk_nombre_colonia', 'Del Valle')->value('id_asentamiento');

        DB::table('tb_sede')->updateOrInsert(
            ['uk_correo' => 'principal@hopewell.com'],
            [
                'nombre_sede' => 'Hopewell Principal',
                'fk_tipo_sede' => $tipoSedeId,
                'fk_asentamiento_sede' => $asentamientoId,
                'telefono' => '5550000000',
                'responsable' => 'Administrador General',
                'fecha_crecion' => $now,
                'estatus_operativo' => 'activo',
            ],
        );
        $sedeId = DB::table('tb_sede')->where('uk_correo', 'principal@hopewell.com')->value('id_sede');

        DB::table('tb_rol')->updateOrInsert(
            ['uk_nombre_rol' => 'Administrador General'],
            [
                'descripcion' => 'Acceso administrativo completo',
                'estatus' => 'activo',
                'fecha_crecion' => $now,
                'fecha_modificacion' => $now,
            ],
        );
        $rolId = DB::table('tb_rol')->where('uk_nombre_rol', 'Administrador General')->value('id_rol');

        DB::table('tb_permiso')->updateOrInsert(
            ['nombre_permiso' => 'ver_auditoria'],
            [
                'modulo' => 'M13 - Auditorias',
                'accion' => 'CONSULTAR',
                'descripcion' => 'Consultar registros de auditoria',
                'estatus' => 'activo',
            ],
        );

        DB::table('tb_personal')->updateOrInsert(
            ['uk_correo_electronico' => 'admin@hopewell.com'],
            [
                'fk_sede_personal' => $sedeId,
                'uk_numero_empleado' => 'EMP-0001',
                'uk_curp' => 'HEPA900101HDFABC01',
                'nombres' => 'Administrador',
                'apellido_paterno' => 'Hopewell',
                'apellido_materno' => null,
                'telefono' => '5550000001',
                'estatus' => 'activo',
                'fecha_crecion' => $now,
                'fecha_modificacion' => $now,
            ],
        );
        $personalId = DB::table('tb_personal')->where('uk_correo_electronico', 'admin@hopewell.com')->value('id_personal');

        DB::table('tb_usuario')->updateOrInsert(
            ['uk_correo_electronico' => 'admin@hopewell.com'],
            [
                'nombre_usuario' => 'ADMINISTRADOR',
                'contrasena_hash' => Hash::make('1234'),
                'estatus' => 'activo',
                'fk_personal_usuario' => $personalId,
                'fk_rol_usuario' => $rolId,
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
        $usuarioId = DB::table('tb_usuario')->where('uk_correo_electronico', 'admin@hopewell.com')->value('id_usuario');

        $eventos = [
            ['M1 - Usuarios y Accesos', 'CREAR', 'tb_usuario', 'Se creo el usuario Administrador.'],
            ['M12 - Reportes', 'CONSULTAR', 'tb_consulta_medica', 'Se genero reporte de consultas por periodo.'],
            ['M13 - Auditorias', 'CONSULTAR', 'tb_bitacora_auditoria', 'Consulta de bitacora completa.'],
            ['M6 - Gestion de Tratamientos y Recetas', 'CREAR', 'tb_tratamiento', 'Se registro tratamiento de ejemplo.'],
            ['M4 - Consultas Medicas', 'ACTUALIZAR', 'tb_consulta_medica', 'Se actualizo informacion de consulta.'],
        ];

        foreach ($eventos as $index => [$modulo, $operacion, $tabla, $descripcion]) {
            if (DB::table('tb_bitacora_auditoria')->where('descripcion', $descripcion)->exists()) {
                continue;
            }

            DB::table('tb_bitacora_auditoria')->insert([
                'fk_usuario_auditoria' => $usuarioId,
                'modulo_afectado' => $modulo,
                'operacion_accion' => $operacion,
                'fecha_registro' => $now->copy()->subMinutes($index * 15),
                'fecha_edicion' => $now->copy()->subMinutes($index * 15),
                'tabla_afectada' => $tabla,
                'descripcion' => $descripcion,
                'direccion_ip' => '127.0.0.1',
            ]);
        }

        DB::table('users')->updateOrInsert([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => Hash::make('password'),
            'email_verified_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
