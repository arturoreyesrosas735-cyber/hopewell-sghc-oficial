<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpedienteClinico extends Model
{
    protected $table = 'tb_expediente_clinico';
    protected $primaryKey = 'id_expediente';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'fecha_apertura' => 'datetime',
    ];
}
