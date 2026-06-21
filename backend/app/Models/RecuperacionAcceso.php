<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecuperacionAcceso extends Model
{
    protected $table = 'tb_recuperacion_acceso';
    protected $primaryKey = 'id_recuperacion';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_solicitud' => 'datetime',
            'fecha_expiracion' => 'datetime',
            'utilizado' => 'boolean',
            'fecha_uso' => 'datetime',
        ];
    }
}
