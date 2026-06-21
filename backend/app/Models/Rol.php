<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'tb_rol';
    protected $primaryKey = 'id_rol';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_crecion' => 'datetime',
            'fecha_modificacion' => 'datetime',
        ];
    }
}
