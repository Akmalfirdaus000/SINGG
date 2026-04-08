<?php

namespace Database\Seeders;

use App\Models\PeranPengguna;
use App\Models\ProfilPengguna;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $admin = User::create([
            'email' => 'admin@nagari.id',
            'nik' => '1234567890123456',
            'phone' => '081234567890',
            'password_hash' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Admin Profile
        ProfilPengguna::create([
            'user_id' => $admin->id,
            'nama_lengkap' => 'Administrator Nagari',
            'tempat_lahir' => 'Padang',
            'tanggal_lahir' => '1990-01-01',
            'jenis_kelamin' => 'Laki-laki',
            'pekerjaan' => 'Pegawai Nagari',
            'alamat' => 'Kantor Nagari, Jl. Utama No. 1',
            'provinsi' => 'Sumatera Barat',
            'kota' => 'Padang',
            'kecamatan' => 'Padang Barat',
            'desa' => 'Nagari Sample',
            'kode_pos' => '25123',
        ]);

        // Assign Admin Role
        PeranPengguna::create([
            'user_id' => $admin->id,
            'peran' => 'admin',
            'is_active' => true,
            'catatan' => 'Super Admin',
        ]);

        // Create Regular User (Warga)
        $warga = User::create([
            'email' => 'warga@example.com',
            'nik' => '1234567890123457',
            'phone' => '081234567891',
            'password_hash' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Warga Profile
        ProfilPengguna::create([
            'user_id' => $warga->id,
            'nama_lengkap' => 'Budi Santoso',
            'tempat_lahir' => 'Padang',
            'tanggal_lahir' => '1985-05-15',
            'jenis_kelamin' => 'Laki-laki',
            'pekerjaan' => 'Wiraswasta',
            'alamat' => 'Jl. Merdeka No. 45, RT 01 RW 02',
            'provinsi' => 'Sumatera Barat',
            'kota' => 'Padang',
            'kecamatan' => 'Padang Timur',
            'desa' => 'Nagari Sample',
            'kode_pos' => '25124',
        ]);

        // Assign Warga Role
        PeranPengguna::create([
            'user_id' => $warga->id,
            'peran' => 'warga',
            'is_active' => true,
        ]);

        $this->command->info('✅ Users seeded successfully!');
        $this->command->info('   Admin: admin@nagari.id / password');
        $this->command->info('   Warga: warga@example.com / password');
    }
}
