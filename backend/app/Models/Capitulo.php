<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capitulo extends Model
{
    protected $table = 'tb_capitulo';
    protected $primaryKey = 'id_capitulo';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
