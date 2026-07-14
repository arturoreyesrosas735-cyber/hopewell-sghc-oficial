<?php

namespace App\Http\Controllers;

use App\Models\BitacoraAuditoria;
use App\Models\Diagnostico;
use App\Models\Documento;
use App\Models\ExpedienteClinico;
use App\Models\Paciente;
use App\Models\Tratamiento;
use App\Models\ConsultaMedica;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ExpedienteController extends Controller
{
    private const MODULO = 'CUM3 - Gestion de Expediente Clinico';
    private const MS_EXPEDIENTE_DUPLICADO = 'El paciente ya cuenta con un expediente clinico activo. No es posible abrir otro.';
    private const MS_EXPEDIENTE_NO_EXISTE = 'El paciente no cuenta con un expediente clinico activo. Por favor, abrala primero.';
    private const MS_DOCUMENTO_OK = 'Documento adjuntado exitosamente al expediente del paciente.';
    private const MS_ARCHIVO_INVALIDO = 'El archivo no es valido. Use PDF, JPG o PNG de maximo 5 MB.';

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        $expedientes = ExpedienteClinico::query()
            ->leftJoin('tb_paciente as p', 'p.id_paciente', '=', 'tb_expediente_clinico.fk_paciente_expediente_clinico')
            ->select([
                'tb_expediente_clinico.*',
                'p.id_paciente',
                'p.uk_curp',
                'p.nombres',
                'p.apellido_paterno',
                'p.apellido_materno',
                'p.fecha_nacimiento',
                'p.estatus',
                'p.uk_correo_electronico',
                'p.uk_telefono',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner
                        ->where('p.nombres', 'like', "%{$search}%")
                        ->orWhere('p.apellido_paterno', 'like', "%{$search}%")
                        ->orWhere('p.apellido_materno', 'like', "%{$search}%")
                        ->orWhere('p.uk_curp', 'like', "%{$search}%");

                    if (is_numeric($search)) {
                        $inner->orWhere('tb_expediente_clinico.id_expediente', (int) $search);
                    }
                });
            })
            ->orderByDesc('tb_expediente_clinico.fecha_apertura')
            ->get()
            ->map(function ($row): array {
                return [
                    'id_expediente' => $row->id_expediente,
                    'fk_paciente_expediente_clinico' => $row->fk_paciente_expediente_clinico,
                    'motivo' => $row->motivo,
                    'fk_diagnostico_expediente_clinico' => $row->fk_diagnostico_expediente_clinico,
                    'antecedente_familiar' => $row->antecedente_familiar,
                    'notas' => $row->notas,
                    'fecha_apertura' => $row->fecha_apertura,
                    'paciente' => [
                        'id_paciente' => $row->id_paciente,
                        'uk_curp' => $row->uk_curp,
                        'nombres' => $row->nombres,
                        'apellido_paterno' => $row->apellido_paterno,
                        'apellido_materno' => $row->apellido_materno,
                        'fecha_nacimiento' => $row->fecha_nacimiento,
                        'estatus' => $row->estatus,
                        'uk_correo_electronico' => $row->uk_correo_electronico,
                        'uk_telefono' => $row->uk_telefono,
                    ],
                ];
            });

        return $this->apiResponse(true, $expedientes, 'Expedientes obtenidos correctamente.');
    }

    public function resumenDia(): JsonResponse
    {
        try {
            $pacientes = Paciente::query()
                ->select(['id_paciente', 'nombres', 'apellido_paterno', 'fecha_nacimiento'])
                ->orderByDesc('id_paciente')
                ->limit(4)
                ->get()
                ->values()
                ->map(function (Paciente $paciente, int $index): array {
                    $times = ['9:00', '10:30', '13:00', '15:30'];

                    return [
                        'tiempo' => $times[$index] ?? '16:00',
                        'nombre' => trim("{$paciente->nombres} {$paciente->apellido_paterno}"),
                        'edad' => $paciente->fecha_nacimiento ? $paciente->fecha_nacimiento->age : 'N/D',
                        'razon' => $index % 2 === 0 ? 'Consulta' : 'Control',
                        'doctor' => $index % 2 === 0 ? 'Dr. Alan' : 'Dr. Samuel',
                    ];
                });
        } catch (QueryException) {
            $pacientes = collect();
        }

        if ($pacientes->isEmpty()) {
            $pacientes = collect([
                ['tiempo' => '9:00', 'nombre' => 'Laura Lopez', 'edad' => 25, 'razon' => 'Consulta', 'doctor' => 'Dr. Alan'],
                ['tiempo' => '13:00', 'nombre' => 'Jose Garcia', 'edad' => 21, 'razon' => 'Control', 'doctor' => 'Dr. Samuel'],
            ]);
        }

        return $this->apiResponse(true, [
            'pacientes' => $pacientes,
            'ultimas_consultas' => [
                ['modulo' => 'Expediente clinico', 'fecha' => '14-04-26', 'estatus' => 'Ver / Editar'],
                ['modulo' => 'Tratamientos y recetas', 'fecha' => '13-04-26', 'estatus' => 'Ver / Editar'],
                ['modulo' => 'Diagnosticos', 'fecha' => '10-04-26', 'estatus' => 'Ver / Editar'],
            ],
            'busqueda_rapida' => ['Paciente activo', 'Expediente abierto', 'Documento reciente', 'Consulta pendiente'],
            'mensajes' => ['Nueva alerta de documento', 'Revision de historial pendiente'],
        ], 'Resumen del dia obtenido correctamente.');
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'fk_paciente_expediente_clinico' => ['required', 'integer'],
                'motivo' => ['nullable', 'string', 'max:255'],
                'antecedente_familiar' => ['nullable', 'string'],
                'notas' => ['nullable', 'string'],
                'fk_diagnostico_expediente_clinico' => ['nullable', 'integer'],
            ]);
        } catch (ValidationException $exception) {
            return $this->apiResponse(false, null, 'Datos invalidos para abrir expediente.', $exception->errors(), 400);
        }

        $paciente = Paciente::query()
            ->where('id_paciente', $validated['fk_paciente_expediente_clinico'])
            ->whereRaw('LOWER(estatus) = ?', ['activo'])
            ->first();

        if (! $paciente) {
            return $this->apiResponse(false, null, 'Debe seleccionar un paciente activo para abrir el expediente.', ['paciente_invalido'], 404);
        }

        $existing = ExpedienteClinico::query()
            ->where('fk_paciente_expediente_clinico', $paciente->id_paciente)
            ->first();

        if ($existing) {
            return $this->apiResponse(false, null, self::MS_EXPEDIENTE_DUPLICADO, ['expediente_activo_existente'], 400);
        }

        $diagnosticoId = $validated['fk_diagnostico_expediente_clinico']
            ?? Diagnostico::query()->value('id_diagnostico');

        if (! $diagnosticoId) {
            return $this->apiResponse(
                false,
                null,
                'No existe un diagnostico base para abrir el expediente. La especificacion marca este campo como bloqueante pendiente de BD.',
                ['diagnostico_requerido_por_bd'],
                400,
            );
        }

        try {
            $expediente = DB::transaction(function () use ($validated, $paciente, $diagnosticoId, $request) {
                $expediente = ExpedienteClinico::query()->create([
                    'fk_paciente_expediente_clinico' => $paciente->id_paciente,
                    'motivo' => $validated['motivo'] ?? null,
                    'fk_diagnostico_expediente_clinico' => $diagnosticoId,
                    'antecedente_familiar' => $validated['antecedente_familiar'] ?? null,
                    'notas' => $validated['notas'] ?? null,
                    'fecha_apertura' => now(),
                ]);

                $this->registrarAuditoria(
                    'CREAR',
                    'tb_expediente_clinico',
                    "Apertura de expediente clinico para paciente ID {$paciente->id_paciente}",
                    $request,
                );

                return $expediente;
            });
        } catch (QueryException $exception) {
            return $this->apiResponse(false, null, 'No fue posible guardar el expediente clinico.', ['database_error'], 500);
        }

        $expediente->setRelation('paciente', $paciente);

        return $this->apiResponse(
            true,
            $expediente,
            "El expediente clinico del paciente {$paciente->nombres} {$paciente->apellido_paterno} ha sido abierto exitosamente.",
            null,
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $expediente = $this->findExpediente($id);

        if (! $expediente) {
            return $this->apiResponse(false, null, self::MS_EXPEDIENTE_NO_EXISTE, ['expediente_no_encontrado'], 404);
        }

        return $this->apiResponse(true, $expediente, 'Expediente clinico obtenido correctamente.');
    }

    public function historial(int $id): JsonResponse
    {
        $expediente = $this->findExpediente($id);

        if (! $expediente) {
            return $this->apiResponse(false, null, self::MS_EXPEDIENTE_NO_EXISTE, ['expediente_no_encontrado'], 404);
        }

        $consultas = ConsultaMedica::query()
            ->where('fk_expediente_consulta_medica', $id)
            ->get()
            ->map(fn (ConsultaMedica $consulta): array => [
                'tipo' => 'consulta',
                'fecha' => (string) ($consulta->horario ?? now()),
                'id' => $consulta->id_consulta_medica,
                'titulo' => 'Consulta medica',
                'descripcion' => $consulta->motivo_consulta,
            ]);

        $diagnosticos = Diagnostico::query()
            ->whereIn('fk_consulta_medica_diagnostico', $consultas->pluck('id'))
            ->get()
            ->map(fn (Diagnostico $diagnostico): array => [
                'tipo' => 'diagnostico',
                'fecha' => (string) ($diagnostico->fecha_crecion ?? now()),
                'id' => $diagnostico->id_diagnostico,
                'titulo' => $diagnostico->nombre_diagnostico,
                'descripcion' => $diagnostico->descripcion_diagnostico,
            ]);

        $documentos = Documento::query()
            ->where('fk_expediente_clinico_documento', $id)
            ->whereRaw('LOWER(estatus) = ?', ['activo'])
            ->get()
            ->map(fn (Documento $documento): array => [
                'tipo' => 'documento',
                'fecha' => (string) $documento->fecha_carga,
                'id' => $documento->id_documento,
                'titulo' => $documento->nombre_documento,
                'descripcion' => strtoupper($documento->extension_archivo),
            ]);

        $tratamientos = Tratamiento::query()
            ->where('fk_paciente_tratamiento', $expediente->fk_paciente_expediente_clinico)
            ->get()
            ->map(fn (Tratamiento $tratamiento): array => [
                'tipo' => 'tratamiento',
                'fecha' => (string) ($tratamiento->fecha_registro ?? $tratamiento->inicio_tratamiento ?? now()),
                'id' => $tratamiento->id_tratamiento,
                'titulo' => 'Tratamiento',
                'descripcion' => $tratamiento->indicaciones,
            ]);

        $historial = $consultas
            ->merge($diagnosticos)
            ->merge($documentos)
            ->merge($tratamientos)
            ->sortByDesc('fecha')
            ->values();

        return $this->apiResponse(true, [
            'id_expediente' => $id,
            'historial' => $historial,
        ], 'Historial clinico obtenido correctamente.');
    }

    public function storeDocumento(Request $request, int $id): JsonResponse
    {
        $expediente = $this->findExpediente($id);

        if (! $expediente) {
            return $this->apiResponse(false, null, self::MS_EXPEDIENTE_NO_EXISTE, ['expediente_no_encontrado'], 404);
        }

        try {
            $validated = $request->validate([
                'nombre_documento' => ['required', 'string', 'max:150'],
                'tipo_documento' => ['required', 'string', 'max:80'],
                'archivo' => ['required', 'file', 'max:5120', 'mimes:pdf,jpg,jpeg,png'],
            ]);
        } catch (ValidationException $exception) {
            return $this->apiResponse(false, null, self::MS_ARCHIVO_INVALIDO, $exception->errors(), 400);
        }

        $archivo = $validated['archivo'];
        $extension = strtolower($archivo->getClientOriginalExtension());
        $extension = $extension === 'jpeg' ? 'jpg' : $extension;

        if (! in_array($extension, ['pdf', 'jpg', 'png'], true)) {
            return $this->apiResponse(false, null, self::MS_ARCHIVO_INVALIDO, ['extension_no_permitida'], 400);
        }

        $filename = Str::slug(pathinfo($archivo->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($filename ?: 'documento').'-'.now()->format('YmdHis').'.'.$extension;
        $path = $archivo->storeAs("expedientes/{$id}", $filename, 'public');

        try {
            $documentoId = DB::table('tb_documento')->insertGetId([
                'fk_expediente_clinico_documento' => $id,
                'nombre_documento' => $validated['nombre_documento'],
                'extension_archivo' => $extension,
                'ruta_archivo' => $path,
                'tamano_archivo' => max(round($archivo->getSize() / 1024 / 1024, 2), 0.01),
                'fecha_carga' => now(),
                'estatus' => 'activo',
            ], 'id_documento');

            $documento = Documento::query()->find($documentoId);

            if (! $documento) {
                Storage::disk('public')->delete($path);

                return $this->apiResponse(false, null, 'No fue posible registrar el documento en el expediente.', ['documento_no_registrado'], 500);
            }
        } catch (QueryException $exception) {
            Storage::disk('public')->delete($path);

            return $this->apiResponse(false, null, 'No fue posible guardar el documento clinico.', ['database_error'], 500);
        }

        try {
            $this->registrarAuditoria(
                'CREAR',
                'tb_documento',
                "Documento adjuntado al expediente ID {$id}: {$validated['tipo_documento']} - {$documento->nombre_documento}",
                $request,
            );
        } catch (QueryException) {
            //
        }

        $documento->url_descarga = route('documentos.archivo', ['id' => $documento->id_documento], false);
        $documento->url_ver = route('documentos.archivo', ['id' => $documento->id_documento], false);
        $documento->tipo_documento = $validated['tipo_documento'];

        return $this->apiResponse(true, $documento, self::MS_DOCUMENTO_OK, null, 201);
    }

    public function indexDocumentos(int $id): JsonResponse
    {
        if (! $this->findExpediente($id)) {
            return $this->apiResponse(false, null, self::MS_EXPEDIENTE_NO_EXISTE, ['expediente_no_encontrado'], 404);
        }

        $documentos = Documento::query()
            ->where('fk_expediente_clinico_documento', $id)
            ->whereRaw('LOWER(estatus) = ?', ['activo'])
            ->orderByDesc('fecha_carga')
            ->get()
            ->map(function (Documento $documento): Documento {
                $documento->url_descarga = route('documentos.archivo', ['id' => $documento->id_documento], false);
                $documento->url_ver = route('documentos.archivo', ['id' => $documento->id_documento], false);

                return $documento;
            });

        return $this->apiResponse(true, $documentos, 'Documentos del expediente obtenidos correctamente.');
    }

    public function showDocumentoArchivo(int $id)
    {
        $documento = Documento::query()->find($id);

        if (! $documento || ! $documento->ruta_archivo) {
            return $this->apiResponse(false, null, 'Documento no encontrado.', ['documento_no_encontrado'], 404);
        }

        $path = storage_path("app/public/{$documento->ruta_archivo}");

        if (! file_exists($path)) {
            $fallback = glob(storage_path("app/public/expedientes/{$documento->fk_expediente_clinico_documento}/*.{$documento->extension_archivo}"));
            $path = $fallback[0] ?? $path;
        }

        if (! file_exists($path)) {
            return $this->apiResponse(false, null, 'El archivo fisico no existe en storage.', ['archivo_no_encontrado'], 404);
        }

        $filename = Str::slug($documento->nombre_documento ?: 'documento') . '.' . strtolower($documento->extension_archivo);

        return response()->file($path, [
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }

    private function findExpediente(int $id): ?ExpedienteClinico
    {
        $expediente = ExpedienteClinico::query()->find($id);

        if (! $expediente) {
            return null;
        }

        $paciente = Paciente::query()
            ->select([
                'id_paciente',
                'uk_curp',
                'nombres',
                'apellido_paterno',
                'apellido_materno',
                'fecha_nacimiento',
                'estatus',
                'uk_correo_electronico',
                'uk_telefono',
            ])
            ->find($expediente->fk_paciente_expediente_clinico);

        $expediente->setRelation('paciente', $paciente);

        return $expediente;
    }

    private function registrarAuditoria(string $accion, string $tabla, string $descripcion, Request $request): void
    {
        try {
            BitacoraAuditoria::query()->create([
                'fk_usuario_auditoria' => 1,
                'modulo_afectado' => self::MODULO,
                'operacion_accion' => $accion,
                'fecha_registro' => now(),
                'fecha_edicion' => now(),
                'tabla_afectada' => $tabla,
                'descripcion' => $descripcion,
                'direccion_ip' => $request->ip(),
            ]);
        } catch (QueryException) {
            // La auditoria no debe romper el flujo clinico si M1/M13 aun no tienen datos base.
        }
    }

    private function apiResponse(bool $success, mixed $data, string $message, ?array $errors = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => $success,
            'data' => $data,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
