<?php

use App\Http\Controllers\RecetaController;
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
});
