<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Dokumen extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'dokumen';

    protected $fillable = [
        'nomor_dokumen',
        'user_id',
        'jenis_dokumen_id',
        'status',
        'nama_pemohon',
        'nik_pemohon',
        'alamat_pemohon',
        'telepon_pemohon',
        'data_form',
        'assigned_to',
        'assigned_at',
        'verified_by',
        'verified_at',
        'catatan_verifikasi',
        'approved_by',
        'approved_at',
        'catatan_persetujuan',
        'rejected_by',
        'rejected_at',
        'alasan_penolakan',
        'url_dokumen_dihasilkan',
        'generated_at',
        'hari_proses',
        'perkiraan_tanggal_selesai',
        'completed_at',
        'is_dibayar',
        'jumlah_pembayaran',
        'status_pembayaran',
        'tanggal_pembayaran',
        'is_dipercepat',
    ];

    protected $casts = [
        'data_form' => 'array',
        'assigned_at' => 'datetime',
        'verified_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'generated_at' => 'datetime',
        'perkiraan_tanggal_selesai' => 'datetime',
        'completed_at' => 'datetime',
        'tanggal_pembayaran' => 'datetime',
        'jumlah_pembayaran' => 'decimal:2',
        'is_dibayar' => 'boolean',
        'is_dipercepat' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jenisDokumen(): BelongsTo
    {
        return $this->belongsTo(JenisDokumen::class, 'jenis_dokumen_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function lampiran(): HasMany
    {
        return $this->hasMany(LampiranDokumen::class, 'dokumen_id');
    }

    public function persetujuan(): HasMany
    {
        return $this->hasMany(PersetujuanDokumen::class, 'dokumen_id');
    }

    public function riwayat(): HasMany
    {
        return $this->hasMany(RiwayatDokumen::class, 'dokumen_id');
    }
}
