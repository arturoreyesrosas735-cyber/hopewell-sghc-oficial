<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parentesco extends Model
{
    protected $table = 'tb_parentesco';
    protected $primaryKey = 'id_parentesco';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
