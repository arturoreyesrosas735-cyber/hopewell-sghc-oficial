<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    protected $table = 'tb_documento';
    protected $primaryKey = 'id_documento';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'fecha_carga' => 'datetime',
    ];
}
