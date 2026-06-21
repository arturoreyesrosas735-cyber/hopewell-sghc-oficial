<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MunicipioAlcaldia extends Model
{
    protected $table = 'tb_municipio_alcaldia';
    protected $primaryKey = 'id_municipio_alcaldia';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
