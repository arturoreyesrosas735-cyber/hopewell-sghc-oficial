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
use Illuminate\Support\Facades\DB;
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

    public function storeDirecta(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'fk_paciente_receta' => ['required', 'integer', Rule::exists('tb_paciente', 'id_paciente')->where('estatus', 'activo')],
            'medicamento_texto' => ['required', 'string', 'max:150'],
            'dosis' => ['required', 'string', 'max:100'],
            'frecuencia' => ['required', 'string', 'max:100'],
            'duracion_receta' => ['required', 'string', 'max:100'],
            'observaciones' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'Datos invalidos.', $validator->errors()->toArray(), 400);
        }

        $doctorId = $this->resolveDoctorId($request);
        if (! $doctorId) {
            return $this->apiResponse(false, null, 'No hay doctor disponible para emitir la receta.', null, 400);
        }

        $data = $validator->validated();
        $receta = DB::transaction(function () use ($data, $doctorId) {
            $medicamentoId = $this->resolveMedicamentoId($data['medicamento_texto']);
            $diagnosticoId = $this->crearDiagnosticoDirecto((int) $data['fk_paciente_receta']);
            $padecimientoId = $this->crearPadecimientoDirecto((int) $data['fk_paciente_receta']);

            $tratamientoId = DB::table('tb_tratamiento')->insertGetId([
                'fk_paciente_tratamiento' => $data['fk_paciente_receta'],
                'fk_diagnostico_tratamiento' => $diagnosticoId,
                'fk_padecimiento_tratamiento' => $padecimientoId,
                'fk_medicamento_tratamiento' => $medicamentoId,
                'descripcion' => 'Tratamiento generado automaticamente desde receta directa',
                'inicio_tratamiento' => now()->toDateString(),
                'termino_tratamiento' => now()->addDays(7)->toDateString(),
                'indicaciones' => $data['observaciones'] ?? 'Receta directa',
                'fecha_registro' => now(),
                'estatus' => 'activo',
            ], 'id_tratamiento');

            return Receta::create([
                'fk_tratamiento_receta' => $tratamientoId,
                'fk_doctor_receta' => $doctorId,
                'fk_paciente_receta' => $data['fk_paciente_receta'],
                'fecha_receta' => now(),
                'observaciones' => $data['observaciones'] ?? null,
                'dosis' => $data['dosis'],
                'frecuencia' => $data['frecuencia'],
                'duracion_receta' => $data['duracion_receta'],
                'estatus' => 'activo',
            ]);
        });

        $this->registrarAuditoria($request, 'CREAR', 'tb_receta', 'Receta directa #' . $receta->id_receta . ' generada correctamente.');

        return $this->apiResponse(true, $receta, 'Receta generada correctamente', null, 201);
    }

    public function indexPorPaciente(int $paciente): JsonResponse
    {
        $pacienteExiste = Paciente::where('estatus', 'activo')->whereKey($paciente)->exists();

        if (! $pacienteExiste) {
            return $this->apiResponse(false, null, 'Paciente no encontrado.', null, 404);
        }

        $recetas = Receta::with(['tratamiento.medicamento', 'tratamiento.diagnostico', 'doctor', 'paciente'])
            ->where('fk_paciente_receta', $paciente)
            ->where('estatus', 'activo')
            ->orderByDesc('fecha_receta')
            ->get();

        return $this->apiResponse(true, $recetas, 'Recetas consultadas correctamente');
    }

    public function pdf(int $receta)
    {
        $registro = Receta::with(['tratamiento.medicamento', 'tratamiento.diagnostico', 'paciente'])
            ->findOrFail($receta);

        $paciente = $registro->paciente
            ? trim($registro->paciente->nombres . ' ' . $registro->paciente->apellido_paterno . ' ' . $registro->paciente->apellido_materno)
            : 'Paciente no especificado';

        $lines = [
            'HOPEWELL - HISTORIALES CLINICOS',
            'RECETA MEDICA',
            'Paciente: ' . $paciente,
            'Diagnostico: ' . ($registro->tratamiento->diagnostico->nombre_diagnostico ?? 'No especificado'),
            'Medicamento: ' . ($registro->tratamiento->medicamento->uk_nombre_medicamento ?? 'No especificado'),
            'Dosis: ' . $registro->dosis,
            'Frecuencia: ' . $registro->frecuencia,
            'Duracion: ' . $registro->duracion_receta,
            'Observaciones: ' . ($registro->observaciones ?? 'Sin observaciones'),
            'Fecha: ' . $registro->fecha_receta,
        ];

        return $this->pdfResponse('receta-' . $registro->id_receta . '.pdf', $lines);
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

    private function resolveMedicamentoId(string $nombre): int
    {
        $existing = DB::table('tb_medicamento')
            ->whereRaw('LOWER(uk_nombre_medicamento) = ?', [strtolower(trim($nombre))])
            ->value('id_medicamento');

        if ($existing) {
            return (int) $existing;
        }

        return (int) DB::table('tb_medicamento')->insertGetId([
            'uk_nombre_medicamento' => trim($nombre),
            'descripcion' => 'Medicamento capturado desde receta directa',
            'presentacion' => 'No especificada',
            'concentracion' => 'No especificada',
        ], 'id_medicamento');
    }

    private function crearDiagnosticoDirecto(int $pacienteId): int
    {
        $consultaId = DB::table('tb_consulta_medica')
            ->join('tb_expediente_clinico', 'tb_expediente_clinico.id_expediente', '=', 'tb_consulta_medica.fk_expediente_consulta_medica')
            ->where('tb_expediente_clinico.fk_paciente_expediente_clinico', $pacienteId)
            ->orderByDesc('tb_consulta_medica.id_consulta_medica')
            ->value('tb_consulta_medica.id_consulta_medica');

        return (int) DB::table('tb_diagnostico')->insertGetId([
            'fk_consulta_medica_diagnostico' => $consultaId ?: DB::table('tb_consulta_medica')->value('id_consulta_medica'),
            'nombre_diagnostico' => 'Receta directa',
            'descripcion_diagnostico' => 'Diagnostico generado para receta directa',
            'observaciones' => null,
            'fecha_crecion' => now(),
        ], 'id_diagnostico');
    }

    private function crearPadecimientoDirecto(int $pacienteId): int
    {
        $suffix = now()->format('Hisv');
        return (int) DB::table('tb_padecimiento')->insertGetId([
            'uk_nombre_padecimiento' => 'Receta directa ' . $suffix,
            'uk_codigo_cie' => 'RD' . substr($suffix, -4),
            'vv_descripcion' => 'Padecimiento generado para receta directa',
            'fk_enfermedad_padecimiento' => DB::table('tb_enfermedad')->value('id_enfermedad'),
            'fk_cronicidad_padecimiento' => DB::table('tb_cronicidad')->value('id_cronico'),
            'fk_paciente_padecimiento' => $pacienteId,
        ], 'id_padecimiento');
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

    private function pdfResponse(string $filename, array $lines)
    {
        $content = "BT\n/F1 18 Tf\n50 780 Td\n";
        foreach ($lines as $index => $line) {
            $size = $index < 2 ? 18 : 11;
            $content .= "/F1 {$size} Tf\n(" . $this->pdfText($line) . ") Tj\n0 -24 Td\n";
        }
        $content .= "ET";
        $objects = [
            "<< /Type /Catalog /Pages 2 0 R >>",
            "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
            "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
            "<< /Length " . strlen($content) . " >>\nstream\n{$content}\nendstream",
        ];
        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $i => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($i + 1) . " 0 obj\n{$object}\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= str_pad((string) $offsets[$i], 10, '0', STR_PAD_LEFT) . " 00000 n \n";
        }
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";

        return response($pdf, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    private function pdfText(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text));
    }
}
