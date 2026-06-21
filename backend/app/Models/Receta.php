<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    protected $table = 'tb_receta';
    protected $primaryKey = 'id_receta';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_receta' => 'datetime',
        ];
    }
}
