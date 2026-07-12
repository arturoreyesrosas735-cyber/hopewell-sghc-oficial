<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DiagnosticoController extends Controller
{
    public function resumen(): JsonResponse
    {
        try {
            $diagnosticos = DB::table('tb_diagnostico as d')
                ->leftJoin('tb_consulta_medica as c', 'c.id_consulta_medica', '=', 'd.fk_consulta_medica_diagnostico')
                ->leftJoin('tb_expediente_clinico as e', 'e.id_expediente_clinico', '=', 'c.fk_expediente_clinico_consulta')
                ->leftJoin('tb_paciente as p', 'p.id_paciente', '=', 'e.fk_paciente_expediente')
                ->select(
                    'd.id_diagnostico',
                    'd.fk_consulta_medica_diagnostico',
                    'd.nombre_diagnostico',
                    'd.descripcion_diagnostico',
                    'd.observaciones',
                    'd.fecha_crecion',
                    'p.nombre as paciente_nombre',
                    'p.apellido_paterno as paciente_apellido'
                )
                ->orderByDesc('d.fecha_crecion')
                ->limit(20)
                ->get();

            return response()->json([
                'data' => $diagnosticos,
                'meta' => [
                    'total' => $diagnosticos->count(),
                    'pendientes_revision' => $diagnosticos->where('observaciones', null)->count(),
                ],
            ]);
        } catch (QueryException $exception) {
            return response()->json($this->demoResumen());
        }
    }

    public function indexByConsulta(int $consulta): JsonResponse
    {
        try {
            $diagnosticos = DB::table('tb_diagnostico')
                ->where('fk_consulta_medica_diagnostico', $consulta)
                ->orderByDesc('fecha_crecion')
                ->get();

            return response()->json(['data' => $diagnosticos]);
        } catch (QueryException $exception) {
            return response()->json(['data' => $this->demoDiagnosticos($consulta)]);
        }
    }

    public function indexByExpediente(int $expediente): JsonResponse
    {
        try {
            $diagnosticos = DB::table('tb_diagnostico as d')
                ->join('tb_consulta_medica as c', 'c.id_consulta_medica', '=', 'd.fk_consulta_medica_diagnostico')
                ->where('c.fk_expediente_clinico_consulta', $expediente)
                ->select('d.*', 'c.fecha_consulta')
                ->orderByDesc('d.fecha_crecion')
                ->get();

            return response()->json(['data' => $diagnosticos]);
        } catch (QueryException $exception) {
            return response()->json(['data' => $this->demoDiagnosticos(1)]);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $diagnostico = DB::table('tb_diagnostico')
                ->where('id_diagnostico', $id)
                ->first();

            if (!$diagnostico) {
                return response()->json(['message' => 'Diagnostico no encontrado.'], 404);
            }

            return response()->json(['data' => $diagnostico]);
        } catch (QueryException $exception) {
            $diagnostico = collect($this->demoDiagnosticos(1))->firstWhere('id_diagnostico', $id);

            return $diagnostico
                ? response()->json(['data' => $diagnostico])
                : response()->json(['message' => 'Diagnostico no encontrado.'], 404);
        }
    }

    public function store(Request $request, int $consulta): JsonResponse
    {
        try {
            $payload = $this->validatePayload($request);

            $id = DB::table('tb_diagnostico')->insertGetId([
                'fk_consulta_medica_diagnostico' => $consulta,
                'nombre_diagnostico' => $payload['nombre_diagnostico'],
                'descripcion_diagnostico' => $payload['descripcion_diagnostico'],
                'observaciones' => $payload['observaciones'] ?? null,
                'fecha_crecion' => now(),
            ], 'id_diagnostico');

            return $this->show($id)->setStatusCode(201);
        } catch (ValidationException $exception) {
            return response()->json(['message' => 'Datos invalidos.', 'errors' => $exception->errors()], 422);
        } catch (QueryException $exception) {
            return response()->json([
                'message' => 'No se pudo guardar el diagnostico. Revisa que la consulta exista.',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $payload = $this->validatePayload($request, false);

            $updated = DB::table('tb_diagnostico')
                ->where('id_diagnostico', $id)
                ->update(array_filter([
                    'nombre_diagnostico' => $payload['nombre_diagnostico'] ?? null,
                    'descripcion_diagnostico' => $payload['descripcion_diagnostico'] ?? null,
                    'observaciones' => array_key_exists('observaciones', $payload) ? $payload['observaciones'] : null,
                ], fn ($value) => $value !== null));

            if ($updated === 0) {
                return response()->json(['message' => 'Diagnostico no encontrado o sin cambios.'], 404);
            }

            return $this->show($id);
        } catch (ValidationException $exception) {
            return response()->json(['message' => 'Datos invalidos.', 'errors' => $exception->errors()], 422);
        } catch (QueryException $exception) {
            return response()->json([
                'message' => 'No se pudo actualizar el diagnostico.',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    private function validatePayload(Request $request, bool $required = true): array
    {
        $rule = $required ? 'required' : 'sometimes';

        $validator = Validator::make($request->all(), [
            'nombre_diagnostico' => [$rule, 'string', 'max:120'],
            'descripcion_diagnostico' => [$rule, 'string', 'max:1000'],
            'observaciones' => ['nullable', 'string', 'max:1000'],
        ]);

        return $validator->validate();
    }

    private function demoResumen(): array
    {
        return [
            'data' => $this->demoDiagnosticos(1),
            'meta' => [
                'total' => 2,
                'pendientes_revision' => 1,
            ],
        ];
    }

    private function demoDiagnosticos(int $consulta): array
    {
        return [
            [
                'id_diagnostico' => 1,
                'fk_consulta_medica_diagnostico' => $consulta,
                'nombre_diagnostico' => 'Rinitis alergica',
                'descripcion_diagnostico' => 'Cuadro compatible con rinitis alergica estacional.',
                'observaciones' => 'Vigilar respuesta al tratamiento en 7 dias.',
                'fecha_crecion' => now()->subDay()->toDateTimeString(),
                'paciente_nombre' => 'Laura',
                'paciente_apellido' => 'Lopez',
            ],
            [
                'id_diagnostico' => 2,
                'fk_consulta_medica_diagnostico' => $consulta,
                'nombre_diagnostico' => 'Cefalea tensional',
                'descripcion_diagnostico' => 'Dolor opresivo sin datos de alarma durante la exploracion.',
                'observaciones' => null,
                'fecha_crecion' => now()->toDateTimeString(),
                'paciente_nombre' => 'Jose',
                'paciente_apellido' => 'Garcia',
            ],
        ];
    }
}
