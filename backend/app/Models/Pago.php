<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'tb_pago';
    protected $primaryKey = 'id_pago';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha_hora_pago' => 'datetime',
        ];
    }
}
