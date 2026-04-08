<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    /**
     * The primary key type.
     *
     * @var string
     */
    protected $keyType = 'uuid';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The boot method for model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'nik',
        'phone',
        'password_hash',
        'remember_token',
        'email_verified_at',
        'phone_verified_at',
        'last_login_at',
        'last_login_ip',
        'failed_login_attempts',
        'locked_until',
        'must_change_password',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password_hash',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'locked_until' => 'datetime',
            'password_hash' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the user's profile.
     */
    public function profil(): HasOne
    {
        return $this->hasOne(ProfilPengguna::class);
    }

    /**
     * Get the user's roles.
     */
    public function peran(): HasMany
    {
        return $this->hasMany(PeranPengguna::class);
    }

    /**
     * Get the user's complaints.
     */
    public function pengaduan(): HasMany
    {
        return $this->hasMany(Pengaduan::class);
    }

    /**
     * Get the user's documents.
     */
    public function dokumen(): HasMany
    {
        return $this->hasMany(Dokumen::class);
    }

    /**
     * Get the user's notifications.
     */
    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    /**
     * Get the user's announcements.
     */
    public function pengumuman(): HasMany
    {
        return $this->hasMany(Pengumuman::class, 'dibuat_oleh');
    }

    /**
     * Get conversations where user is user_id_1.
     */
    public function percakapanSebagaiUser1(): HasMany
    {
        return $this->hasMany(Percakapan::class, 'user_id_1');
    }

    /**
     * Get conversations where user is user_id_2.
     */
    public function percakapanSebagaiUser2(): HasMany
    {
        return $this->hasMany(Percakapan::class, 'user_id_2');
    }

    /**
     * Get all conversations for the user.
     */
    public function semuaPercakapan()
    {
        return Percakapan::where(function ($query) {
            $query->where('user_id_1', $this->id)
                ->orWhere('user_id_2', $this->id);
        });
    }

    /**
     * Get messages sent by the user.
     */
    public function pesanTerkirim(): HasMany
    {
        return $this->hasMany(Pesan::class, 'pengirim_id');
    }

    /**
     * Get messages received by the user.
     */
    public function pesanDiterima(): HasMany
    {
        return $this->hasMany(Pesan::class, 'penerima_id');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->peran()->where('peran', $role)->where('is_active', true)->exists();
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is warga.
     */
    public function isWarga(): bool
    {
        return $this->hasRole('warga');
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'id';
    }

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Get the column name for the "remember me" token.
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    /**
     * Get the name of the column that contains the password.
     */
    public function getAuthPasswordName()
    {
        return 'password_hash';
    }
}
