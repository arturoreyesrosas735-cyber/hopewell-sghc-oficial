<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SignoVital extends Model
{
    protected $table = 'tb_signo_vital';
    protected $primaryKey = 'id_signo';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'temperatura_c' => 'decimal:1',
            'peso_kg' => 'decimal:2',
            'estatura_cm' => 'decimal:2',
            'fecha_registro' => 'datetime',
        ];
    }
}
