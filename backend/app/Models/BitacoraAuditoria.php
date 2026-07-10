<?php

namespace App\Models;

use RuntimeException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BitacoraAuditoria extends Model
{
    protected $table = 'tb_bitacora_auditoria';
    protected $primaryKey = 'id_auditoria';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected static function booted(): void
    {
        static::updating(function (): never {
            throw new RuntimeException('Los registros de auditoria son inmutables.');
        });

        static::deleting(function (): never {
            throw new RuntimeException('Los registros de auditoria no pueden eliminarse.');
        });
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'fk_usuario_auditoria', 'id_usuario');
    }

    protected function casts(): array
    {
        return [
            'fecha_registro' => 'datetime',
            'fecha_edicion' => 'datetime',
        ];
    }
}
