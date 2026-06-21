<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Padecimiento extends Model
{
    protected $table = 'tb_padecimiento';
    protected $primaryKey = 'id_padecimiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
