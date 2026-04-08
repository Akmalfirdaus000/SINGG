<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisDokumen extends Model
{
    use HasUuid;

    protected $table = 'jenis_dokumen';

    protected $fillable = [
        'nama',
        'nama_tampilan',
        'deskripsi',
        'persyaratan',
        'biaya',
        'hari_proses',
        'is_active',
        'memerlukan_verifikasi',
        'urutan',
    ];

    protected $casts = [
        'persyaratan' => 'array',
        'biaya' => 'decimal:2',
        'is_active' => 'boolean',
        'memerlukan_verifikasi' => 'boolean',
    ];

    public function template(): HasMany
    {
        return $this->hasMany(TemplateDokumen::class, 'jenis_dokumen_id');
    }

    public function dokumen(): HasMany
    {
        return $this->hasMany(Dokumen::class, 'jenis_dokumen_id');
    }
}
