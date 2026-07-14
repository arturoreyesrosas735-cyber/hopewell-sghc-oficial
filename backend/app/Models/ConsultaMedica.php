<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsultaMedica extends Model
{
    protected $table = 'tb_consulta_medica';
    protected $primaryKey = 'id_consulta_medica';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'fecha_consulta' => 'datetime',
    ];
}
