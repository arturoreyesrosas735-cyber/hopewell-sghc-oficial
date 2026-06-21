<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PacientePadecimiento extends Model
{
    protected $table = 'tb_paciente_padecimiento';
    protected $primaryKey = 'id_paciente_padecimiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
