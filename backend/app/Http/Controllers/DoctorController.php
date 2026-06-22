<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    private const RFC_REGEX = '/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/i';
    private const CEDULA_REGEX = '/^[0-9]{8}$/';

    public function especialidades(): JsonResponse
    {
        return response()->json(
            DB::table('tb_especialidad')
                ->select('id_especialidad', 'uk_nombre')
                ->where('estatus', 'Activo')
                ->orderByRaw('LOWER(uk_nombre) ASC')
                ->get(),
        );
    }

    public function estadosEmpleado(): JsonResponse
    {
        return response()->json(
            DB::table('tb_estado_empleado')
                ->select('id_estado_empleado', 'ukTipo_estado')
                ->orderBy('ukTipo_estado')
                ->get(),
        );
    }

    public function sedes(): JsonResponse
    {
        return response()->json(
            DB::table('tb_sede')
                ->select('id_sede', 'nombre_sede')
                ->orderBy('nombre_sede')
                ->get(),
        );
    }

    public function personalDisponible(): JsonResponse
    {
        return response()->json(
            DB::table('tb_personal as personal')
                ->leftJoin('tb_usuario as usuario', 'usuario.fk_personal_usuario', '=', 'personal.id_personal')
                ->leftJoin('tb_doctor as doctor', 'doctor.pk_fk_usuario', '=', 'usuario.id_usuario')
                ->leftJoin('tb_genero as genero', 'genero.id_genero', '=', 'usuario.fk_genero_usuario')
                ->leftJoin('tb_sede as sede', 'sede.id_sede', '=', 'personal.fk_sede_personal')
                ->leftJoin('tb_asentamiento as asentamiento', 'asentamiento.id_asentamiento', '=', 'sede.fk_asentamiento_sede')
                ->leftJoin('tb_codigo_postal as codigo_postal', 'codigo_postal.id_codigo_postal', '=', 'asentamiento.fk_codigo_postal_asentamiento')
                ->leftJoin('tb_municipio_alcaldia as municipio', 'municipio.id_municipio_alcaldia', '=', 'codigo_postal.fk_municipio_alcaldia_codigo_postal')
                ->leftJoin('tb_estado as estado', 'estado.id_estado', '=', 'municipio.fk_estadomunicipio_alcaldia')
                ->select([
                    'personal.id_personal',
                    'personal.uk_numero_empleado',
                    'personal.nombres',
                    'personal.apellido_paterno',
                    'personal.apellido_materno',
                    'personal.telefono',
                    'personal.uk_correo_electronico',
                    'personal.uk_curp',
                    'genero.ukTipo_genero as genero',
                    'sede.nombre_sede',
                    'doctor.pk_fk_usuario as doctor_id',
                    DB::raw('doctor.pk_fk_usuario IS NOT NULL as es_doctor'),
                    DB::raw("CONCAT_WS(', ', asentamiento.uk_nombre_colonia, codigo_postal.uk_numero_codigo_postal, municipio.uk_nombremunicipio_alcaldia, estado.uk_nombre_estado) as direccion"),
                ])
                ->orderBy('personal.uk_numero_empleado')
                ->get(),
        );
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = 10;
        $especialidad = trim((string) $request->query('especialidad', ''));
        $estado = trim((string) $request->query('estado', ''));

        $query = DB::table('tb_doctor as doctor')
            ->join('tb_usuario as usuario', 'usuario.id_usuario', '=', 'doctor.pk_fk_usuario')
            ->join('tb_personal as personal', 'personal.id_personal', '=', 'usuario.fk_personal_usuario')
            ->leftJoin('tb_sede as sede', 'sede.id_sede', '=', 'personal.fk_sede_personal')
            ->leftJoin('tb_estado_empleado as estado_empleado', 'estado_empleado.id_estado_empleado', '=', 'doctor.fk_estado_empleado_doctor')
            ->leftJoin('tb_especialidad_doctor as especialidad_doctor', 'especialidad_doctor.fk_doctor', '=', 'doctor.pk_fk_usuario')
            ->leftJoin('tb_especialidad as especialidad', 'especialidad.id_especialidad', '=', 'especialidad_doctor.fk_especialidad')
            ->leftJoin('tb_doctor_consultorio as doctor_consultorio', 'doctor_consultorio.fk_doctor', '=', 'doctor.pk_fk_usuario')
            ->leftJoin('tb_consultorio as consultorio', 'consultorio.id_consultorio', '=', 'doctor_consultorio.fk_consultorio')
            ->select([
                'doctor.pk_fk_usuario',
                'personal.id_personal',
                'personal.nombres',
                'personal.apellido_paterno',
                'personal.apellido_materno',
                'personal.uk_correo_electronico as correo_electronico',
                'personal.telefono',
                'sede.nombre_sede as sede_nombre',
                'doctor.uk_rfc_personal',
                'doctor.uk_cedula_profesional',
                'doctor.fk_asentamiento_doctor',
                'doctor.fk_estado_empleado_doctor',
                'especialidad.uk_nombre as especialidad',
                'consultorio.nombre_consultorio',
                'consultorio.numero_consultorio',
                DB::raw("COALESCE(estado_empleado.\"ukTipo_estado\", personal.estatus, 'Activo') as estatus"),
            ])
            ->orderBy('personal.nombres');

        if ($search !== '') {
            $query->where(function ($currentQuery) use ($search): void {
                $currentQuery
                    ->where('personal.nombres', 'ilike', "%{$search}%")
                    ->orWhere('personal.apellido_paterno', 'ilike', "%{$search}%")
                    ->orWhere('doctor.uk_cedula_profesional', 'ilike', "%{$search}%")
                    ->orWhere('doctor.uk_rfc_personal', 'ilike', "%{$search}%")
                    ->orWhere('especialidad.uk_nombre', 'ilike', "%{$search}%");
            });
        }

        if ($especialidad !== '' && $especialidad !== 'Todas') {
            $query->where('especialidad.uk_nombre', $especialidad);
        }

        if ($estado !== '' && $estado !== 'Todos') {
            $query->whereRaw("COALESCE(estado_empleado.\"ukTipo_estado\", personal.estatus, 'Activo') = ?", [$estado]);
        }

        $total = (clone $query)->count();
        $rows = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        return response()->json([
            'data' => $rows,
            'meta' => [
                'current_page' => $page,
                'last_page' => max((int) ceil($total / $perPage), 1),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function show(int $doctor): JsonResponse
    {
        $record = DB::table('tb_doctor as doctor')
            ->join('tb_usuario as usuario', 'usuario.id_usuario', '=', 'doctor.pk_fk_usuario')
            ->join('tb_personal as personal', 'personal.id_personal', '=', 'usuario.fk_personal_usuario')
            ->leftJoin('tb_sede as sede', 'sede.id_sede', '=', 'personal.fk_sede_personal')
            ->leftJoin('tb_genero as genero', 'genero.id_genero', '=', 'usuario.fk_genero_usuario')
            ->leftJoin('tb_asentamiento as asentamiento', 'asentamiento.id_asentamiento', '=', 'doctor.fk_asentamiento_doctor')
            ->leftJoin('tb_codigo_postal as codigo_postal', 'codigo_postal.id_codigo_postal', '=', 'asentamiento.fk_codigo_postal_asentamiento')
            ->leftJoin('tb_municipio_alcaldia as municipio', 'municipio.id_municipio_alcaldia', '=', 'codigo_postal.fk_municipio_alcaldia_codigo_postal')
            ->leftJoin('tb_estado as estado', 'estado.id_estado', '=', 'municipio.fk_estadomunicipio_alcaldia')
            ->leftJoin('tb_estado_empleado as estado_empleado', 'estado_empleado.id_estado_empleado', '=', 'doctor.fk_estado_empleado_doctor')
            ->leftJoin('tb_doctor_consultorio as doctor_consultorio', 'doctor_consultorio.fk_doctor', '=', 'doctor.pk_fk_usuario')
            ->leftJoin('tb_consultorio as consultorio', 'consultorio.id_consultorio', '=', 'doctor_consultorio.fk_consultorio')
            ->select([
                'doctor.pk_fk_usuario',
                'personal.id_personal',
                'personal.nombres',
                'personal.apellido_paterno',
                'personal.apellido_materno',
                'personal.uk_correo_electronico as correo_electronico',
                'personal.telefono',
                'personal.uk_curp',
                'personal.uk_numero_empleado',
                'sede.nombre_sede as sede_nombre',
                'genero.ukTipo_genero as genero',
                'asentamiento.uk_nombre_colonia as asentamiento',
                'codigo_postal.uk_numero_codigo_postal as codigo_postal',
                'municipio.uk_nombremunicipio_alcaldia as municipio',
                'estado.uk_nombre_estado as estado',
                'doctor.uk_rfc_personal',
                'doctor.uk_cedula_profesional',
                'doctor.fk_asentamiento_doctor',
                'doctor.fk_estado_empleado_doctor',
                'consultorio.nombre_consultorio',
                'consultorio.numero_consultorio',
                'doctor_consultorio.dia_semana',
                'doctor_consultorio.hora_inicio',
                'doctor_consultorio.hora_fin',
                DB::raw("CONCAT_WS(', ', asentamiento.uk_nombre_colonia, codigo_postal.uk_numero_codigo_postal, municipio.uk_nombremunicipio_alcaldia, estado.uk_nombre_estado) as direccion"),
                DB::raw("COALESCE(estado_empleado.\"ukTipo_estado\", personal.estatus, 'Activo') as estatus"),
            ])
            ->where('doctor.pk_fk_usuario', $doctor)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Doctor no encontrado.'], 404);
        }

        $record->especialidades = DB::table('tb_especialidad_doctor as especialidad_doctor')
            ->join('tb_especialidad as especialidad', 'especialidad.id_especialidad', '=', 'especialidad_doctor.fk_especialidad')
            ->where('especialidad_doctor.fk_doctor', $doctor)
            ->select('especialidad.id_especialidad', 'especialidad.uk_nombre')
            ->get();

        $record->documentos = DB::table('tb_documento_doctor')
            ->where('fk_doctor', $doctor)
            ->where('estatus', 'Activo')
            ->select([
                'id_documento_doctor',
                'tipo_documento',
                'nombre_documento',
                'extension_archivo',
                'ruta_archivo',
                'tamano_archivo',
                'fecha_carga',
            ])
            ->orderBy('tipo_documento')
            ->get()
            ->map(function ($document) {
                $document->url = asset('storage/'.$document->ruta_archivo);

                return $document;
            });

        return response()->json($record);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_personal' => ['required', 'integer', 'exists:tb_personal,id_personal'],
            'uk_rfc_personal' => ['required', 'string', 'size:13', 'regex:'.self::RFC_REGEX, Rule::unique('tb_doctor', 'uk_rfc_personal')],
            'uk_cedula_profesional' => ['required', 'string', 'regex:'.self::CEDULA_REGEX, Rule::unique('tb_doctor', 'uk_cedula_profesional')],
            'especialidad_nombre' => ['nullable', 'string', 'max:150'],
            'sede_nombre' => ['nullable', 'string', 'max:150'],
            'genero_nombre' => ['nullable', 'string', 'max:255'],
            'estado_empleado_nombre' => ['nullable', 'string', 'max:255'],
            'estado_nombre' => ['nullable', 'string', 'max:150'],
            'municipio_nombre' => ['nullable', 'string', 'max:150'],
            'codigo_postal' => ['nullable', 'string', 'size:5'],
            'asentamiento_nombre' => ['nullable', 'string', 'max:150'],
            'especialidades' => ['array'],
            'especialidades.*' => ['integer', 'exists:tb_especialidad,id_especialidad'],
            'cedula_documento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'rfc_documento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        try {
            $existingDoctorId = DB::table('tb_usuario as usuario')
                ->join('tb_doctor as doctor', 'doctor.pk_fk_usuario', '=', 'usuario.id_usuario')
                ->where('usuario.fk_personal_usuario', $data['id_personal'])
                ->value('doctor.pk_fk_usuario');

            if ($existingDoctorId) {
                return response()->json([
                    'field' => 'id_personal',
                    'message' => 'Este empleado ya tiene perfil de doctor.',
                ], 409);
            }

            $doctorRegistration = DB::transaction(function () use ($data): array {
                $catalogs = $this->resolveDoctorCatalogs($data);
                $specialtyIds = $data['especialidades'] ?? [];
                $personal = DB::table('tb_personal')->where('id_personal', $data['id_personal'])->first();

                if (!$specialtyIds && !empty($data['especialidad_nombre'])) {
                    $specialtyIds[] = $this->firstOrCreateEspecialidad($data['especialidad_nombre']);
                }

                DB::table('tb_personal')->where('id_personal', $data['id_personal'])->update([
                    'fk_sede_personal' => $catalogs['sedeId'],
                    'fecha_modificacion' => now(),
                ]);

                $usuarioId = DB::table('tb_usuario')
                    ->where('fk_personal_usuario', $data['id_personal'])
                    ->value('id_usuario');

                if (!$usuarioId) {
                    $usuarioId = DB::table('tb_usuario')->insertGetId([
                        'nombre_usuario' => $this->buildUsername($personal->uk_correo_electronico, $data['id_personal']),
                        'contrasena_hash' => Hash::make('Password123'),
                        'estatus' => 'Activo',
                        'fk_personal_usuario' => $data['id_personal'],
                        'fk_rol_usuario' => $catalogs['rolId'],
                        'fk_genero_usuario' => $catalogs['generoId'],
                        'uk_correo_electronico' => $personal->uk_correo_electronico,
                        'requiere_cambio_contrasena' => true,
                        'perfil_completo' => false,
                        'intentos_fallidos' => 0,
                        'bloqueado_hasta' => null,
                        'ultimo_acceso' => null,
                        'fecha_crecion' => now(),
                        'fecha_modificacion' => null,
                    ], 'id_usuario');
                }

                DB::table('tb_doctor')->insert([
                    'pk_fk_usuario' => $usuarioId,
                    'uk_cedula_profesional' => $data['uk_cedula_profesional'],
                    'uk_rfc_personal' => $data['uk_rfc_personal'],
                    'fk_asentamiento_doctor' => $catalogs['asentamientoId'],
                    'fk_estado_empleado_doctor' => $catalogs['estadoEmpleadoId'],
                ]);

                foreach ($specialtyIds as $especialidadId) {
                    DB::table('tb_especialidad_doctor')->insert([
                        'fk_doctor' => $usuarioId,
                        'fk_especialidad' => $especialidadId,
                    ]);
                }

                $consultorioId = $this->assignDoctorConsultorio($usuarioId, $catalogs['sedeId']);

                return [
                    'consultorioId' => $consultorioId,
                    'doctorId' => $usuarioId,
                ];
            });

            $doctorId = $doctorRegistration['doctorId'];
            $consultorioId = $doctorRegistration['consultorioId'];
        } catch (\Illuminate\Database\QueryException $exception) {
            $field = str_contains($exception->getMessage(), 'rfc')
                ? 'uk_rfc_personal'
                : 'uk_cedula_profesional';

            return response()->json(['field' => $field, 'message' => 'Este registro ya existe.'], 409);
        }

        $savedDocuments = $this->saveDoctorDocuments($request, $doctorId);

        $this->recordAudit(
            $request,
            $doctorId,
            'ALTA',
            'tb_doctor',
            "Se registró el perfil de doctor con usuario {$doctorId}.",
        );

        $this->recordAudit(
            $request,
            $doctorId,
            'ALTA',
            'tb_doctor_consultorio',
            "Se asignó el consultorio {$consultorioId} al doctor {$doctorId} sin cita obligatoria.",
        );

        if ($savedDocuments) {
            $this->recordAudit(
                $request,
                $doctorId,
                'ALTA',
                'tb_documento_doctor',
                'Se adjuntaron documentos del doctor: '.implode(', ', $savedDocuments).'.',
            );
        }

        return response()->json(['pk_fk_usuario' => $doctorId], 201);
    }

    private function resolveDoctorCatalogs(array $data): array
    {
        $estadoId = $this->firstOrCreateByColumn('tb_estado', 'id_estado', 'uk_nombre_estado', $data['estado_nombre'] ?? 'Ciudad de México');
        $municipioId = $this->firstOrCreateByColumn('tb_municipio_alcaldia', 'id_municipio_alcaldia', 'uk_nombremunicipio_alcaldia', $data['municipio_nombre'] ?? 'Benito Juárez', [
            'fk_estadomunicipio_alcaldia' => $estadoId,
        ]);
        $codigoPostalId = $this->firstOrCreateByColumn('tb_codigo_postal', 'id_codigo_postal', 'uk_numero_codigo_postal', $data['codigo_postal'] ?? '03100', [
            'fk_municipio_alcaldia_codigo_postal' => $municipioId,
        ]);
        $asentamientoId = $this->firstOrCreateByColumn('tb_asentamiento', 'id_asentamiento', 'uk_nombre_colonia', $data['asentamiento_nombre'] ?? 'Del Valle Centro', [
            'fk_codigo_postal_asentamiento' => $codigoPostalId,
        ]);
        $tipoSedeId = $this->firstOrCreateByColumn('tb_tipo_sede', 'id_tipo_sede', 'uk_nombre_tipo_sede', 'Hospital', [
            'vv_descripcion' => 'Sede hospitalaria',
            'estatus' => 'Activo',
        ]);
        $sedeName = $data['sede_nombre'] ?? 'Hospital Central Hopewell';
        $sedeEmail = strtolower(preg_replace('/[^a-z0-9]+/i', '.', $sedeName)).'@hopewell.com';
        $sedeId = $this->firstOrCreateByColumn('tb_sede', 'id_sede', 'nombre_sede', $sedeName, [
            'fk_tipo_sede' => $tipoSedeId,
            'fk_asentamiento_sede' => $asentamientoId,
            'telefono' => '5550000000',
            'uk_correo' => $sedeEmail,
            'responsable' => 'Administración Hopewell',
            'fecha_crecion' => now(),
            'estatus_operativo' => 'Activo',
        ]);
        $rolId = $this->firstOrCreateByColumn('tb_rol', 'id_rol', 'uk_nombre_rol', 'Doctor', [
            'descripcion' => 'Personal médico',
            'estatus' => 'Activo',
            'fecha_crecion' => now(),
            'fecha_modificacion' => null,
        ]);
        $generoId = $this->firstOrCreateByColumn('tb_genero', 'id_genero', 'ukTipo_genero', $data['genero_nombre'] ?? 'No especificado');
        $estadoEmpleadoId = $this->firstOrCreateByColumn('tb_estado_empleado', 'id_estado_empleado', 'ukTipo_estado', $data['estado_empleado_nombre'] ?? 'Activo', [
            'vv_descripcion' => 'Personal activo',
        ]);

        return compact('asentamientoId', 'estadoEmpleadoId', 'generoId', 'rolId', 'sedeId');
    }

    private function firstOrCreateEspecialidad(string $name): int
    {
        return $this->firstOrCreateByColumn('tb_especialidad', 'id_especialidad', 'uk_nombre', $name, [
            'estatus' => 'Activo',
            'vv_descripcion' => $name,
        ]);
    }

    private function firstOrCreateByColumn(string $table, string $primaryKey, string $column, mixed $value, array $extra = []): int
    {
        $recordId = DB::table($table)->where($column, $value)->value($primaryKey);

        if ($recordId) {
            return (int) $recordId;
        }

        DB::table($table)->insert([$column => $value] + $extra);

        return (int) DB::table($table)->where($column, $value)->value($primaryKey);
    }

    private function buildFallbackCurp(): string
    {
        return 'DOCT'.date('ymdHis').'MX';
    }

    private function buildUsername(string $email, int $personalId): string
    {
        return explode('@', $email)[0].$personalId;
    }

    public function update(Request $request, int $doctor): JsonResponse
    {
        $data = $request->validate([
            'uk_rfc_personal' => ['required', 'string', 'size:13', 'regex:'.self::RFC_REGEX, Rule::unique('tb_doctor', 'uk_rfc_personal')->ignore($doctor, 'pk_fk_usuario')],
            'sede_nombre' => ['nullable', 'string', 'max:150'],
            'especialidades' => ['array'],
            'especialidades.*' => ['integer', 'exists:tb_especialidad,id_especialidad'],
            'cedula_documento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'rfc_documento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $consultorioId = DB::transaction(function () use ($data, $doctor): int {
            $personalId = DB::table('tb_usuario')->where('id_usuario', $doctor)->value('fk_personal_usuario');
            $catalogs = $this->resolveDoctorCatalogs($data);

            DB::table('tb_personal')->where('id_personal', $personalId)->update([
                'fk_sede_personal' => $catalogs['sedeId'],
                'fecha_modificacion' => now(),
            ]);

            DB::table('tb_doctor')->where('pk_fk_usuario', $doctor)->update([
                'uk_rfc_personal' => $data['uk_rfc_personal'],
                'fk_asentamiento_doctor' => $catalogs['asentamientoId'],
            ]);

            DB::table('tb_especialidad_doctor')->where('fk_doctor', $doctor)->delete();

            foreach ($data['especialidades'] ?? [] as $especialidadId) {
                DB::table('tb_especialidad_doctor')->insert([
                    'fk_doctor' => $doctor,
                    'fk_especialidad' => $especialidadId,
                ]);
            }

            return $this->assignDoctorConsultorio($doctor, $catalogs['sedeId']);
        });

        $savedDocuments = $this->saveDoctorDocuments($request, $doctor);

        $this->recordAudit(
            $request,
            $doctor,
            'MODIFICACION',
            'tb_doctor',
            "Se actualizó el perfil de doctor con usuario {$doctor}.",
        );

        $this->recordAudit(
            $request,
            $doctor,
            'MODIFICACION',
            'tb_doctor_consultorio',
            "Se confirmó la asignación del consultorio {$consultorioId} para el doctor {$doctor}.",
        );

        if ($savedDocuments) {
            $this->recordAudit(
                $request,
                $doctor,
                'MODIFICACION',
                'tb_documento_doctor',
                'Se reemplazaron documentos del doctor: '.implode(', ', $savedDocuments).'.',
            );
        }

        return response()->json(['pk_fk_usuario' => $doctor]);
    }

    public function inactivar(Request $request, int $doctor): JsonResponse
    {
        $personalId = DB::table('tb_usuario')->where('id_usuario', $doctor)->value('fk_personal_usuario');

        if (!$personalId) {
            return response()->json(['message' => 'Doctor no encontrado.'], 404);
        }

        $data = $request->validate([
            'motivo_inactivacion' => ['required', 'string', 'max:120'],
            'detalles_inactivacion' => ['nullable', 'string', 'max:500'],
            'confirmacion_inactivacion' => ['accepted'],
        ]);

        $estadoEmpleadoId = $this->firstOrCreateByColumn('tb_estado_empleado', 'id_estado_empleado', 'ukTipo_estado', 'Inactivo', [
            'vv_descripcion' => 'Personal inactivo',
        ]);

        DB::table('tb_doctor')->where('pk_fk_usuario', $doctor)->update([
            'fk_estado_empleado_doctor' => $estadoEmpleadoId,
        ]);

        DB::table('tb_personal')->where('id_personal', $personalId)->update([
            'estatus' => 'Inactivo',
            'fecha_modificacion' => now(),
        ]);

        $this->recordAudit(
            $request,
            $doctor,
            'BAJA',
            'tb_doctor',
            "Se inactivó el perfil de doctor con usuario {$doctor}. Motivo: {$data['motivo_inactivacion']}."
                .(!empty($data['detalles_inactivacion']) ? " Detalles: {$data['detalles_inactivacion']}." : ''),
        );

        return response()->json(['pk_fk_usuario' => $doctor, 'estatus' => 'Inactivo']);
    }

    public function reactivar(Request $request, int $doctor): JsonResponse
    {
        $personalId = DB::table('tb_usuario')->where('id_usuario', $doctor)->value('fk_personal_usuario');

        if (!$personalId) {
            return response()->json(['message' => 'Doctor no encontrado.'], 404);
        }

        $data = $request->validate([
            'motivo_activacion' => ['required', 'string', 'max:120'],
            'detalles_activacion' => ['nullable', 'string', 'max:500'],
            'confirmacion_activacion' => ['accepted'],
        ]);

        $estadoEmpleadoId = $this->firstOrCreateByColumn('tb_estado_empleado', 'id_estado_empleado', 'ukTipo_estado', 'Activo', [
            'vv_descripcion' => 'Personal activo',
        ]);

        DB::table('tb_doctor')->where('pk_fk_usuario', $doctor)->update([
            'fk_estado_empleado_doctor' => $estadoEmpleadoId,
        ]);

        DB::table('tb_personal')->where('id_personal', $personalId)->update([
            'estatus' => 'Activo',
            'fecha_modificacion' => now(),
        ]);

        $this->recordAudit(
            $request,
            $doctor,
            'REACTIVACION',
            'tb_doctor',
            "Se reactivó el perfil de doctor con usuario {$doctor}. Motivo: {$data['motivo_activacion']}."
                .(!empty($data['detalles_activacion']) ? " Detalles: {$data['detalles_activacion']}." : ''),
        );

        return response()->json(['pk_fk_usuario' => $doctor, 'estatus' => 'Activo']);
    }

    public function eliminarDocumento(Request $request, int $doctor, string $documento): JsonResponse
    {
        $documentTypes = [
            'cedula_documento' => 'Cedula profesional',
            'rfc_documento' => 'RFC',
        ];
        $documentType = $documentTypes[$documento] ?? null;

        if (!$documentType) {
            return response()->json(['message' => 'Tipo de documento no válido.'], 422);
        }

        $record = DB::table('tb_documento_doctor')
            ->where('fk_doctor', $doctor)
            ->where('tipo_documento', $documentType)
            ->where('estatus', 'Activo')
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Documento no encontrado.'], 404);
        }

        DB::table('tb_documento_doctor')
            ->where('id_documento_doctor', $record->id_documento_doctor)
            ->update([
                'estatus' => 'Inactivo',
                'fecha_carga' => now(),
            ]);

        $this->recordAudit(
            $request,
            $doctor,
            'BAJA',
            'tb_documento_doctor',
            "Se inactivó el documento {$documentType} del doctor {$doctor}.",
        );

        return response()->json(['message' => 'Documento eliminado.']);
    }

    private function saveDoctorDocuments(Request $request, int $doctorId): array
    {
        $documents = [
            'cedula_documento' => 'Cedula profesional',
            'rfc_documento' => 'RFC',
        ];
        $savedDocuments = [];

        foreach ($documents as $field => $type) {
            if (!$request->hasFile($field)) {
                continue;
            }

            $file = $request->file($field);

            if (!$file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store("doctores/{$doctorId}", 'public');
            $previousPath = DB::table('tb_documento_doctor')
                ->where('fk_doctor', $doctorId)
                ->where('tipo_documento', $type)
                ->value('ruta_archivo');

            DB::table('tb_documento_doctor')->updateOrInsert(
                [
                    'fk_doctor' => $doctorId,
                    'tipo_documento' => $type,
                ],
                [
                    'nombre_documento' => $file->getClientOriginalName(),
                    'extension_archivo' => strtolower($file->getClientOriginalExtension()),
                    'ruta_archivo' => $path,
                    'tamano_archivo' => round($file->getSize() / 1024, 2),
                    'fecha_carga' => now(),
                    'estatus' => 'Activo',
                ],
            );

            if ($previousPath && $previousPath !== $path) {
                Storage::disk('public')->delete($previousPath);
            }

            $savedDocuments[] = $type;
        }

        return $savedDocuments;
    }

    private function assignDoctorConsultorio(int $doctorId, int $sedeId): int
    {
        $assignedConsultorio = DB::table('tb_doctor_consultorio as doctor_consultorio')
            ->join('tb_consultorio as consultorio', 'consultorio.id_consultorio', '=', 'doctor_consultorio.fk_consultorio')
            ->where('doctor_consultorio.fk_doctor', $doctorId)
            ->where('consultorio.fk_sede_consultorio', $sedeId)
            ->value('doctor_consultorio.fk_consultorio');

        if ($assignedConsultorio) {
            return (int) $assignedConsultorio;
        }

        $availableConsultorio = DB::table('tb_consultorio as consultorio')
            ->leftJoin('tb_doctor_consultorio as doctor_consultorio', 'doctor_consultorio.fk_consultorio', '=', 'consultorio.id_consultorio')
            ->where('consultorio.fk_sede_consultorio', $sedeId)
            ->where('consultorio.estatus', 'Activo')
            ->whereNull('doctor_consultorio.id_asignacion')
            ->orderBy('consultorio.id_consultorio')
            ->value('consultorio.id_consultorio');

        $consultorioId = $availableConsultorio ? (int) $availableConsultorio : $this->createConsultorioForSede($sedeId);

        DB::table('tb_doctor_consultorio')->insert([
            'fk_doctor' => $doctorId,
            'fk_cita' => null,
            'fk_consultorio' => $consultorioId,
            'dia_semana' => 'Lunes a viernes',
            'hora_inicio' => '08:00:00',
            'hora_fin' => '16:00:00',
        ]);

        return $consultorioId;
    }

    private function createConsultorioForSede(int $sedeId): int
    {
        $nextNumber = DB::table('tb_consultorio')
            ->where('fk_sede_consultorio', $sedeId)
            ->count() + 1;

        return (int) DB::table('tb_consultorio')->insertGetId([
            'fk_sede_consultorio' => $sedeId,
            'observaciones' => 'Consultorio generado para asignación médica sin cita obligatoria.',
            'piso' => '1',
            'estatus' => 'Activo',
            'nombre_consultorio' => "Consultorio {$nextNumber}",
            'numero_consultorio' => str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT),
            'fecha_crecion' => now(),
        ], 'id_consultorio');
    }

    private function recordAudit(
        Request $request,
        int $fallbackActorUserId,
        string $operation,
        string $table,
        string $description,
    ): void {
        $actorUserId = (int) ($request->user()?->getAuthIdentifier() ?? $fallbackActorUserId);

        DB::table('tb_bitacora_auditoria')->insert([
            'fk_usuario_auditoria' => $actorUserId,
            'modulo_afectado' => 'Doctores',
            'operacion_accion' => $operation,
            'fecha_registro' => now(),
            'fecha_edicion' => now(),
            'tabla_afectada' => $table,
            'descripcion' => $description,
            'direccion_ip' => $request->ip(),
        ]);
    }
}
