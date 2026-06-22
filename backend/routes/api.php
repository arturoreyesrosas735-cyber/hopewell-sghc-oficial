<?php

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\EspecialidadController;
use Illuminate\Support\Facades\Route;

Route::get('/doctores', [DoctorController::class, 'index']);
Route::get('/especialidades', [DoctorController::class, 'especialidades']);
Route::get('/especialidades-catalogo', [EspecialidadController::class, 'index']);
Route::post('/especialidades-catalogo', [EspecialidadController::class, 'store']);
Route::get('/especialidades-catalogo/{especialidad}', [EspecialidadController::class, 'show']);
Route::put('/especialidades-catalogo/{especialidad}', [EspecialidadController::class, 'update']);
Route::patch('/especialidades-catalogo/{especialidad}/estado', [EspecialidadController::class, 'cambiarEstado']);
Route::get('/estados-empleado', [DoctorController::class, 'estadosEmpleado']);
Route::get('/personal-disponible', [DoctorController::class, 'personalDisponible']);
Route::get('/sedes', [DoctorController::class, 'sedes']);
Route::get('/doctores/{doctor}', [DoctorController::class, 'show']);
Route::post('/doctores', [DoctorController::class, 'store']);
Route::post('/doctores/{doctor}', [DoctorController::class, 'update']);
Route::put('/doctores/{doctor}', [DoctorController::class, 'update']);
Route::delete('/doctores/{doctor}/documentos/{documento}', [DoctorController::class, 'eliminarDocumento']);
Route::patch('/doctores/{doctor}/inactivar', [DoctorController::class, 'inactivar']);
Route::patch('/doctores/{doctor}/reactivar', [DoctorController::class, 'reactivar']);
