<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EspecialidadController extends Controller
{
    private const NAME_REGEX = '/^[\pL\pN\s.\-]+$/u';

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $estado = trim((string) $request->query('estado', 'Todos'));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = 10;

        $query = DB::table('tb_especialidad as especialidad')
            ->leftJoin('tb_especialidad_doctor as especialidad_doctor', 'especialidad_doctor.fk_especialidad', '=', 'especialidad.id_especialidad')
            ->select([
                'especialidad.id_especialidad',
                'especialidad.uk_nombre',
                'especialidad.vv_descripcion',
                'especialidad.estatus',
                DB::raw('COUNT(especialidad_doctor.fk_doctor) as doctores_asignados'),
            ])
            ->groupBy('especialidad.id_especialidad', 'especialidad.uk_nombre', 'especialidad.vv_descripcion', 'especialidad.estatus')
            ->orderByRaw('LOWER(especialidad.uk_nombre) ASC');

        if ($search !== '') {
            $query->where(function ($currentQuery) use ($search): void {
                $currentQuery
                    ->where('especialidad.uk_nombre', 'ilike', "%{$search}%")
                    ->orWhere('especialidad.vv_descripcion', 'ilike', "%{$search}%");
            });
        }

        if ($estado !== '' && $estado !== 'Todos') {
            $query->where('especialidad.estatus', $estado);
        }

        $total = (clone $query)->get()->count();
        $rows = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        return response()->json([
            'data' => $rows,
            'meta' => [
                'current_page' => $page,
                'last_page' => max((int) ceil($total / $perPage), 1),
                'per_page' => $perPage,
                'total' => $total,
            ],
            'message' => 'Listado cargado correctamente.',
        ]);
    }

    public function show(int $especialidad): JsonResponse
    {
        $record = DB::table('tb_especialidad')
            ->where('id_especialidad', $especialidad)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Especialidad no encontrada.'], 404);
        }

        return response()->json($record);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'uk_nombre' => [
                'required',
                'string',
                'max:100',
                'regex:'.self::NAME_REGEX,
                Rule::unique('tb_especialidad', 'uk_nombre'),
            ],
            'vv_descripcion' => ['required', 'string', 'max:255'],
            'estatus' => ['required', 'string', Rule::in(['Activo', 'Inactivo'])],
        ]);

        $especialidadId = (int) DB::table('tb_especialidad')->insertGetId([
            'uk_nombre' => $data['uk_nombre'],
            'vv_descripcion' => $data['vv_descripcion'],
            'estatus' => $data['estatus'],
        ], 'id_especialidad');

        $this->recordAudit(
            $request,
            'ALTA',
            'tb_especialidad',
            "Se registró la especialidad {$data['uk_nombre']} con estado {$data['estatus']}.",
        );

        return response()->json(['id_especialidad' => $especialidadId, 'message' => 'Especialidad registrada exitosamente.'], 201);
    }

    public function update(Request $request, int $especialidad): JsonResponse
    {
        $current = DB::table('tb_especialidad')
            ->where('id_especialidad', $especialidad)
            ->first();

        if (!$current) {
            return response()->json(['message' => 'Especialidad no encontrada.'], 404);
        }

        $data = $request->validate([
            'uk_nombre' => [
                'required',
                'string',
                'max:100',
                'regex:'.self::NAME_REGEX,
                Rule::unique('tb_especialidad', 'uk_nombre')->ignore($especialidad, 'id_especialidad'),
            ],
            'vv_descripcion' => ['required', 'string', 'max:255'],
            'estatus' => ['required', 'string', Rule::in(['Activo', 'Inactivo'])],
        ]);

        DB::table('tb_especialidad')
            ->where('id_especialidad', $especialidad)
            ->update([
                'uk_nombre' => $data['uk_nombre'],
                'vv_descripcion' => $data['vv_descripcion'],
                'estatus' => $data['estatus'],
            ]);

        $this->recordAudit(
            $request,
            'MODIFICACION',
            'tb_especialidad',
            "Se actualizó la especialidad {$especialidad}. Antes: {$current->uk_nombre} / {$current->vv_descripcion} / {$current->estatus}. Ahora: {$data['uk_nombre']} / {$data['vv_descripcion']} / {$data['estatus']}.",
        );

        return response()->json(['id_especialidad' => $especialidad, 'message' => 'Los cambios se han guardado correctamente.']);
    }

    public function cambiarEstado(Request $request, int $especialidad): JsonResponse
    {
        $current = DB::table('tb_especialidad')
            ->where('id_especialidad', $especialidad)
            ->first();

        if (!$current) {
            return response()->json(['message' => 'Especialidad no encontrada.'], 404);
        }

        $data = $request->validate([
            'estatus' => ['required', 'string', Rule::in(['Activo', 'Inactivo'])],
        ]);

        DB::table('tb_especialidad')
            ->where('id_especialidad', $especialidad)
            ->update(['estatus' => $data['estatus']]);

        $this->recordAudit(
            $request,
            $data['estatus'] === 'Activo' ? 'REACTIVACION' : 'BAJA',
            'tb_especialidad',
            "Se cambió el estado de la especialidad {$current->uk_nombre} de {$current->estatus} a {$data['estatus']}.",
        );

        return response()->json([
            'id_especialidad' => $especialidad,
            'estatus' => $data['estatus'],
            'message' => 'El estado de la especialidad se ha actualizado correctamente.',
        ]);
    }

    private function recordAudit(Request $request, string $operation, string $table, string $description): void
    {
        $actorUserId = (int) ($request->user()?->getAuthIdentifier() ?? DB::table('tb_usuario')->value('id_usuario'));

        if (!$actorUserId) {
            return;
        }

        DB::table('tb_bitacora_auditoria')->insert([
            'fk_usuario_auditoria' => $actorUserId,
            'modulo_afectado' => 'Especialidades',
            'operacion_accion' => $operation,
            'fecha_registro' => now(),
            'fecha_edicion' => now(),
            'tabla_afectada' => $table,
            'descripcion' => $description,
            'direccion_ip' => $request->ip(),
        ]);
    }
}
