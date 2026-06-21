<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnfermeraDoctorConsultorio extends Model
{
    protected $table = 'tb_enfermera_doctor_consultorio';
    protected $primaryKey = 'id_asignacion_enfermera';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];
}
