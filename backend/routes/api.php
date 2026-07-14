<?php

use App\Http\Controllers\DiagnosticoController;
use App\Http\Controllers\ExpedienteController;
use App\Http\Controllers\PacienteController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/pacientes', [PacienteController::class, 'index']);

    Route::get('/expedientes/resumen-dia', [ExpedienteController::class, 'resumenDia']);
    Route::get('/expedientes', [ExpedienteController::class, 'index']);
    Route::post('/expedientes', [ExpedienteController::class, 'store']);
    Route::get('/expedientes/{id}', [ExpedienteController::class, 'show'])->whereNumber('id');
    Route::get('/expedientes/{id}/historial', [ExpedienteController::class, 'historial'])->whereNumber('id');
    Route::post('/expedientes/{id}/documentos', [ExpedienteController::class, 'storeDocumento'])->whereNumber('id');
    Route::get('/expedientes/{id}/documentos', [ExpedienteController::class, 'indexDocumentos'])->whereNumber('id');
    Route::get('/documentos/{id}/archivo', [ExpedienteController::class, 'showDocumentoArchivo'])->whereNumber('id')->name('documentos.archivo');

    Route::get('/diagnosticos/resumen', [DiagnosticoController::class, 'resumen']);
    Route::get('/diagnosticos/catalogos/padecimientos', [DiagnosticoController::class, 'padecimientos']);
    Route::get('/diagnosticos/{id}', [DiagnosticoController::class, 'show']);
    Route::put('/diagnosticos/{id}', [DiagnosticoController::class, 'update']);
    Route::patch('/diagnosticos/{id}/estatus', [DiagnosticoController::class, 'update']);

    Route::get('/consultas/{consulta}/diagnosticos', [DiagnosticoController::class, 'indexByConsulta']);
    Route::post('/consultas/{consulta}/diagnosticos', [DiagnosticoController::class, 'store']);

    Route::get('/expedientes/{expediente}/diagnosticos', [DiagnosticoController::class, 'indexByExpediente']);
    Route::post('/expedientes/{expediente}/diagnosticos', [DiagnosticoController::class, 'storeByExpediente']);
});
