<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    protected $table = 'tb_metodo_pago';
    protected $primaryKey = 'id_metodo_pago';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'requiere_referencia' => 'boolean',
        ];
    }
}
