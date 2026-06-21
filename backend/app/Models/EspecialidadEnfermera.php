<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EspecialidadEnfermera extends Model
{
    protected $table = 'tb_especialidad_enfermera';
    protected $primaryKey = 'id_especialidad_enfermera';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
