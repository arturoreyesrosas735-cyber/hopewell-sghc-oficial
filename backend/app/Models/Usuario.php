<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'tb_usuario';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'requiere_cambio_contrasena' => 'boolean',
            'perfil_completo' => 'boolean',
            'bloqueado_hasta' => 'datetime',
            'ultimo_acceso' => 'datetime',
            'fecha_crecion' => 'datetime',
            'fecha_modificacion' => 'datetime',
        ];
    }
}
