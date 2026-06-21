<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EspecialidadDoctor extends Model
{
    protected $table = 'tb_especialidad_doctor';
    protected $primaryKey = 'id_especialidad_doctor';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
