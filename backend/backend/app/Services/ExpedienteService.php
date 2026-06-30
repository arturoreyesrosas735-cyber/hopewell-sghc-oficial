<?php

namespace App\Services;

use App\Models\ExpedienteClinico;
use Illuminate\Support\Facades\DB;
use Exception;

class ExpedienteService
{
    public function crear(array $data)
    {
        DB::beginTransaction();

        try {

            $this->validarUnico($data['fk_paciente_expediente_clinico']);

            $exp = ExpedienteClinico::create([
                ...$data,
                'fecha_apertura' => now(),
                'estatus' => 'activo'
            ]);

            DB::commit();
            return $exp;

        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function validarUnico($pacienteId)
    {
        if (ExpedienteClinico::where([
            ['fk_paciente_expediente_clinico', '=', $pacienteId],
            ['estatus', '=', 'activo']
        ])->exists()) {
            throw new Exception("Expediente activo existente");
        }
    }
}
