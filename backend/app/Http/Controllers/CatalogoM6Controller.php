<?php

namespace App\Http\Controllers;

use App\Models\Diagnostico;
use App\Models\Medicamento;
use App\Models\Paciente;
use App\Models\Padecimiento;
use App\Models\Tratamiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CatalogoM6Controller extends Controller
{
    public function pacientes(): JsonResponse
    {
        return $this->apiResponse(Paciente::query()
            ->where('estatus', 'activo')
            ->orderBy('nombres')
            ->get());
    }

    public function diagnosticos(): JsonResponse
    {
        return $this->apiResponse(Diagnostico::query()
            ->orderByDesc('fecha_crecion')
            ->get());
    }

    public function padecimientos(): JsonResponse
    {
        return $this->apiResponse(Padecimiento::query()
            ->orderBy('uk_nombre_padecimiento')
            ->get());
    }

    public function medicamentos(): JsonResponse
    {
        return $this->apiResponse(Medicamento::query()
            ->orderBy('uk_nombre_medicamento')
            ->get());
    }

    public function tratamientos(): JsonResponse
    {
        return $this->apiResponse(Tratamiento::with(['paciente', 'diagnostico', 'medicamento'])
            ->where('estatus', 'activo')
            ->orderByDesc('fecha_registro')
            ->get());
    }

    public function expedientes(): JsonResponse
    {
        return $this->apiResponse(DB::table('tb_expediente_clinico')
            ->join('tb_paciente', 'tb_paciente.id_paciente', '=', 'tb_expediente_clinico.fk_paciente_expediente_clinico')
            ->select('tb_expediente_clinico.*', 'tb_paciente.nombres', 'tb_paciente.apellido_paterno', 'tb_paciente.apellido_materno')
            ->orderByDesc('tb_expediente_clinico.fecha_apertura')
            ->get());
    }

    public function consultas(): JsonResponse
    {
        return $this->apiResponse(DB::table('tb_consulta_medica')
            ->join('tb_expediente_clinico', 'tb_expediente_clinico.id_expediente', '=', 'tb_consulta_medica.fk_expediente_consulta_medica')
            ->join('tb_paciente', 'tb_paciente.id_paciente', '=', 'tb_expediente_clinico.fk_paciente_expediente_clinico')
            ->select('tb_consulta_medica.*', 'tb_paciente.nombres', 'tb_paciente.apellido_paterno', 'tb_paciente.apellido_materno')
            ->orderByDesc('tb_consulta_medica.id_consulta_medica')
            ->get());
    }

    public function enfermedades(): JsonResponse
    {
        return $this->apiResponse(DB::table('tb_enfermedad')
            ->orderBy('uk_tipo_enfermedad')
            ->get());
    }

    public function storeMedicamento(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'presentacion' => ['nullable', 'string', 'max:100'],
            'concentracion' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Datos invalidos.',
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $data = $validator->validated();
        $existing = DB::table('tb_medicamento')
            ->whereRaw('LOWER(uk_nombre_medicamento) = ?', [strtolower($data['nombre'])])
            ->first();

        if ($existing) {
            return $this->apiResponse($existing);
        }

        $id = DB::table('tb_medicamento')->insertGetId([
            'uk_nombre_medicamento' => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? 'Capturado desde menu de medicamentos',
            'presentacion' => $data['presentacion'] ?? 'No especificada',
            'concentracion' => $data['concentracion'] ?? 'No especificada',
        ], 'id_medicamento');

        return $this->apiResponse(DB::table('tb_medicamento')->where('id_medicamento', $id)->first());
    }

    public function storeEnfermedad(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => ['required', 'string', 'max:150'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Datos invalidos.',
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $nombre = $validator->validated()['nombre'];
        $existing = DB::table('tb_enfermedad')
            ->whereRaw('LOWER(uk_tipo_enfermedad) = ?', [strtolower($nombre)])
            ->first();

        if ($existing) {
            return $this->apiResponse($existing);
        }

        $suffix = now()->format('Hisv');
        $id = 'ENF' . substr($suffix, -6);
        DB::table('tb_enfermedad')->insert([
            'id_enfermedad' => $id,
            'uk_tipo_enfermedad' => $nombre,
            'fk_bloque_enfermedad' => DB::table('tb_bloque')->value('id_bloque'),
        ]);

        return $this->apiResponse(DB::table('tb_enfermedad')->where('id_enfermedad', $id)->first());
    }

    private function apiResponse(mixed $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Catalogo consultado correctamente',
            'errors' => null,
        ]);
    }
}
