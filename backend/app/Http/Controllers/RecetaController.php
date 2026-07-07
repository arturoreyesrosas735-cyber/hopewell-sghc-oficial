<?php

namespace App\Http\Controllers;

use App\Models\BitacoraAuditoria;
use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Receta;
use App\Models\Tratamiento;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RecetaController extends Controller
{
    public function store(Request $request, int $tratamiento): JsonResponse
    {
        $tratamientoRegistro = Tratamiento::where('estatus', 'activo')->find($tratamiento);

        if (! $tratamientoRegistro) {
            return $this->apiResponse(false, null, 'Debe seleccionar un tratamiento.', null, 400);
        }

        $payload = array_merge($request->all(), [
            'fk_tratamiento_receta' => $tratamiento,
            'fk_paciente_receta' => $request->input('fk_paciente_receta', $tratamientoRegistro->fk_paciente_tratamiento),
        ]);

        $validator = Validator::make($payload, [
            'fk_tratamiento_receta' => ['required', 'integer', Rule::exists('tb_tratamiento', 'id_tratamiento')->where('estatus', 'activo')],
            'fk_paciente_receta' => ['required', 'integer', Rule::exists('tb_paciente', 'id_paciente')->where('estatus', 'activo')],
            'fecha_receta' => ['nullable', 'date'],
            'observaciones' => ['nullable', 'string'],
            'dosis' => ['required', 'string', 'max:100'],
            'frecuencia' => ['required', 'string', 'max:100'],
            'duracion_receta' => ['required', 'string', 'max:100'],
        ], [
            'required' => 'El campo :attribute es obligatorio.',
            'exists' => 'El valor seleccionado en :attribute no existe o no esta activo.',
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'Datos invalidos.', $validator->errors()->toArray(), 400);
        }

        $doctorId = $this->resolveDoctorId($request);

        if (! $doctorId) {
            return $this->apiResponse(false, null, 'No hay doctor disponible para emitir la receta.', [
                'fk_doctor_receta' => ['Debe existir un doctor para generar la receta.'],
            ], 400);
        }

        $validated = $validator->validated();
        $receta = Receta::create([
            'fk_tratamiento_receta' => $validated['fk_tratamiento_receta'],
            'fk_doctor_receta' => $doctorId,
            'fk_paciente_receta' => $validated['fk_paciente_receta'],
            'fecha_receta' => $validated['fecha_receta'] ?? now(),
            'observaciones' => $validated['observaciones'] ?? null,
            'dosis' => $validated['dosis'],
            'frecuencia' => $validated['frecuencia'],
            'duracion_receta' => $validated['duracion_receta'],
            'estatus' => 'activo',
        ]);

        $this->registrarAuditoria(
            $request,
            'CREAR',
            'tb_receta',
            'Receta #' . $receta->id_receta . ' generada correctamente.',
        );

        return $this->apiResponse(true, $receta, 'Receta generada correctamente', null, 201);
    }

    public function show(int $receta): JsonResponse
    {
        $registro = Receta::with(['tratamiento', 'doctor', 'paciente'])
            ->where('estatus', 'activo')
            ->find($receta);

        if (! $registro) {
            return $this->apiResponse(false, null, 'Receta no encontrada.', null, 404);
        }

        return $this->apiResponse(true, $registro, 'Receta consultada correctamente');
    }

    public function indexPorPaciente(int $paciente): JsonResponse
    {
        $pacienteExiste = Paciente::where('estatus', 'activo')->whereKey($paciente)->exists();

        if (! $pacienteExiste) {
            return $this->apiResponse(false, null, 'Paciente no encontrado.', null, 404);
        }

        $recetas = Receta::with(['tratamiento', 'doctor'])
            ->where('fk_paciente_receta', $paciente)
            ->where('estatus', 'activo')
            ->orderByDesc('fecha_receta')
            ->get();

        return $this->apiResponse(true, $recetas, 'Recetas consultadas correctamente');
    }

    private function resolveDoctorId(Request $request): ?int
    {
        $headerDoctor = $request->header('X-Doctor-Id');

        if ($headerDoctor && Doctor::whereKey((int) $headerDoctor)->exists()) {
            return (int) $headerDoctor;
        }

        $bodyDoctor = $request->input('fk_doctor_receta');

        if ($bodyDoctor && Doctor::whereKey((int) $bodyDoctor)->exists()) {
            return (int) $bodyDoctor;
        }

        $authId = $request->user()?->getAuthIdentifier();

        if ($authId && Doctor::whereKey((int) $authId)->exists()) {
            return (int) $authId;
        }

        return Doctor::query()->value('pk_fk_usuario');
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
