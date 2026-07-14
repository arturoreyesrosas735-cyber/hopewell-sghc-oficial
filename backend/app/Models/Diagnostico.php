<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnostico extends Model
{
    protected $table = 'tb_diagnostico';
    protected $primaryKey = 'id_diagnostico';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'fecha_crecion' => 'datetime',
    ];
}
