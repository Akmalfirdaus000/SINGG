<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RiwayatPengaduan extends Model
{
    use HasUuids;

    protected $table = 'riwayat_pengaduan';
    public const UPDATED_AT = null;

    protected $fillable = [
        'pengaduan_id',
        'user_id',
        'status_lama',
        'status_baru',
        'catatan',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function pengaduan(): BelongsTo
    {
        return $this->belongsTo(Pengaduan::class, 'pengaduan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
