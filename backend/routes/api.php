<?php

use App\Http\Controllers\RecetaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\TratamientoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/diagnosticos/{diagnostico}/tratamientos', [TratamientoController::class, 'store']);
    Route::get('/tratamientos/{tratamiento}', [TratamientoController::class, 'show']);
    Route::get('/pacientes/{paciente}/tratamientos', [TratamientoController::class, 'indexPorPaciente']);
    Route::patch('/tratamientos/{tratamiento}/estatus', [TratamientoController::class, 'updateEstatus']);

    Route::post('/tratamientos/{tratamiento}/recetas', [RecetaController::class, 'store']);
    Route::get('/recetas/{receta}', [RecetaController::class, 'show']);
    Route::get('/pacientes/{paciente}/recetas', [RecetaController::class, 'indexPorPaciente']);

    Route::prefix('reportes')->group(function (): void {
        Route::get('/resumen-clinico/{paciente}', [ReporteController::class, 'resumenClinico']);
        Route::get('/historial-consultas/{paciente}', [ReporteController::class, 'historialConsultas']);
        Route::get('/por-medico/{doctor}', [ReporteController::class, 'porMedico']);
        Route::get('/por-sede/{sede}', [ReporteController::class, 'porSede']);
        Route::get('/por-periodo', [ReporteController::class, 'porPeriodo']);
        Route::get('/resumen-clinico/{paciente}/exportar', [ReporteController::class, 'exportarResumenClinico']);
        Route::get('/historial-consultas/{paciente}/exportar', [ReporteController::class, 'exportarHistorialConsultas']);
        Route::get('/por-medico/{doctor}/exportar', [ReporteController::class, 'exportarPorMedico']);
        Route::get('/por-sede/{sede}/exportar', [ReporteController::class, 'exportarPorSede']);
        Route::get('/por-periodo/exportar', [ReporteController::class, 'exportarPorPeriodo']);
    });
});
