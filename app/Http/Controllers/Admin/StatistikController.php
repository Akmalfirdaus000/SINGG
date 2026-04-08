<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatistikController extends Controller
{
    public function statistik()
    {
        // 1. Summary Stats
        $totalPelayanan = Dokumen::count();
        $pelayananSelesai = Dokumen::where('status', 'selesai')->count();
        $pelayananProses = Dokumen::whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui'])->count();
        
        $totalPengaduan = Pengaduan::count();
        $pengaduanSelesai = Pengaduan::where('status', 'selesai')->count();

        // 2. Trend Pelayanan (Last 6 Months)
        $trendPelayanan = Dokumen::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('count(*) as total')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(function ($item) {
            return [
                'name' => date('M Y', strtotime($item->month . '-01')),
                'total' => $item->total,
            ];
        });

        // 3. Distribusi Jenis Pelayanan (Pie Chart)
        $distribusiLayanan = JenisDokumen::withCount('dokumen')
            ->get()
            ->map(function ($jenis) {
                return [
                    'name' => $jenis->nama_tampilan ?: $jenis->nama,
                    'value' => $jenis->dokumen_count,
                ];
            })
            ->filter(fn($item) => $item['value'] > 0)
            ->values();

        // 4. Performa Berdasarkan Hari (Bar Chart)
        $performaHarian = Dokumen::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
            DB::raw('count(*) as total')
        )
        ->where('created_at', '>=', now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function ($item) {
            return [
                'name' => date('D', strtotime($item->date)),
                'total' => $item->total,
            ];
        });

        return Inertia::render('admin/statistik', [
            'summary' => [
                'pelayanan' => [
                    'total' => $totalPelayanan,
                    'selesai' => $pelayananSelesai,
                    'proses' => $pelayananProses,
                ],
                'pengaduan' => [
                    'total' => $totalPengaduan,
                    'selesai' => $pengaduanSelesai,
                ],
            ],
            'charts' => [
                'trend' => $trendPelayanan,
                'distribusi' => $distribusiLayanan,
                'performa' => $performaHarian,
            ]
        ]);
    }
}
