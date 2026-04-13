<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Pesan extends Model
{
    use HasUuids;

    protected $table = 'pesan';
    public const UPDATED_AT = null;

    protected $fillable = [
        'percakapan_id',
        'pengirim_id',
        'penerima_id',
        'isi',
        'status_pesan',
        'url_lampiran',
        'tipe_lampiran',
        'balas_ke_id',
        'is_dibaca',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'is_dibaca' => 'boolean',
    ];

    public function percakapan(): BelongsTo
    {
        return $this->belongsTo(Percakapan::class, 'percakapan_id');
    }

    public function pengirim(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }

    public function penerima(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }

    public function balasKe(): BelongsTo
    {
        return $this->belongsTo(Pesan::class, 'balas_ke_id');
    }
}
