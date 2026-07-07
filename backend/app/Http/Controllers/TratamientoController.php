<?php

namespace App\Http\Controllers;

use App\Models\BitacoraAuditoria;
use App\Models\Paciente;
use App\Models\Tratamiento;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TratamientoController extends Controller
{
    public function store(Request $request, int $diagnostico): JsonResponse
    {
        $payload = array_merge($request->all(), [
            'fk_diagnostico_tratamiento' => $diagnostico,
        ]);

        $validator = Validator::make($payload, [
            'fk_paciente_tratamiento' => [
                'required',
                'integer',
                Rule::exists('tb_paciente', 'id_paciente')->where('estatus', 'activo'),
            ],
            'fk_diagnostico_tratamiento' => ['required', 'integer', Rule::exists('tb_diagnostico', 'id_diagnostico')],
            'fk_padecimiento_tratamiento' => ['required', 'integer', Rule::exists('tb_padecimiento', 'id_padecimiento')],
            'fk_medicamento_tratamiento' => ['required', 'integer', Rule::exists('tb_medicamento', 'id_medicamento')],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'inicio_tratamiento' => ['required', 'date'],
            'termino_tratamiento' => ['required', 'date', 'after:inicio_tratamiento'],
            'indicaciones' => ['required', 'string', 'max:255'],
        ], [
            'required' => 'El campo :attribute es obligatorio.',
            'exists' => 'El valor seleccionado en :attribute no existe o no esta activo.',
            'termino_tratamiento.after' => 'La fecha de termino debe ser posterior a la fecha de inicio.',
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'Campos obligatorios incompletos.', $validator->errors()->toArray(), 400);
        }

        $tratamiento = Tratamiento::create([
            ...$validator->validated(),
            'fecha_registro' => now(),
            'estatus' => 'activo',
        ]);

        $this->registrarAuditoria(
            $request,
            'CREAR',
            'tb_tratamiento',
            'Tratamiento #' . $tratamiento->id_tratamiento . ' registrado correctamente.',
        );

        return $this->apiResponse(true, $tratamiento, 'Tratamiento registrado correctamente', null, 201);
    }

    public function show(int $tratamiento): JsonResponse
    {
        $registro = Tratamiento::with(['paciente', 'diagnostico', 'padecimiento', 'medicamento'])
            ->where('estatus', 'activo')
            ->find($tratamiento);

        if (! $registro) {
            return $this->apiResponse(false, null, 'Tratamiento no encontrado.', null, 404);
        }

        return $this->apiResponse(true, $registro, 'Tratamiento consultado correctamente');
    }

    public function indexPorPaciente(int $paciente): JsonResponse
    {
        $pacienteExiste = Paciente::where('estatus', 'activo')->whereKey($paciente)->exists();

        if (! $pacienteExiste) {
            return $this->apiResponse(false, null, 'Paciente no encontrado.', null, 404);
        }

        $tratamientos = Tratamiento::with(['diagnostico', 'padecimiento', 'medicamento'])
            ->where('fk_paciente_tratamiento', $paciente)
            ->where('estatus', 'activo')
            ->orderByDesc('fecha_registro')
            ->get();

        return $this->apiResponse(true, $tratamientos, 'Tratamientos consultados correctamente');
    }

    public function updateEstatus(Request $request, int $tratamiento): JsonResponse
    {
        $registro = Tratamiento::find($tratamiento);

        if (! $registro) {
            return $this->apiResponse(false, null, 'Tratamiento no encontrado.', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'estatus' => ['required', 'string', Rule::in(['activo', 'inactivo'])],
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'Datos invalidos.', $validator->errors()->toArray(), 400);
        }

        $registro->update(['estatus' => $validator->validated()['estatus']]);

        $this->registrarAuditoria(
            $request,
            'CAMBIAR_ESTATUS',
            'tb_tratamiento',
            'Tratamiento #' . $registro->id_tratamiento . ' actualizado a ' . $registro->estatus . '.',
        );

        return $this->apiResponse(true, $registro, 'Estatus actualizado correctamente');
    }

    private function registrarAuditoria(Request $request, string $operacion, string $tabla, string $descripcion): void
    {
        $usuarioId = $this->resolveUsuarioId($request);

        if (! $usuarioId) {
            return;
        }

        BitacoraAuditoria::create([
            'fk_usuario_auditoria' => $usuarioId,
            'modulo_afectado' => 'M6 - Gestion de Tratamientos y Recetas',
            'operacion_accion' => $operacion,
            'fecha_registro' => now(),
            'fecha_edicion' => now(),
            'tabla_afectada' => $tabla,
            'descripcion' => $descripcion,
            'direccion_ip' => $request->ip(),
        ]);
    }

    private function resolveUsuarioId(Request $request): ?int
    {
        $headerUser = $request->header('X-Usuario-Id');

        if ($headerUser && Usuario::whereKey((int) $headerUser)->exists()) {
            return (int) $headerUser;
        }

        $authId = $request->user()?->getAuthIdentifier();

        if ($authId && Usuario::whereKey((int) $authId)->exists()) {
            return (int) $authId;
        }

        return Usuario::query()->value('id_usuario');
    }

    private function apiResponse(
        bool $success,
        mixed $data,
        string $message,
        ?array $errors = null,
        int $status = 200,
    ): JsonResponse {
        return response()->json([
            'success' => $success,
            'data' => $data,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
