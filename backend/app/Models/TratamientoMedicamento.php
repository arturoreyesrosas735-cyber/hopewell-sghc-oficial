<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TratamientoMedicamento extends Model
{
    protected $table = 'tb_tratamiento_medicamento';
    protected $primaryKey = 'id_medicamento_tratamiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
