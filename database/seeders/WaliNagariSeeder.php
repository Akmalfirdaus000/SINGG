<?php

namespace Database\Seeders;

use App\Models\PeranPengguna;
use App\Models\ProfilPengguna;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class WaliNagariSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Wali Nagari User
        $user = User::updateOrCreate(
            ['email' => 'walinagari@nagari.id'],
            [
                'nik' => '9999999999999999',
                'phone' => '081299999999',
                'password_hash' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Create Profile
        ProfilPengguna::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nama_lengkap' => 'Dt. Wali Nagari',
                'tempat_lahir' => 'Nagari Sample',
                'tanggal_lahir' => '1975-08-17',
                'jenis_kelamin' => 'Laki-laki',
                'pekerjaan' => 'Wali Nagari',
                'alamat' => 'Nagari Tinggi, No. 1',
                'provinsi' => 'Sumatera Barat',
                'kota' => 'Solok',
                'kecamatan' => 'Gunung Talang',
                'desa' => 'Nagari Sample',
                'kode_pos' => '25123',
            ]
        );

        // Assign Wali Nagari Role
        PeranPengguna::updateOrCreate(
            ['user_id' => $user->id, 'peran' => 'wali_nagari'],
            [
                'is_active' => true,
                'catatan' => 'Kepala Pemerintahan Nagari',
                'assigned_at' => now(),
            ]
        );

        $this->command->info('✅ Wali Nagari user seeded successfully!');
        $this->command->info('   Email: walinagari@nagari.id / password');
    }
}
