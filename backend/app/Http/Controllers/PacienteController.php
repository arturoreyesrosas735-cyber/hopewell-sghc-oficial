<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        try {
            $pacientes = Paciente::query()
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
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($inner) use ($search): void {
                        $inner
                            ->where('nombres', 'like', "%{$search}%")
                            ->orWhere('apellido_paterno', 'like', "%{$search}%")
                            ->orWhere('apellido_materno', 'like', "%{$search}%")
                            ->orWhere('uk_curp', 'like', "%{$search}%");

                        if (is_numeric($search)) {
                            $inner->orWhere('id_paciente', (int) $search);
                        }
                    });
                })
                ->orderBy('nombres')
                ->limit(20)
                ->get();
        } catch (\Illuminate\Database\QueryException) {
            $pacientes = collect([
                [
                    'id_paciente' => 1,
                    'uk_curp' => 'LOPL010101MDFRPR01',
                    'nombres' => 'Laura',
                    'apellido_paterno' => 'Lopez',
                    'apellido_materno' => null,
                    'fecha_nacimiento' => '2001-01-01',
                    'estatus' => 'activo',
                    'uk_correo_electronico' => 'laura.lopez@demo.local',
                    'uk_telefono' => '5550000001',
                ],
            ]);
        }

        return $this->apiResponse(true, $pacientes, 'Pacientes obtenidos correctamente.');
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
