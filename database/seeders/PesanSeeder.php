<?php

namespace Database\Seeders;

use App\Models\Percakapan;
use App\Models\Pesan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PesanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::whereHas('peran', function($q) {
            $q->where('peran', 'admin');
        })->first();

        $wargaUsers = User::whereHas('peran', function($q) {
            $q->where('peran', 'warga');
        })->limit(5)->get();

        if (!$admin || $wargaUsers->isEmpty()) {
            $this->command->error('❌ Admin or Warga users not found.');
            return;
        }

        foreach ($wargaUsers as $idx => $warga) {
            $percakapan = Percakapan::create([
                'user_id_1' => $admin->id,
                'user_id_2' => $warga->id,
                'status' => 'active',
                'last_message_at' => now()->subHours(5 - $idx),
            ]);

            // Pesan dari warga
            Pesan::create([
                'percakapan_id' => $percakapan->id,
                'pengirim_id' => $warga->id,
                'penerima_id' => $admin->id,
                'isi' => "Halo Admin, saya ingin bertanya tentang cara mengajukan surat domisili.",
                'status_pesan' => 'terkirim',
                'created_at' => now()->subHours(5 - $idx)->subMinutes(30),
            ]);

            // Balasan dari admin
            Pesan::create([
                'percakapan_id' => $percakapan->id,
                'pengirim_id' => $admin->id,
                'penerima_id' => $warga->id,
                'isi' => "Halo! Tentu, Anda bisa masuk ke menu Layanan Administrasi dan pilih Surat Domisili.",
                'status_pesan' => 'terkirim',
                'created_at' => now()->subHours(5 - $idx)->subMinutes(20),
            ]);

            // Pesan penutup dari warga (belum dibaca)
            Pesan::create([
                'percakapan_id' => $percakapan->id,
                'pengirim_id' => $warga->id,
                'penerima_id' => $admin->id,
                'isi' => "Baik, terima kasih Admin. Saya akan coba sekarang.",
                'status_pesan' => 'terkirim',
                'is_dibaca' => false,
                'created_at' => now()->subHours(5 - $idx)->subMinutes(10),
            ]);
        }

        $this->command->info('✅ 5 Percakapan dummy seeded successfully!');
    }
}
