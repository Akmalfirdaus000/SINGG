<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Percakapan extends Model
{
    use HasUuids;

    protected $table = 'percakapan';

    protected $fillable = [
        'user_id_1',
        'user_id_2',
        'status',
        'context_type',
        'context_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_1');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_2');
    }

    public function pesan(): HasMany
    {
        return $this->hasMany(Pesan::class, 'percakapan_id');
    }

    /**
     * Get the other user in the conversation.
     */
    public function penggunaLain(int $currentUserId): User
    {
        return $this->user_id_1 === $currentUserId ? $this->user2 : $this->user1;
    }
}
