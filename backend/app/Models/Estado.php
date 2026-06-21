<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'tb_estado';
    protected $primaryKey = 'id_estado';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
