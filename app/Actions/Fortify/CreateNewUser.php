<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\ProfilPengguna;
use App\Models\PeranPengguna;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'email' => $input['email'],
            'nik' => $input['nik'],
            'phone' => $input['phone'],
            'password_hash' => Hash::make($input['password']),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create user profile
        ProfilPengguna::create([
            'user_id' => $user->id,
            'nama_lengkap' => $input['nama_lengkap'],
            'tempat_lahir' => $input['tempat_lahir'] ?? null,
            'tanggal_lahir' => $input['tanggal_lahir'] ?? null,
            'jenis_kelamin' => $input['jenis_kelamin'] ?? null,
            'pekerjaan' => $input['pekerjaan'] ?? null,
            'alamat' => $input['alamat'] ?? null,
            'provinsi' => $input['provinsi'] ?? null,
            'kota' => $input['kota'] ?? null,
            'kecamatan' => $input['kecamatan'] ?? null,
            'desa' => $input['desa'] ?? null,
            'kode_pos' => $input['kode_pos'] ?? null,
        ]);

        // Assign warga role
        PeranPengguna::create([
            'user_id' => $user->id,
            'peran' => 'warga',
            'is_active' => true,
        ]);

        return $user;
    }
}
