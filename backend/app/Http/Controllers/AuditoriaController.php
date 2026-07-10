<?php

namespace App\Http\Controllers;

use App\Services\AuditoriaService;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuditoriaController extends Controller
{
    public function __construct(private readonly AuditoriaService $auditoriaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->query(), [
            'usuario' => ['nullable', 'integer'],
            'modulo' => ['nullable', 'string', 'max:100'],
            'accion' => ['nullable', 'string', 'max:50'],
            'fecha_desde' => ['nullable', 'date', 'required_with:fecha_hasta', 'before_or_equal:fecha_hasta'],
            'fecha_hasta' => ['nullable', 'date', 'required_with:fecha_desde'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'El rango de fechas ingresado es invalido.', $validator->errors()->toArray(), 400);
        }

        if (! $this->hasTable('tb_bitacora_auditoria')) {
            return $this->apiResponse(true, $this->emptyPage(), 'No existen registros disponibles en la bitacora.');
        }

        if ($request->filled('usuario') && $this->hasTable('tb_usuario') && ! Usuario::whereKey((int) $request->query('usuario'))->exists()) {
            return $this->apiResponse(false, null, 'El usuario ingresado no existe.', ['usuario' => ['El usuario ingresado no existe.']], 400);
        }

        $perPage = (int) $request->query('per_page', 5);
        $page = (int) $request->query('page', 1);
        $query = $this->auditoriaQuery($request);
        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $data = [
            'registros' => $paginator->items(),
            'total' => $paginator->total(),
            'pagina_actual' => $paginator->currentPage(),
            'total_paginas' => max($paginator->lastPage(), 1),
        ];

        $message = $paginator->total() === 0
            ? 'No existen registros disponibles en la bitacora.'
            : 'Consulta realizada correctamente.';

        $this->registrarConsulta($request, $this->descripcionConsulta($request));

        return $this->apiResponse(true, $data, $message);
    }

    public function usuarios(): JsonResponse
    {
        if (! $this->hasTable('tb_usuario')) {
            return $this->apiResponse(true, [], 'No existen usuarios disponibles.');
        }

        $usuarios = Usuario::query()
            ->select(['id_usuario', 'nombre_usuario'])
            ->orderBy('nombre_usuario')
            ->limit(100)
            ->get();

        return $this->apiResponse(true, $usuarios, 'Usuarios consultados correctamente.');
    }

    public function exportar(Request $request): Response|JsonResponse
    {
        $validator = Validator::make($request->query(), [
            'formato' => ['required', Rule::in(['pdf', 'excel'])],
            'usuario' => ['nullable', 'integer'],
            'modulo' => ['nullable', 'string', 'max:100'],
            'accion' => ['nullable', 'string', 'max:50'],
            'fecha_desde' => ['nullable', 'date', 'required_with:fecha_hasta', 'before_or_equal:fecha_hasta'],
            'fecha_hasta' => ['nullable', 'date', 'required_with:fecha_desde'],
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(false, null, 'Ocurrio un error al exportar la informacion.', $validator->errors()->toArray(), 400);
        }

        $registros = $this->hasTable('tb_bitacora_auditoria')
            ? $this->auditoriaQuery($request)->limit(5000)->get()->toArray()
            : [];

        if ($request->query('formato') === 'excel') {
            $this->registrarConsulta($request, 'Exportacion de bitacora de auditoria en formato Excel.');

            return response($this->crearCsv($registros), 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="bitacora-auditoria.csv"',
            ]);
        }

        $this->registrarConsulta($request, 'Exportacion de bitacora de auditoria en formato PDF.');

        return response($this->crearPdfBasico('bitacora-auditoria', json_encode($registros, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) ?: ''), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="bitacora-auditoria.pdf"',
        ]);
    }

    private function auditoriaQuery(Request $request)
    {
        $query = DB::table('tb_bitacora_auditoria as ba')
            ->leftJoin('tb_usuario as u', 'u.id_usuario', '=', 'ba.fk_usuario_auditoria')
            ->select([
                'ba.id_auditoria',
                'ba.fk_usuario_auditoria',
                'u.nombre_usuario as usuario_nombre',
                'ba.modulo_afectado',
                'ba.operacion_accion',
                'ba.fecha_registro',
                'ba.fecha_edicion',
                'ba.tabla_afectada',
                'ba.descripcion',
                'ba.direccion_ip',
            ]);

        if ($request->filled('usuario')) {
            $query->where('ba.fk_usuario_auditoria', (int) $request->query('usuario'));
        }

        if ($request->filled('modulo')) {
            $query->where('ba.modulo_afectado', $request->query('modulo'));
        }

        if ($request->filled('accion')) {
            $query->where('ba.operacion_accion', $request->query('accion'));
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('ba.fecha_registro', '>=', $request->query('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('ba.fecha_registro', '<=', $request->query('fecha_hasta'));
        }

        return $query->orderByDesc('ba.fecha_registro')->orderByDesc('ba.id_auditoria');
    }

    private function emptyPage(): array
    {
        return [
            'registros' => [],
            'total' => 0,
            'pagina_actual' => 1,
            'total_paginas' => 1,
        ];
    }

    private function hasTable(string $table): bool
    {
        try {
            return Schema::hasTable($table);
        } catch (Throwable) {
            return false;
        }
    }

    private function descripcionConsulta(Request $request): string
    {
        $partes = [];

        if ($request->filled('usuario')) {
            $partes[] = 'usuario ID ' . $request->query('usuario');
        }

        if ($request->filled('modulo')) {
            $partes[] = 'modulo ' . $request->query('modulo');
        }

        if ($request->filled('accion')) {
            $partes[] = 'accion ' . $request->query('accion');
        }

        if ($request->filled('fecha_desde') && $request->filled('fecha_hasta')) {
            $partes[] = 'fechas ' . $request->query('fecha_desde') . ' a ' . $request->query('fecha_hasta');
        }

        return empty($partes)
            ? 'Consulta de bitacora completa.'
            : 'Consulta de bitacora filtrada por ' . implode(' y ', $partes) . '.';
    }

    private function registrarConsulta(Request $request, string $descripcion): void
    {
        $this->auditoriaService->registrarEvento($request, [
            'modulo_afectado' => 'M13 - Auditorias',
            'operacion_accion' => 'CONSULTAR',
            'tabla_afectada' => 'tb_bitacora_auditoria',
            'descripcion' => $descripcion,
        ]);
    }

    private function crearCsv(array $registros): string
    {
        $headers = ['id_auditoria', 'fecha_registro', 'usuario', 'modulo', 'accion', 'descripcion', 'direccion_ip'];
        $rows = [$headers];

        foreach ($registros as $registro) {
            $row = (array) $registro;
            $rows[] = [
                $row['id_auditoria'] ?? '',
                $row['fecha_registro'] ?? '',
                $row['usuario_nombre'] ?? '',
                $row['modulo_afectado'] ?? '',
                $row['operacion_accion'] ?? '',
                $row['descripcion'] ?? '',
                $row['direccion_ip'] ?? '',
            ];
        }

        return collect($rows)
            ->map(fn ($row) => implode(',', array_map(fn ($value) => '"' . str_replace('"', '""', (string) $value) . '"', $row)))
            ->implode("\n");
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
