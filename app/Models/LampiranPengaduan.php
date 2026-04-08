<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LampiranPengaduan extends Model
{
    use HasUuids;

    protected $table = 'lampiran_pengaduan';
    public const UPDATED_AT = null;

    protected $fillable = [
        'pengaduan_id',
        'nama_file',
        'url_file',
        'tipe_file',
        'ukuran_file',
        'diunggah_oleh',
        'is_utama',
    ];

    protected $casts = [
        'is_utama' => 'boolean',
        'ukuran_file' => 'integer',
    ];

    public function pengaduan(): BelongsTo
    {
        return $this->belongsTo(Pengaduan::class, 'pengaduan_id');
    }

    public function diunggahOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diunggah_oleh');
    }
}
