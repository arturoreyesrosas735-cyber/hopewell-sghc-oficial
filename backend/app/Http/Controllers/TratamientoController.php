<?php

namespace App\Http\Controllers;

use App\Models\BitacoraAuditoria;
use App\Models\Paciente;
use App\Models\Tratamiento;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TratamientoController extends Controller
{
    public function store(Request $request, int $diagnostico): JsonResponse
    {
        $payload = array_merge($request->all(), [
            'fk_diagnostico_tratamiento' => $diagnostico > 0 ? $diagnostico : null,
        ]);

        $validator = Validator::make($payload, [
            'fk_paciente_tratamiento' => [
                'required',
                'integer',
                Rule::exists('tb_paciente', 'id_paciente')->where('estatus', 'activo'),
            ],
            'diagnostico_texto' => ['required', 'string', 'max:150'],
            'padecimiento_texto' => ['required', 'string', 'max:150'],
            'medicamento_texto' => ['required', 'string', 'max:150'],
            'fk_diagnostico_tratamiento' => ['nullable', 'integer'],
            'fk_padecimiento_tratamiento' => ['nullable', 'integer'],
            'fk_medicamento_tratamiento' => ['nullable', 'integer'],
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

        $validated = $validator->validated();

        $tratamiento = DB::transaction(function () use ($request, $validated) {
            $pacienteId = (int) $validated['fk_paciente_tratamiento'];
            $diagnosticoId = $this->resolveDiagnosticoId($pacienteId, $validated);
            $padecimientoId = $this->resolvePadecimientoId($pacienteId, $validated);
            $medicamentoId = $this->resolveMedicamentoId($validated);

            return Tratamiento::create([
                'fk_paciente_tratamiento' => $pacienteId,
                'fk_diagnostico_tratamiento' => $diagnosticoId,
                'fk_padecimiento_tratamiento' => $padecimientoId,
                'fk_medicamento_tratamiento' => $medicamentoId,
                'descripcion' => $validated['descripcion'] ?? null,
                'inicio_tratamiento' => $validated['inicio_tratamiento'],
                'termino_tratamiento' => $validated['termino_tratamiento'],
                'indicaciones' => $validated['indicaciones'],
                'fecha_registro' => now(),
                'estatus' => 'activo',
            ]);
        });

        $this->registrarAuditoria(
            $request,
            'CREAR',
            'tb_tratamiento',
            'Tratamiento #' . $tratamiento->id_tratamiento . ' registrado correctamente.',
        );

        return $this->apiResponse(true, $tratamiento, 'Tratamiento registrado correctamente', null, 201);
    }

    private function resolveDiagnosticoId(int $pacienteId, array $data): int
    {
        $existingId = (int) ($data['fk_diagnostico_tratamiento'] ?? 0);

        if ($existingId > 0 && DB::table('tb_diagnostico')->where('id_diagnostico', $existingId)->exists()) {
            return $existingId;
        }

        $consultaId = $this->resolveConsultaId($pacienteId);
        $nombre = trim((string) ($data['diagnostico_texto'] ?? 'Diagnostico capturado'));

        return (int) DB::table('tb_diagnostico')->insertGetId([
            'fk_consulta_medica_diagnostico' => $consultaId,
            'nombre_diagnostico' => $nombre,
            'descripcion_diagnostico' => $data['descripcion'] ?: $nombre,
            'observaciones' => $data['indicaciones'] ?? null,
            'fecha_crecion' => now(),
        ], 'id_diagnostico');
    }

    private function resolvePadecimientoId(int $pacienteId, array $data): int
    {
        $existingId = (int) ($data['fk_padecimiento_tratamiento'] ?? 0);

        if ($existingId > 0 && DB::table('tb_padecimiento')->where('id_padecimiento', $existingId)->exists()) {
            return $existingId;
        }

        $nombre = trim((string) ($data['padecimiento_texto'] ?? 'Padecimiento capturado'));
        $suffix = now()->format('Hisv');

        return (int) DB::table('tb_padecimiento')->insertGetId([
            'uk_nombre_padecimiento' => $nombre . ' ' . $suffix,
            'uk_codigo_cie' => 'CAP' . substr($suffix, -4),
            'vv_descripcion' => $nombre,
            'fk_enfermedad_padecimiento' => DB::table('tb_enfermedad')->value('id_enfermedad'),
            'fk_cronicidad_padecimiento' => DB::table('tb_cronicidad')->value('id_cronico'),
            'fk_paciente_padecimiento' => $pacienteId,
        ], 'id_padecimiento');
    }

    private function resolveMedicamentoId(array $data): int
    {
        $existingId = (int) ($data['fk_medicamento_tratamiento'] ?? 0);

        if ($existingId > 0 && DB::table('tb_medicamento')->where('id_medicamento', $existingId)->exists()) {
            return $existingId;
        }

        $nombre = trim((string) ($data['medicamento_texto'] ?? 'Medicamento capturado'));
        $existing = DB::table('tb_medicamento')
            ->whereRaw('LOWER(uk_nombre_medicamento) = ?', [strtolower($nombre)])
            ->value('id_medicamento');

        if ($existing) {
            return (int) $existing;
        }

        return (int) DB::table('tb_medicamento')->insertGetId([
            'uk_nombre_medicamento' => $nombre,
            'descripcion' => 'Medicamento capturado desde registro de tratamiento',
            'presentacion' => 'No especificada',
            'concentracion' => 'No especificada',
        ], 'id_medicamento');
    }

    private function resolveConsultaId(int $pacienteId): int
    {
        $consultaId = DB::table('tb_consulta_medica')
            ->join('tb_expediente_clinico', 'tb_expediente_clinico.id_expediente', '=', 'tb_consulta_medica.fk_expediente_consulta_medica')
            ->where('tb_expediente_clinico.fk_paciente_expediente_clinico', $pacienteId)
            ->orderByDesc('tb_consulta_medica.id_consulta_medica')
            ->value('tb_consulta_medica.id_consulta_medica');

        if ($consultaId) {
            return (int) $consultaId;
        }

        $expedienteId = DB::table('tb_expediente_clinico')
            ->where('fk_paciente_expediente_clinico', $pacienteId)
            ->value('id_expediente');

        if (! $expedienteId) {
            $expedienteId = DB::table('tb_expediente_clinico')->insertGetId([
                'fk_paciente_expediente_clinico' => $pacienteId,
                'motivo' => 'Captura de tratamiento',
                'fk_diagnostico_expediente_clinico' => DB::table('tb_diagnostico')->value('id_diagnostico') ?? 1,
                'antecedente_familiar' => null,
                'notas' => 'Expediente creado para demostracion',
                'fecha_apertura' => now(),
            ], 'id_expediente');
        }

        return (int) DB::table('tb_consulta_medica')->insertGetId([
            'fk_consultorio_consulta_medica' => DB::table('tb_consultorio')->value('id_consultorio'),
            'fk_expediente_consulta_medica' => $expedienteId,
            'fk_tipo_consulta' => 1,
            'horario' => now()->format('H:i:s'),
            'motivo_consulta' => 'Captura de tratamiento',
        ], 'id_consulta_medica');
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

        $tratamientos = Tratamiento::with(['paciente', 'diagnostico', 'padecimiento', 'medicamento'])
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

    public function pdf(int $tratamiento)
    {
        $registro = Tratamiento::with(['paciente', 'diagnostico', 'padecimiento', 'medicamento'])
            ->findOrFail($tratamiento);

        $paciente = $registro->paciente
            ? trim($registro->paciente->nombres . ' ' . $registro->paciente->apellido_paterno . ' ' . $registro->paciente->apellido_materno)
            : 'Paciente no especificado';

        $lines = [
            'HOPEWELL - HISTORIALES CLINICOS',
            'TRATAMIENTO MEDICO',
            'Paciente: ' . $paciente,
            'Diagnostico: ' . ($registro->diagnostico->nombre_diagnostico ?? 'No especificado'),
            'Padecimiento: ' . ($registro->padecimiento->uk_nombre_padecimiento ?? 'No especificado'),
            'Medicamento: ' . ($registro->medicamento->uk_nombre_medicamento ?? 'No especificado'),
            'Inicio: ' . $registro->inicio_tratamiento,
            'Termino: ' . $registro->termino_tratamiento,
            'Descripcion: ' . ($registro->descripcion ?? 'Sin descripcion'),
            'Indicaciones: ' . $registro->indicaciones,
        ];

        return $this->pdfResponse('tratamiento-' . $registro->id_tratamiento . '.pdf', $lines);
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

        $objects = [];
        $objects[] = "<< /Type /Catalog /Pages 2 0 R >>";
        $objects[] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
        $objects[] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>";
        $objects[] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
        $objects[] = "<< /Length " . strlen($content) . " >>\nstream\n{$content}\nendstream";

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
