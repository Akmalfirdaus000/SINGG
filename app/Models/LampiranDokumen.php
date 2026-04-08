<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LampiranDokumen extends Model
{
    use HasUuids;

    protected $table = 'lampiran_dokumen';
    public const UPDATED_AT = null;

    protected $fillable = [
        'dokumen_id',
        'nama_file',
        'url_file',
        'tipe_file',
        'ukuran_file',
        'nama_persyaratan',
        'diunggah_oleh',
        'is_terverifikasi',
        'catatan_verifikasi',
    ];

    protected $casts = [
        'ukuran_file' => 'integer',
        'is_terverifikasi' => 'boolean',
    ];

    public function dokumen(): BelongsTo
    {
        return $this->belongsTo(Dokumen::class, 'dokumen_id');
    }

    public function diunggahOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diunggah_oleh');
    }
}
