<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BitacoraAuditoria extends Model
{
    protected $table = 'tb_bitacora_auditoria';
    protected $primaryKey = 'id_auditoria';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_registro' => 'datetime',
            'fecha_edicion' => 'datetime',
        ];
    }
}
