<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asentamiento extends Model
{
    protected $table = 'tb_asentamiento';
    protected $primaryKey = 'id_asentamiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
