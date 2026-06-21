<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enfermera extends Model
{
    protected $table = 'tb_enfermera';
    protected $primaryKey = 'pk_fk_usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
