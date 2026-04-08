<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateDokumen extends Model
{
    protected $table = 'template_dokumen';

    protected $fillable = [
        'jenis_dokumen_id',
        'nama',
        'isi_template',
        'variabel',
        'is_active',
        'versi',
    ];

    protected $casts = [
        'variabel' => 'array',
        'is_active' => 'boolean',
        'versi' => 'integer',
    ];

    public function jenisDokumen(): BelongsTo
    {
        return $this->belongsTo(JenisDokumen::class, 'jenis_dokumen_id');
    }
}
