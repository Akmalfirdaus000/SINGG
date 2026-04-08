<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengumumanDibaca extends Model
{
    protected $table = 'pengumuman_dibaca';

    protected $fillable = [
        'pengumuman_id',
        'user_id',
        'dibaca_at',
    ];

    protected $casts = [
        'dibaca_at' => 'datetime',
    ];

    public function pengumuman(): BelongsTo
    {
        return $this->belongsTo(Pengumuman::class, 'pengumuman_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
