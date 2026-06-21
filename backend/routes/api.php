<?php

use App\Http\Controllers\DoctorController;
use Illuminate\Support\Facades\Route;

Route::get('/doctores', [DoctorController::class, 'index']);
Route::get('/especialidades', [DoctorController::class, 'especialidades']);
Route::get('/estados-empleado', [DoctorController::class, 'estadosEmpleado']);
Route::get('/personal-disponible', [DoctorController::class, 'personalDisponible']);
Route::get('/sedes', [DoctorController::class, 'sedes']);
Route::get('/doctores/{doctor}', [DoctorController::class, 'show']);
Route::post('/doctores', [DoctorController::class, 'store']);
Route::put('/doctores/{doctor}', [DoctorController::class, 'update']);
Route::patch('/doctores/{doctor}/inactivar', [DoctorController::class, 'inactivar']);
