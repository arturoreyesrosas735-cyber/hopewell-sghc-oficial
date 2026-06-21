<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoSede extends Model
{
    protected $table = 'tb_tipo_sede';
    protected $primaryKey = 'id_tipo_sede';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
