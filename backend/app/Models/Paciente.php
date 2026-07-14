<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'tb_paciente';
    protected $primaryKey = 'id_paciente';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];
}
