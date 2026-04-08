<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengumuman extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'pengumuman';

    protected $fillable = [
        'dibuat_oleh',
        'judul',
        'isi',
        'tipe',
        'target_peran',
        'is_penting',
        'is_semat',
        'published_at',
        'kadaluarsa_at',
        'jumlah_dilihat',
        'jumlah_dibaca',
        'url_lampiran',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'kadaluarsa_at' => 'datetime',
        'is_penting' => 'boolean',
        'is_semat' => 'boolean',
        'jumlah_dilihat' => 'integer',
        'jumlah_dibaca' => 'integer',
    ];

    public function dibuatOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function dibaca(): HasMany
    {
        return $this->hasMany(PengumumanDibaca::class, 'pengumuman_id');
    }
}
