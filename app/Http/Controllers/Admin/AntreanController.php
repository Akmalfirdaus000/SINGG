<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Antrean;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AntreanController extends Controller
{
    /**
     * Dashboard antrean hari ini
     */
    public function index()
    {
        $today = Carbon::today();
        
        $antrean = Antrean::whereDate('tanggal', $today)
            ->with('user.profil')
            ->orderBy('created_at')
            ->get();

        $statistik = [
            'total' => $antrean->count(),
            'menunggu' => $antrean->where('status', 'menunggu')->count(),
            'dipanggil' => $antrean->where('status', 'dipanggil')->count(),
            'selesai' => $antrean->where('status', 'selesai')->count(),
            'current' => $antrean->where('status', 'dipanggil')->last()?->nomor_antrean ?? '-',
        ];

        return Inertia::render('admin/antrean/index/index', [
            'antrean' => $antrean,
            'statistik' => $statistik,
        ]);
    }

    /**
     * Panggil antrean berikutnya
     */
    public function next(Request $request)
    {
        $today = Carbon::today();
        
        // Selesaikan antrean yang sedang dipanggil (jika ada)
        Antrean::whereDate('tanggal', $today)
            ->where('status', 'dipanggil')
            ->update(['status' => 'selesai']);

        // Ambil antrean berikutnya yang berstatus menunggu
        $next = Antrean::whereDate('tanggal', $today)
            ->where('status', 'menunggu')
            ->orderBy('created_at')
            ->first();

        if ($next) {
            $next->update(['status' => 'dipanggil']);
            return back()->with('success', 'Memanggil nomor ' . $next->nomor_antrean);
        }

        return back()->with('info', 'Tidak ada antrean tersisa.');
    }

    /**
     * Update status antrean spesifik
     */
    public function update(Request $request, $id)
    {
        $antrean = Antrean::findOrFail($id);
        $antrean->update(['status' => $request->status]);

        return back()->with('success', 'Status antrean diperbarui.');
    }

    /**
     * Reset antrean hari ini (untuk testing/emergency)
     */
    public function reset()
    {
        Antrean::whereDate('tanggal', Carbon::today())->delete();
        return back()->with('success', 'Antrean hari ini dikosongkan.');
    }
}
