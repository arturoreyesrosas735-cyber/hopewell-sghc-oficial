<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpedienteClinico extends Model
{
    protected $table = 'tb_expediente_clinico';
    protected $primaryKey = 'id_expediente';
    public $timestamps = false;

    protected $fillable = [
        'fk_paciente_expediente_clinico',
        'motivo',
        'fk_diagnostico_expediente_clinico',
        'antecedente_familiar',
        'notas',
        'fecha_apertura',
        'estatus'
    ];
}
