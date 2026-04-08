<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RiwayatDokumen extends Model
{
    use HasUuids;

    protected $table = 'riwayat_dokumen';
    public const UPDATED_AT = null;

    protected $fillable = [
        'dokumen_id',
        'user_id',
        'status_lama',
        'status_baru',
        'catatan',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function dokumen(): BelongsTo
    {
        return $this->belongsTo(Dokumen::class, 'dokumen_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
