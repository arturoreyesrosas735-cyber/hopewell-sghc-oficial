#!/bin/bash

echo "🚀 Instalando módulo M3 Expediente Clínico..."

# =========================
# CREAR RAMA
# =========================
git checkout -b feature/expediente-clinico

# =========================
# BACKEND
# =========================
mkdir -p backend/app/Http/Controllers/Api
mkdir -p backend/app/Services
mkdir -p backend/app/Models
mkdir -p backend/database/migrations

# ===== Controller =====
cat <<EOF > backend/app/Http/Controllers/Api/ExpedienteClinicoController.php<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ExpedienteService;

class ExpedienteClinicoController extends Controller
{
    private \$service;

    public function __construct(ExpedienteService \$service)
    { \$this->service = \$service;
    }

    public function store(Request \$request)
    {
        \$data = \$request->validate([
            'fk_paciente_expediente_clinico' => 'required|integer'
        ]);

        \$exp = \$this->service->crear(\$data);

        return response()->json([
            "success" => true,
            "data" => \$exp,
"message" => "Expediente creado",
            "errors" => null
        ], 201);
    }
}
EOF


# ===== Service =====
cat <<EOF > backend/app/Services/ExpedienteService.php
<?php

namespace App\Services;

use App\Models\ExpedienteClinico;
use Illuminate\Support\Facades\DB;
use Exception;

class ExpedienteService
{
    public function crear(array \$data)
    {
        DB::beginTransaction();

        try {

            \$this->validarUnico(\$data['fk_paciente_expediente_clinico']);

            \$exp = ExpedienteClinico::create([
                ...\$data,
                'fecha_apertura' => now(),
                'estatus' => 'activo'
            ]);

            DB::commit();
            return \$exp;

        } catch (\Throwable \$e) {
            DB::rollBack();
            throw \$e;
        }
    }

    private function validarUnico(\$pacienteId)
    {
        if (ExpedienteClinico::where([
            ['fk_paciente_expediente_clinico', '=', \$pacienteId],
            ['estatus', '=', 'activo']
        ])->exists()) {
            throw new Exception("Expediente activo existente");
        }
    }
}
EOF


# ===== Model =====
cat <<EOF > backend/app/Models/ExpedienteClinico.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpedienteClinico extends Model
{
    protected \$table = 'tb_expediente_clinico';
    protected \$primaryKey = 'id_expediente';
    public \$timestamps = false;

    protected \$fillable = [
        'fk_paciente_expediente_clinico',
        'motivo',
        'fk_diagnostico_expediente_clinico',
        'antecedente_familiar',
        'notas',
        'fecha_apertura',
        'estatus'
    ];
}
EOF


# ===== Migration =====
cat <<EOF > backend/database/migrations/create_tb_expediente_clinico.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tb_expediente_clinico', function (Blueprint \$table) {
            \$table->smallIncrements('id_expediente');
            \$table->unsignedSmallInteger('fk_paciente_expediente_clinico');

            \$table->string('motivo', 255)->nullable();
            \$table->unsignedSmallInteger('fk_diagnostico_expediente_clinico')->nullable();

            \$table->text('antecedente_familiar')->nullable();
            \$table->text('notas')->nullable();
            \$table->timestamp('fecha_apertura');

            \$table->string('estatus',20)->default('activo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_expediente_clinico');
    }
};
EOF


# ===== Routes =====
cat <<EOF >> backend/routes/api.php

use App\Http\Controllers\Api\ExpedienteClinicoController;

Route::prefix('v1')->group(function () {
    Route::post('expedientes', [ExpedienteClinicoController::class, 'store']);
});
EOF


# =========================
# FRONTEND
# =========================

mkdir -p frontend/src/services
mkdir -p frontend/src/pages/expedientes

cat <<EOF > frontend/src/services/expedienteService.ts
import api from "./api";

export const crearExpediente = (data:any) =>
  api.post("/expedientes", data);
EOF


cat <<EOF > frontend/src/pages/expedientes/ExpedientePage.tsx
import { useState } from "react";
import { crearExpediente } from "../../services/expedienteService";

export default function ExpedientePage(){

  const crear = async ()=>{
    await crearExpediente({ fk_paciente_expediente_clinico: 1});
    alert("creado");
  }

  return (
    <div>
      <h1>Expedientes</h1>
      <button onClick={crear}>Crear expediente</button>
    </div>
  );
}
EOF


# =========================
# DOCUMENTACIÓN
# =========================

cat <<EOF > README_M3.md
# M3 Expediente Clínico

## Instalación

Backend:
 composer install
 php artisan migrate
 php artisan serve

Frontend:
 npm install
 npm run dev

## Endpoints

POST /api/v1/expedientes
EOF


# =========================
# GIT commit
# =========================
git add .
git commit -m "feat(m3): módulo expediente clínico listo producción"

echo "✅ Módulo M3 instalado correctamente"
echo "🌿 Rama: feature/expediente-clinico"
