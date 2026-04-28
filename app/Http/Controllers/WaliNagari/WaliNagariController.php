<?php

namespace App\Http\Controllers\WaliNagari;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\Pengaduan;
use App\Models\User;
use App\Models\ProfilPengguna;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class WaliNagariController extends Controller
{
    /**
     * Dashboard Wali Nagari
     */
    public function dashboard()
    {
        $stats = [
            'total_warga' => User::whereHas('peran', function($q) { $q->where('peran', 'warga'); })->count(),
            'pengajuan_pending' => Dokumen::whereIn('status', ['menunggu_verifikasi', 'menunggu_ttd_wali_nagari'])->count(),
            'pengaduan_aktif' => Pengaduan::whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'dalam_proses'])->count(),
            'dokumen_selesai' => Dokumen::where('status', 'selesai')->count(),
            'total_pendapatan' => Dokumen::where('is_dibayar', true)->sum('jumlah_pembayaran'),
            'kepuasan_warga' => Pengaduan::whereNotNull('rating')->avg('rating') ?: 0,
        ];

        $demografi = [
            'laki_laki' => \App\Models\ProfilPengguna::where('jenis_kelamin', 'Laki-laki')->count(),
            'perempuan' => \App\Models\ProfilPengguna::where('jenis_kelamin', 'Perempuan')->count(),
        ];

        $service_trends = Dokumen::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->get();

        $latest_activities = [
            'pengaduan' => Pengaduan::with(['user.profil', 'kategori'])->latest()->take(5)->get(),
            'dokumen' => Dokumen::with(['user.profil', 'jenisDokumen'])->latest()->take(5)->get(),
        ];

        return Inertia::render('wali-nagari/dashboard/index', [
            'stats' => $stats,
            'demografi' => $demografi,
            'trends' => $service_trends,
            'latest' => $latest_activities
        ]);
    }

    /**
     * Data Masyarakat
     */
    public function warga(Request $request)
    {
        $query = User::with('profil')->whereHas('peran', function($q) {
            $q->where('peran', 'warga');
        });

        if ($request->search) {
            $query->whereHas('profil', function($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%");
            });
        }

        $warga = $query->paginate(10);

        return Inertia::render('wali-nagari/warga/index', [
            'warga' => $warga,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Laporan & Statistik
     */
    public function statistik()
    {
        $pengaduan_by_status = Pengaduan::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        $dokumen_by_type = Dokumen::join('jenis_dokumen', 'dokumen.jenis_dokumen_id', '=', 'jenis_dokumen.id')
            ->select('jenis_dokumen.nama_tampilan', DB::raw('count(*) as total'))
            ->groupBy('jenis_dokumen.nama_tampilan')
            ->get();

        return Inertia::render('wali-nagari/statistik/index', [
            'pengaduan_stats' => $pengaduan_by_status,
            'dokumen_stats' => $dokumen_by_type
        ]);
    }

    /**
     * Pengajuan Administrasi
     */
    public function layanan(Request $request)
    {
        $docs = Dokumen::with(['user.profil', 'jenisDokumen'])
            ->where('status', 'menunggu_ttd_wali_nagari')
            ->latest()
            ->paginate(10);

        return Inertia::render('wali-nagari/layanan/index', [
            'documents' => $docs
        ]);
    }

    /**
     * Detail Pengajuan Administrasi
     */
    public function detailLayanan($id)
    {
        $doc = Dokumen::with(['user.profil', 'jenisDokumen', 'riwayat.user.profil', 'lampiran'])->findOrFail($id);

        return Inertia::render('wali-nagari/layanan/show', [
            'document' => $doc
        ]);
    }

    /**
     * Pengaduan Masyarakat
     */
    public function pengaduan(Request $request)
    {
        $complaints = Pengaduan::with(['user.profil', 'kategori'])
            ->where('status', 'selesai')
            ->latest()
            ->paginate(10);

        return Inertia::render('wali-nagari/pengaduan/index', [
            'complaints' => $complaints
        ]);
    }

    /**
     * Detail Pengaduan Masyarakat
     */
    public function detailPengaduan($id)
    {
        $complaint = Pengaduan::with(['user.profil', 'kategori', 'lampiran'])->findOrFail($id);

        return Inertia::render('wali-nagari/pengaduan/show', [
            'complaint' => $complaint
        ]);
    }

    /**
     * Profil Nagari
     */
    public function profilNagari()
    {
        // ... (data nagari)
        $nagari = [
            'nama' => 'Nagari Tinggi',
            'kecamatan' => 'Gunung Talang',
            'kabupaten' => 'Solok',
            'provinsi' => 'Sumatera Barat',
            'visi' => 'Mewujudkan Nagari yang Sejahtera, Mandiri, dan Berbudaya.',
            'misi' => [
                'Meningkatkan pelayanan publik yang transparan.',
                'Memperkuat ekonomi kerakyatan berbasis potensi lokal.',
                'Menjaga kelestarian adat dan budaya Minangkabau.'
            ],
            'kepala_nagari' => 'Dt. Wali Nagari',
        ];

        return Inertia::render('wali-nagari/profil-nagari/index', [
            'nagari' => $nagari
        ]);
    }

    /**
     * Setujui Pengajuan Dokumen
     */
    public function approveLayanan(Request $request, $id)
    {
        $doc = Dokumen::findOrFail($id);
        $doc->update([
            'status' => 'disetujui',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'catatan_persetujuan' => $request->catatan ?? 'Disetujui oleh Wali Nagari.'
        ]);

        return back()->with('success', 'Pengajuan berhasil disetujui.');
    }

    /**
     * Tolak Pengajuan Dokumen
     */
    public function rejectLayanan(Request $request, $id)
    {
        $doc = Dokumen::findOrFail($id);
        $doc->update([
            'status' => 'ditolak',
            'rejected_by' => auth()->id(),
            'rejected_at' => now(),
            'alasan_penolakan' => $request->catatan ?? 'Ditolak oleh Wali Nagari.'
        ]);

        return back()->with('success', 'Pengajuan berhasil ditolak.');
    }

    /**
     * Preview surat (khusus Wali Nagari)
     */
    public function previewSurat($id)
    {
        $dokumen = Dokumen::with(['user.profil', 'jenisDokumen', 'approvedBy.profil'])->findOrFail($id);
        
        // Hanya bisa preview jika sudah disetujui (minimal)
        if (!in_array($dokumen->status, ['disetujui', 'selesai'])) {
            return response()->json(['message' => 'Surat belum disetujui untuk pratinjau.'], 403);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('surat.pengantar', compact('dokumen'));
        
        return $pdf->stream('preview_surat_' . $dokumen->nomor_dokumen . '.pdf');
    }
}
