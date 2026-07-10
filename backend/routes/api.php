<?php

use App\Http\Controllers\RecetaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\AuditoriaController;
use App\Http\Controllers\CatalogoM6Controller;
use App\Http\Controllers\TratamientoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/usuarios', [AuditoriaController::class, 'usuarios']);
    Route::get('/auditoria', [AuditoriaController::class, 'index']);
    Route::get('/auditoria/exportar', [AuditoriaController::class, 'exportar']);

    Route::get('/catalogos/pacientes', [CatalogoM6Controller::class, 'pacientes']);
    Route::get('/catalogos/diagnosticos', [CatalogoM6Controller::class, 'diagnosticos']);
    Route::get('/catalogos/padecimientos', [CatalogoM6Controller::class, 'padecimientos']);
    Route::get('/catalogos/medicamentos', [CatalogoM6Controller::class, 'medicamentos']);
    Route::get('/catalogos/tratamientos', [CatalogoM6Controller::class, 'tratamientos']);
    Route::get('/catalogos/expedientes', [CatalogoM6Controller::class, 'expedientes']);
    Route::get('/catalogos/consultas', [CatalogoM6Controller::class, 'consultas']);
    Route::get('/catalogos/enfermedades', [CatalogoM6Controller::class, 'enfermedades']);
    Route::post('/catalogos/medicamentos', [CatalogoM6Controller::class, 'storeMedicamento']);
    Route::post('/catalogos/enfermedades', [CatalogoM6Controller::class, 'storeEnfermedad']);

    Route::post('/diagnosticos/{diagnostico}/tratamientos', [TratamientoController::class, 'store']);
    Route::get('/tratamientos/{tratamiento}', [TratamientoController::class, 'show']);
    Route::get('/pacientes/{paciente}/tratamientos', [TratamientoController::class, 'indexPorPaciente']);
    Route::patch('/tratamientos/{tratamiento}/estatus', [TratamientoController::class, 'updateEstatus']);

    Route::post('/tratamientos/{tratamiento}/recetas', [RecetaController::class, 'store']);
    Route::post('/recetas', [RecetaController::class, 'storeDirecta']);
    Route::get('/recetas/{receta}', [RecetaController::class, 'show']);
    Route::get('/pacientes/{paciente}/recetas', [RecetaController::class, 'indexPorPaciente']);
    Route::get('/tratamientos/{tratamiento}/pdf', [TratamientoController::class, 'pdf']);
    Route::get('/recetas/{receta}/pdf', [RecetaController::class, 'pdf']);

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
