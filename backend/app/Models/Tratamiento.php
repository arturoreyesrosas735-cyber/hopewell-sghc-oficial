<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    protected $table = 'tb_tratamiento';
    protected $primaryKey = 'id_tratamiento';
    public $timestamps = false;
    protected $guarded = [];
}
