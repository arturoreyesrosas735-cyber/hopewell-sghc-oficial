<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BitacoraAuditoria extends Model
{
    protected $table = 'tb_bitacora_auditoria';
    protected $primaryKey = 'id_bitacora_auditoria';
    public $timestamps = false;
    protected $guarded = [];
}
