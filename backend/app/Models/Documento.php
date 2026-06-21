<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    protected $table = 'tb_documento';
    protected $primaryKey = 'id_documento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'tamano_archivo' => 'decimal:2',
            'fecha_carga' => 'datetime',
        ];
    }
}
