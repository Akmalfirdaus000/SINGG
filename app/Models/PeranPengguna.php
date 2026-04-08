<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeranPengguna extends Model
{
    use HasUuid;

    protected $table = 'peran_pengguna';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'peran',
        'assigned_by',
        'assigned_at',
        'expires_at',
        'is_active',
        'catatan',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
