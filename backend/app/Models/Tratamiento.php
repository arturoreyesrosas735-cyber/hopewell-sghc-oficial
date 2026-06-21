<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    protected $table = 'tb_tratamiento';
    protected $primaryKey = 'id_tratamiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'inicio_tratamiento' => 'date',
            'termino_tratamiento' => 'date',
            'fecha_registro' => 'datetime',
        ];
    }
}
