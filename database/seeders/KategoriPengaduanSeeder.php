<?php

namespace Database\Seeders;

use App\Models\KategoriPengaduan;
use Illuminate\Database\Seeder;

class KategoriPengaduanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            [
                'nama' => 'infrastruktur',
                'nama_tampilan' => 'Infrastruktur',
                'deskripsi' => 'Laporan kerusakan jalan, jembatan, drainase, dan infrastruktur lainnya',
                'is_active' => true,
            ],
            [
                'nama' => 'kebersihan',
                'nama_tampilan' => 'Kebersihan',
                'deskripsi' => 'Laporan sampah menumpuk, kebersihan lingkungan, dan persampahan',
                'is_active' => true,
            ],
            [
                'nama' => 'keamanan',
                'nama_tampilan' => 'Keamanan',
                'deskripsi' => 'Laporan keamanan lingkungan, kenakalan remaja, dan gangguan ketertiban',
                'is_active' => true,
            ],
            [
                'nama' => 'kesehatan',
                'nama_tampilan' => 'Kesehatan',
                'deskripsi' => 'Laporan pelayanan kesehatan, puskesmas, dan fasilitas kesehatan',
                'is_active' => true,
            ],
            [
                'nama' => 'pendidikan',
                'nama_tampilan' => 'Pendidikan',
                'deskripsi' => 'Laporan fasilitas pendidikan, sekolah, dan pelayanan pendidikan',
                'is_active' => true,
            ],
            [
                'nama' => 'pelayanan_publik',
                'nama_tampilan' => 'Pelayanan Publik',
                'deskripsi' => 'Laporan pelayanan publik dan pelayanan masyarakat',
                'is_active' => true,
            ],
            [
                'nama' => 'administrasi',
                'nama_tampilan' => 'Administrasi',
                'deskripsi' => 'Laporan pelayanan administrasi dan surat-menyurat',
                'is_active' => true,
            ],
            [
                'nama' => 'lainnya',
                'nama_tampilan' => 'Lainnya',
                'deskripsi' => 'Laporan lainnya yang tidak termasuk dalam kategori di atas',
                'is_active' => true,
            ],
        ];

        foreach ($kategori as $kat) {
            KategoriPengaduan::create($kat);
        }

        $this->command->info('✅ Kategori Pengaduan seeded successfully!');
    }
}
