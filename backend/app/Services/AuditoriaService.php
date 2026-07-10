<?php

namespace App\Services;

use App\Models\BitacoraAuditoria;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Throwable;

class AuditoriaService
{
    public function registrarEvento(Request $request, array $datos): void
    {
        $usuarioId = $datos['fk_usuario_auditoria'] ?? $this->resolveUsuarioId($request);

        if (! $usuarioId) {
            return;
        }

        try {
            BitacoraAuditoria::create([
                'fk_usuario_auditoria' => $usuarioId,
                'modulo_afectado' => $datos['modulo_afectado'] ?? 'M13 - Auditorias',
                'operacion_accion' => $datos['operacion_accion'] ?? 'CONSULTAR',
                'fecha_registro' => $datos['fecha_registro'] ?? now(),
                'fecha_edicion' => $datos['fecha_edicion'] ?? now(),
                'tabla_afectada' => $datos['tabla_afectada'] ?? 'tb_bitacora_auditoria',
                'descripcion' => $datos['descripcion'] ?? null,
                'direccion_ip' => $datos['direccion_ip'] ?? $request->ip(),
            ]);
        } catch (Throwable) {
            // La auditoria no debe romper la operacion principal.
        }
    }

    public function resolveUsuarioId(Request $request): ?int
    {
        $headerUser = $request->header('X-Usuario-Id');

        try {
            if ($headerUser && Usuario::whereKey((int) $headerUser)->exists()) {
                return (int) $headerUser;
            }

            $authId = $request->user()?->getAuthIdentifier();

            if ($authId && Usuario::whereKey((int) $authId)->exists()) {
                return (int) $authId;
            }

            return Usuario::query()->value('id_usuario');
        } catch (Throwable) {
            return null;
        }
    }
}
