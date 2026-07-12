<?php

use App\Http\Controllers\DiagnosticoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/diagnosticos/resumen', [DiagnosticoController::class, 'resumen']);
    Route::get('/diagnosticos/{id}', [DiagnosticoController::class, 'show']);
    Route::put('/diagnosticos/{id}', [DiagnosticoController::class, 'update']);
    Route::patch('/diagnosticos/{id}/estatus', [DiagnosticoController::class, 'update']);

    Route::get('/consultas/{consulta}/diagnosticos', [DiagnosticoController::class, 'indexByConsulta']);
    Route::post('/consultas/{consulta}/diagnosticos', [DiagnosticoController::class, 'store']);

    Route::get('/expedientes/{expediente}/diagnosticos', [DiagnosticoController::class, 'indexByExpediente']);
});
