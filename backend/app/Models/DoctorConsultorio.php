<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorConsultorio extends Model
{
    protected $table = 'tb_doctor_consultorio';
    protected $primaryKey = 'id_asignacion';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
