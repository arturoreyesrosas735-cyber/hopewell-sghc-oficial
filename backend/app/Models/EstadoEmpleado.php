<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoEmpleado extends Model
{
    protected $table = 'tb_estado_empleado';
    protected $primaryKey = 'id_estado_empleado';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
