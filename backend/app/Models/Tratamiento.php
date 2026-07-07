<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    protected $table = 'tb_tratamiento';
    protected $primaryKey = 'id_tratamiento';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'inicio_tratamiento' => 'date',
            'termino_tratamiento' => 'date',
            'fecha_registro' => 'datetime',
        ];
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'fk_paciente_tratamiento', 'id_paciente');
    }

    public function diagnostico(): BelongsTo
    {
        return $this->belongsTo(Diagnostico::class, 'fk_diagnostico_tratamiento', 'id_diagnostico');
    }

    public function padecimiento(): BelongsTo
    {
        return $this->belongsTo(Padecimiento::class, 'fk_padecimiento_tratamiento', 'id_padecimiento');
    }

    public function medicamento(): BelongsTo
    {
        return $this->belongsTo(Medicamento::class, 'fk_medicamento_tratamiento', 'id_medicamento');
    }

    public function recetas(): HasMany
    {
        return $this->hasMany(Receta::class, 'fk_tratamiento_receta', 'id_tratamiento');
    }
}
