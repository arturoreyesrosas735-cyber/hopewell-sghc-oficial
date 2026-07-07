<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    protected $table = 'tb_receta';
    protected $primaryKey = 'id_receta';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_receta' => 'datetime',
        ];
    }

    public function tratamiento(): BelongsTo
    {
        return $this->belongsTo(Tratamiento::class, 'fk_tratamiento_receta', 'id_tratamiento');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'fk_doctor_receta', 'pk_fk_usuario');
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'fk_paciente_receta', 'id_paciente');
    }
}
