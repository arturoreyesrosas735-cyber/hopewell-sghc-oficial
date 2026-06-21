<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cronicidad extends Model
{
    protected $table = 'tb_cronicidad';
    protected $primaryKey = 'id_cronico';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
