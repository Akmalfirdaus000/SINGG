<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Pengaduan extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'pengaduan';

    protected $fillable = [
        'nomor_pengaduan',
        'user_id',
        'kategori_id',
        'judul',
        'deskripsi',
        'status',
        'prioritas',
        'alamat_lokasi',
        'kecamatan_lokasi',
        'desa_lokasi',
        'latitude',
        'longitude',
        'assigned_to',
        'assigned_at',
        'batas_waktu',
        'pelanggaran_sla',
        'pelanggaran_sla_diberitahu',
        'catatan_penyelesaian',
        'resolved_at',
        'resolved_by',
        'jumlah_dilihat',
        'is_anonim',
        'is_publik',
        'komentar',
        'rating',
        'ulasan',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'batas_waktu' => 'datetime',
        'resolved_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'pelanggaran_sla' => 'boolean',
        'pelanggaran_sla_diberitahu' => 'boolean',
        'is_anonim' => 'boolean',
        'is_publik' => 'boolean',
        'komentar' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriPengaduan::class, 'kategori_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function lampiran(): HasMany
    {
        return $this->hasMany(LampiranPengaduan::class, 'pengaduan_id');
    }

    public function riwayat(): HasMany
    {
        return $this->hasMany(RiwayatPengaduan::class, 'pengaduan_id');
    }
}
