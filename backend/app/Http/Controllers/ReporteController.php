<?php

namespace App\Http\Controllers;

use App\Models\BitacoraAuditoria;
use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Sede;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ReporteController extends Controller
{
    public function resumenClinico(Request $request, int $paciente): JsonResponse
    {
        $pacienteRegistro = $this->buscarPacienteActivo($paciente);

        if (! $pacienteRegistro) {
            return $this->apiResponse(false, null, 'El paciente seleccionado no existe.', null, 404);
        }

        $diagnosticos = $this->diagnosticosPorPaciente($paciente);
        $tratamientos = $this->tratamientosPorPaciente($paciente);
        $expediente = $this->expedientePorPaciente($paciente);
        $consultas = $this->consultaBase()
            ->where('p.id_paciente', $paciente)
            ->orderByDesc('ec.fecha_apertura')
            ->get();
        $recetas = $this->recetasPorPaciente($paciente);

        $data = [
            'paciente' => $pacienteRegistro,
            'expediente' => $expediente,
            'consultas' => $consultas,
            'diagnosticos' => $diagnosticos,
            'tratamientos' => $tratamientos,
            'recetas' => $recetas,
            'ultima_consulta' => $consultas->first(),
            'totales' => [
                'consultas' => $consultas->count(),
                'diagnosticos' => $diagnosticos->count(),
                'tratamientos' => $tratamientos->count(),
                'recetas' => $recetas->count(),
            ],
            'generado_en' => now()->format('Y-m-d H:i:s'),
        ];

        $this->registrarAuditoria($request, 'tb_paciente', 'Generacion de resumen clinico para paciente ID ' . $paciente . '.');

        return $this->apiResponse(true, $data, $this->mensajeDatos($diagnosticos->merge($tratamientos)));
    }

    public function historialConsultas(Request $request, int $paciente): JsonResponse
    {
        $pacienteRegistro = $this->buscarPacienteActivo($paciente);

        if (! $pacienteRegistro) {
            return $this->apiResponse(false, null, 'El paciente seleccionado no existe.', null, 404);
        }

        $validator = $this->validarFechasOpcionales($request);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, $this->mensajeValidacionFechas($validator), $validator->errors()->toArray(), 400);
        }

        $consultas = $this->consultaBase()
            ->where('p.id_paciente', $paciente)
            ->when($request->filled('fecha_inicio'), fn ($query) => $query->whereDate('ec.fecha_apertura', '>=', $request->query('fecha_inicio')))
            ->when($request->filled('fecha_fin'), fn ($query) => $query->whereDate('ec.fecha_apertura', '<=', $request->query('fecha_fin')))
            ->orderByDesc('ec.fecha_apertura')
            ->get();

        $data = [
            'paciente' => $pacienteRegistro,
            'consultas' => $consultas,
            'totales' => [
                'consultas' => $consultas->count(),
            ],
        ];

        $this->registrarAuditoria($request, 'tb_consulta_medica', 'Generacion de historial de consultas para paciente ID ' . $paciente . '.');

        return $this->apiResponse(true, $data, $this->mensajeDatos($consultas));
    }

    public function porMedico(Request $request, int $doctor): JsonResponse
    {
        $doctorRegistro = $this->doctorDetalle($doctor);

        if (! $doctorRegistro) {
            return $this->apiResponse(false, null, 'El medico seleccionado no existe o se encuentra inactivo.', null, 404);
        }

        $validator = $this->validarFechasRequeridas($request);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, $this->mensajeValidacionFechas($validator), $validator->errors()->toArray(), 400);
        }

        $consultas = $this->consultaBase()
            ->join('tb_doctor_consultorio as dc', 'dc.fk_consultorio', '=', 'co.id_consultorio')
            ->where('dc.fk_doctor', $doctor)
            ->whereDate('ec.fecha_apertura', '>=', $request->query('fecha_inicio'))
            ->whereDate('ec.fecha_apertura', '<=', $request->query('fecha_fin'))
            ->orderByDesc('ec.fecha_apertura')
            ->get();

        $data = [
            'doctor' => $doctorRegistro,
            'periodo' => $request->only(['fecha_inicio', 'fecha_fin']),
            'consultas' => $consultas,
            'estadisticas' => [
                'total_consultas' => $consultas->count(),
                'pacientes_atendidos' => $consultas->pluck('id_paciente')->unique()->count(),
            ],
            'generado_en' => now()->format('Y-m-d H:i:s'),
        ];

        $this->registrarAuditoria($request, 'tb_doctor', 'Generacion de reporte por medico ID ' . $doctor . '.');

        return $this->apiResponse(true, $data, $this->mensajeDatos($consultas));
    }

    public function porSede(Request $request, int $sede): JsonResponse
    {
        $sedeRegistro = $this->sedeDetalle($sede);

        if (! $sedeRegistro) {
            return $this->apiResponse(false, null, 'La sede seleccionada no existe o esta deshabilitada.', null, 404);
        }

        $consultas = $this->consultaBase()
            ->where('s.id_sede', $sede)
            ->orderByDesc('ec.fecha_apertura')
            ->get();

        $data = [
            'sede' => $sedeRegistro,
            'consultas' => $consultas,
            'estadisticas' => [
                'total_consultas' => $consultas->count(),
                'consultorios_usados' => $consultas->pluck('id_consultorio')->unique()->count(),
                'pacientes_atendidos' => $consultas->pluck('id_paciente')->unique()->count(),
            ],
            'generado_en' => now()->format('Y-m-d H:i:s'),
        ];

        $this->registrarAuditoria($request, 'tb_sede', 'Generacion de reporte por sede ID ' . $sede . '.');

        return $this->apiResponse(true, $data, $this->mensajeDatos($consultas));
    }

    public function porPeriodo(Request $request): JsonResponse
    {
        $validator = $this->validarFechasRequeridas($request);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, $this->mensajeValidacionFechas($validator), $validator->errors()->toArray(), 400);
        }

        $consultas = $this->consultaBase()
            ->whereDate('ec.fecha_apertura', '>=', $request->query('fecha_inicio'))
            ->whereDate('ec.fecha_apertura', '<=', $request->query('fecha_fin'))
            ->orderByDesc('ec.fecha_apertura')
            ->get();

        $data = [
            'periodo' => $request->only(['fecha_inicio', 'fecha_fin']),
            'consultas' => $consultas,
            'estadisticas' => [
                'total_consultas' => $consultas->count(),
                'pacientes_atendidos' => $consultas->pluck('id_paciente')->unique()->count(),
                'sedes' => $consultas->pluck('id_sede')->unique()->filter()->count(),
                'medicos_activos' => $this->medicosActivosEnPeriodo($request),
                'sede_principal' => $consultas->groupBy('nombre_sede')
                    ->sortByDesc(fn ($items) => $items->count())
                    ->keys()
                    ->first(),
            ],
            'generado_en' => now()->format('Y-m-d H:i:s'),
        ];

        $this->registrarAuditoria($request, 'tb_consulta_medica', 'Generacion de reporte por periodo.');

        return $this->apiResponse(true, $data, $this->mensajeDatos($consultas));
    }

    public function exportarResumenClinico(Request $request, int $paciente): Response|JsonResponse
    {
        return $this->exportar($request, fn () => $this->resumenClinico($request, $paciente), 'resumen-clinico');
    }

    public function exportarHistorialConsultas(Request $request, int $paciente): Response|JsonResponse
    {
        return $this->exportar($request, fn () => $this->historialConsultas($request, $paciente), 'historial-consultas');
    }

    public function exportarPorMedico(Request $request, int $doctor): Response|JsonResponse
    {
        return $this->exportar($request, fn () => $this->porMedico($request, $doctor), 'reporte-medico');
    }

    public function exportarPorSede(Request $request, int $sede): Response|JsonResponse
    {
        return $this->exportar($request, fn () => $this->porSede($request, $sede), 'reporte-sede');
    }

    public function exportarPorPeriodo(Request $request): Response|JsonResponse
    {
        return $this->exportar($request, fn () => $this->porPeriodo($request), 'reporte-periodo');
    }

    private function consultaBase()
    {
        return DB::table('tb_consulta_medica as cm')
            ->join('tb_expediente_clinico as ec', 'ec.id_expediente', '=', 'cm.fk_expediente_consulta_medica')
            ->join('tb_paciente as p', 'p.id_paciente', '=', 'ec.fk_paciente_expediente_clinico')
            ->leftJoin('tb_consultorio as co', 'co.id_consultorio', '=', 'cm.fk_consultorio_consulta_medica')
            ->leftJoin('tb_sede as s', 's.id_sede', '=', 'co.fk_sede_consultorio')
            ->leftJoin('tb_diagnostico as d', 'd.fk_consulta_medica_diagnostico', '=', 'cm.id_consulta_medica')
            ->where('p.estatus', 'activo')
            ->select([
                'cm.id_consulta_medica',
                'cm.fk_consultorio_consulta_medica',
                'cm.fk_expediente_consulta_medica',
                'cm.fk_tipo_consulta',
                'cm.horario',
                'cm.motivo_consulta',
                'ec.fecha_apertura',
                'p.id_paciente',
                'p.nombres',
                'p.apellido_paterno',
                'p.apellido_materno',
                'co.id_consultorio',
                'co.nombre_consultorio',
                's.id_sede',
                's.nombre_sede',
                DB::raw('COUNT(d.id_diagnostico) as total_diagnosticos'),
            ])
            ->groupBy([
                'cm.id_consulta_medica',
                'cm.fk_consultorio_consulta_medica',
                'cm.fk_expediente_consulta_medica',
                'cm.fk_tipo_consulta',
                'cm.horario',
                'cm.motivo_consulta',
                'ec.fecha_apertura',
                'p.id_paciente',
                'p.nombres',
                'p.apellido_paterno',
                'p.apellido_materno',
                'co.id_consultorio',
                'co.nombre_consultorio',
                's.id_sede',
                's.nombre_sede',
            ]);
    }

    private function buscarPacienteActivo(int $paciente): ?Paciente
    {
        return Paciente::query()
            ->select(['id_paciente', 'nombres', 'apellido_paterno', 'apellido_materno', 'uk_curp', 'fecha_nacimiento', 'estatus', 'vv_alergia'])
            ->where('estatus', 'activo')
            ->whereKey($paciente)
            ->first();
    }

    private function expedientePorPaciente(int $paciente): ?object
    {
        return DB::table('tb_expediente_clinico')
            ->where('fk_paciente_expediente_clinico', $paciente)
            ->orderByDesc('fecha_apertura')
            ->first();
    }

    private function recetasPorPaciente(int $paciente): Collection
    {
        return DB::table('tb_receta as r')
            ->leftJoin('tb_tratamiento as t', 't.id_tratamiento', '=', 'r.fk_tratamiento_receta')
            ->leftJoin('tb_doctor as d', 'd.pk_fk_usuario', '=', 'r.fk_doctor_receta')
            ->where('r.fk_paciente_receta', $paciente)
            ->where('r.estatus', 'activo')
            ->select([
                'r.id_receta',
                'r.fecha_receta',
                'r.dosis',
                'r.frecuencia',
                'r.duracion_receta',
                'r.observaciones',
                't.descripcion as tratamiento',
                'd.uk_cedula_profesional',
            ])
            ->orderByDesc('r.fecha_receta')
            ->get();
    }

    private function doctorDetalle(int $doctor): ?object
    {
        return DB::table('tb_doctor as d')
            ->leftJoin('tb_usuario as u', 'u.id_usuario', '=', 'd.pk_fk_usuario')
            ->leftJoin('tb_personal as p', 'p.id_personal', '=', 'u.fk_personal_usuario')
            ->leftJoin('tb_especialidad_doctor as ed', 'ed.fk_doctor', '=', 'd.pk_fk_usuario')
            ->leftJoin('tb_especialidad as e', 'e.id_especialidad', '=', 'ed.fk_especialidad')
            ->where('d.pk_fk_usuario', $doctor)
            ->select([
                'd.pk_fk_usuario',
                'd.uk_cedula_profesional',
                'd.uk_rfc_personal',
                DB::raw("TRIM(CONCAT(COALESCE(p.nombres, ''), ' ', COALESCE(p.apellido_paterno, ''), ' ', COALESCE(p.apellido_materno, ''))) as nombre_completo"),
                DB::raw("COALESCE(MAX(e.uk_nombre), 'Especialidad no registrada') as especialidad"),
            ])
            ->groupBy([
                'd.pk_fk_usuario',
                'd.uk_cedula_profesional',
                'd.uk_rfc_personal',
                'p.nombres',
                'p.apellido_paterno',
                'p.apellido_materno',
            ])
            ->first();
    }

    private function sedeDetalle(int $sede): ?object
    {
        return DB::table('tb_sede as s')
            ->leftJoin('tb_tipo_sede as ts', 'ts.id_tipo_sede', '=', 's.fk_tipo_sede')
            ->where('s.estatus_operativo', 'activo')
            ->where('s.id_sede', $sede)
            ->select([
                's.id_sede',
                DB::raw("CONCAT('Hospital Hopewell ', s.nombre_sede) as hospital"),
                's.nombre_sede',
                's.responsable',
                's.telefono',
                's.uk_correo',
                's.estatus_operativo',
                'ts.uk_nombre_tipo_sede as tipo_sede',
                DB::raw("CONCAT('Direccion asociada al asentamiento #', s.fk_asentamiento_sede) as direccion"),
            ])
            ->first();
    }

    private function medicosActivosEnPeriodo(Request $request): int
    {
        return DB::table('tb_doctor_consultorio as dc')
            ->join('tb_consultorio as co', 'co.id_consultorio', '=', 'dc.fk_consultorio')
            ->join('tb_consulta_medica as cm', 'cm.fk_consultorio_consulta_medica', '=', 'co.id_consultorio')
            ->join('tb_expediente_clinico as ec', 'ec.id_expediente', '=', 'cm.fk_expediente_consulta_medica')
            ->whereDate('ec.fecha_apertura', '>=', $request->query('fecha_inicio'))
            ->whereDate('ec.fecha_apertura', '<=', $request->query('fecha_fin'))
            ->distinct('dc.fk_doctor')
            ->count('dc.fk_doctor');
    }

    private function diagnosticosPorPaciente(int $paciente): Collection
    {
        return DB::table('tb_diagnostico as d')
            ->join('tb_consulta_medica as cm', 'cm.id_consulta_medica', '=', 'd.fk_consulta_medica_diagnostico')
            ->join('tb_expediente_clinico as ec', 'ec.id_expediente', '=', 'cm.fk_expediente_consulta_medica')
            ->where('ec.fk_paciente_expediente_clinico', $paciente)
            ->select(['d.id_diagnostico', 'd.nombre_diagnostico', 'd.descripcion_diagnostico', 'd.observaciones', 'd.fecha_crecion'])
            ->orderByDesc('d.fecha_crecion')
            ->get();
    }

    private function tratamientosPorPaciente(int $paciente): Collection
    {
        return DB::table('tb_tratamiento as t')
            ->leftJoin('tb_diagnostico as d', 'd.id_diagnostico', '=', 't.fk_diagnostico_tratamiento')
            ->where('t.fk_paciente_tratamiento', $paciente)
            ->where('t.estatus', 'activo')
            ->select(['t.id_tratamiento', 't.descripcion', 't.inicio_tratamiento', 't.termino_tratamiento', 't.indicaciones', 't.estatus', 'd.nombre_diagnostico'])
            ->orderByDesc('t.fecha_registro')
            ->get();
    }

    private function validarFechasRequeridas(Request $request)
    {
        return Validator::make($request->query(), [
            'fecha_inicio' => ['required', 'date', 'before_or_equal:fecha_fin', 'before_or_equal:today'],
            'fecha_fin' => ['required', 'date', 'before_or_equal:today'],
        ]);
    }

    private function validarFechasOpcionales(Request $request)
    {
        return Validator::make($request->query(), [
            'fecha_inicio' => ['nullable', 'date', 'required_with:fecha_fin', 'before_or_equal:fecha_fin', 'before_or_equal:today'],
            'fecha_fin' => ['nullable', 'date', 'required_with:fecha_inicio', 'before_or_equal:today'],
        ]);
    }

    private function mensajeValidacionFechas($validator): string
    {
        $errors = $validator->errors();

        if ($errors->has('fecha_inicio') && str_contains(implode(' ', $errors->get('fecha_inicio')), 'before or equal')) {
            return 'El rango de fechas es invalido. La fecha inicial no puede ser mayor a la fecha final.';
        }

        return 'No se permiten fechas futuras en el filtro de periodo.';
    }

    private function mensajeDatos(Collection $registros): string
    {
        return $registros->isEmpty()
            ? 'No existen registros disponibles para la consulta realizada.'
            : 'Reporte generado correctamente.';
    }

    private function exportar(Request $request, callable $generador, string $nombre): Response|JsonResponse
    {
        $validator = Validator::make($request->query(), [
            'formato' => ['required', Rule::in(['pdf', 'excel'])],
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'El formato de exportacion debe ser pdf o excel.', $validator->errors()->toArray(), 400);
        }

        $jsonResponse = $generador();

        if ($jsonResponse->getStatusCode() !== 200) {
            return $jsonResponse;
        }

        $payload = $jsonResponse->getData(true);
        $contenido = json_encode($payload['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $formato = $request->query('formato');

        if ($formato === 'excel') {
            return response($this->jsonPlanoAExcelHtml($payload['data']), 200, [
                'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $nombre . '.xls"',
            ]);
        }

        return response($this->crearPdfBasico($nombre, $contenido ?: ''), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $nombre . '.pdf"',
        ]);
    }

    private function jsonPlanoACsv(array $data): string
    {
        $rows = [['seccion', 'campo', 'valor']];
        $this->aplanarCsv($data, '', $rows);

        return collect($rows)
            ->map(fn ($row) => implode(',', array_map(fn ($value) => '"' . str_replace('"', '""', (string) $value) . '"', $row)))
            ->implode("\n");
    }

    private function jsonPlanoAExcelHtml(array $data): string
    {
        $rows = [['seccion', 'campo', 'valor']];
        $this->aplanarCsv($data, '', $rows);

        $body = collect($rows)
            ->map(function ($row): string {
                return '<tr>' . collect($row)
                    ->map(fn ($value): string => '<td>' . e((string) $value) . '</td>')
                    ->implode('') . '</tr>';
            })
            ->implode('');

        return '<!doctype html><html><head><meta charset="utf-8"></head><body><table>' . $body . '</table></body></html>';
    }

    private function aplanarCsv(mixed $value, string $path, array &$rows): void
    {
        if (is_array($value)) {
            foreach ($value as $key => $child) {
                $this->aplanarCsv($child, trim($path . '.' . $key, '.'), $rows);
            }

            return;
        }

        $rows[] = [$path, basename(str_replace('.', '/', $path)), $value ?? ''];
    }

    private function crearPdfBasico(string $titulo, string $contenido): string
    {
        $texto = substr(str_replace(["\r", "\t"], [' ', ' '], $titulo . "\n\n" . $contenido), 0, 3500);
        $lineas = explode("\n", wordwrap($texto, 92));
        $stream = "BT /F1 10 Tf 40 780 Td 14 TL ";

        foreach ($lineas as $linea) {
            $stream .= '(' . str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $linea) . ') Tj T* ';
        }

        $stream .= 'ET';
        $objects = [
            '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
            '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
            '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
            '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
            '5 0 obj << /Length ' . strlen($stream) . " >> stream\n" . $stream . "\nendstream endobj",
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object . "\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";

        for ($i = 1; $i < count($offsets); $i++) {
            $pdf .= str_pad((string) $offsets[$i], 10, '0', STR_PAD_LEFT) . " 00000 n \n";
        }

        return $pdf . "trailer << /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";
    }

    private function registrarAuditoria(Request $request, string $tabla, string $descripcion): void
    {
        $usuarioId = $this->resolveUsuarioId($request);

        if (! $usuarioId) {
            return;
        }

        BitacoraAuditoria::create([
            'fk_usuario_auditoria' => $usuarioId,
            'modulo_afectado' => 'M12 - Reportes',
            'operacion_accion' => 'CONSULTAR',
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
