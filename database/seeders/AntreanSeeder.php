<?php

namespace Database\Seeders;

use App\Models\Antrean;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AntreanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warga = User::whereHas('peran', function($q) {
            $q->where('peran', 'warga');
        })->get();

        $today = Carbon::today();
        $layanan = ['Surat Domisili', 'Surat Keterangan Usaha', 'Pelayanan KK/KTP', 'Konsultasi Layanan'];

        // Antrean Selesai
        for ($i = 1; $i <= 8; $i++) {
            Antrean::create([
                'user_id' => $warga->random()->id,
                'nomor_antrean' => 'A-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'jenis_layanan' => $layanan[array_rand($layanan)],
                'status' => 'selesai',
                'tanggal' => $today,
                'created_at' => $today->copy()->setHour(8)->addMinutes($i * 15),
            ]);
        }

        // Antrean Sedang Dipanggil
        Antrean::create([
            'user_id' => $warga->random()->id,
            'nomor_antrean' => 'A-009',
            'jenis_layanan' => $layanan[array_rand($layanan)],
            'status' => 'dipanggil',
            'tanggal' => $today,
            'created_at' => $today->copy()->setHour(10)->addMinutes(15),
        ]);

        // Antrean Menunggu
        for ($i = 10; $i <= 15; $i++) {
            Antrean::create([
                'user_id' => $warga->random()->id,
                'nomor_antrean' => 'A-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'jenis_layanan' => $layanan[array_rand($layanan)],
                'status' => 'menunggu',
                'tanggal' => $today,
                'created_at' => $today->copy()->setHour(10)->addMinutes($i * 5),
            ]);
        }

        $this->command->info('✅ 15 Antrean dummy seeded successfully!');
    }
}
