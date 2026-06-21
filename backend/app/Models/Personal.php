<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personal extends Model
{
    protected $table = 'tb_personal';
    protected $primaryKey = 'id_personal';
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
