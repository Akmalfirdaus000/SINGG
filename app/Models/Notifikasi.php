<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    protected $table = 'notifikasi';

    protected $fillable = [
        'user_id',
        'tipe',
        'saluran',
        'subject',
        'isi',
        'data',
        'status_email',
        'email_sent_at',
        'status_whatsapp',
        'whatsapp_sent_at',
        'status_sms',
        'sms_sent_at',
        'status_push',
        'push_sent_at',
        'is_dibaca',
        'read_at',
        'prioritas',
        'scheduled_at',
        'sent_at',
        'retry_count',
        'last_retry_at',
        'pesan_error',
    ];

    protected $casts = [
        'saluran' => 'array',
        'data' => 'array',
        'email_sent_at' => 'datetime',
        'whatsapp_sent_at' => 'datetime',
        'sms_sent_at' => 'datetime',
        'push_sent_at' => 'datetime',
        'read_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'last_retry_at' => 'datetime',
        'is_dibaca' => 'boolean',
        'prioritas' => 'integer',
        'retry_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
