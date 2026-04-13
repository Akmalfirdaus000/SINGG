<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\KategoriPengaduan;
use App\Models\LampiranPengaduan;
use App\Models\Pengaduan;
use App\Models\RiwayatPengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PengaduanController extends Controller
{
    /**
     * Tampilkan daftar pengaduan milik user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Pengaduan::with(['kategori'])
            ->where('user_id', $user->id)
            ->latest();

        if ($request->has('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $pengaduans = $query->paginate(10)->withQueryString();

        return Inertia::render('warga/pengaduan/index', [
            'pengaduans' => $pengaduans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Halaman buat pengaduan baru
     */
    public function create()
    {
        $categories = KategoriPengaduan::where('is_active', true)->get();

        return Inertia::render('warga/pengaduan/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Simpan pengaduan baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori_pengaduan,id',
            'deskripsi' => 'required|string',
            'alamat_lokasi' => 'nullable|string',
            'is_anonim' => 'required|boolean',
            'is_publik' => 'required|boolean',
            'lampiran.*' => 'nullable|image|max:5120', // Max 5MB per image
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            // Generate Nomor Pengaduan
            $datePart = now()->format('Ymd');
            $countToday = Pengaduan::whereDate('created_at', now()->toDateString())->count() + 1;
            $nomor = 'PGD-' . $datePart . '-' . str_pad($countToday, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(4));

            // Create Pengaduan
            $pengaduan = Pengaduan::create([
                'nomor_pengaduan' => $nomor,
                'user_id' => $user->id,
                'kategori_id' => $request->kategori_id,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'status' => 'menunggu_verifikasi',
                'prioritas' => 'sedang',
                'alamat_lokasi' => $request->alamat_lokasi,
                'is_anonim' => $request->is_anonim,
                'is_publik' => $request->is_publik,
            ]);

            // Handle Lampiran
            if ($request->hasFile('lampiran')) {
                foreach ($request->file('lampiran') as $file) {
                    $path = $file->store('pengaduan', 'public');
                    
                    LampiranPengaduan::create([
                        'pengaduan_id' => $pengaduan->id,
                        'nama_file' => $file->getClientOriginalName(),
                        'url_file' => '/storage/' . $path,
                        'tipe_file' => $file->getMimeType(),
                        'ukuran_file' => $file->getSize(),
                        'diunggah_oleh' => $user->id,
                    ]);
                }
            }

            // Create Initial History
            RiwayatPengaduan::create([
                'pengaduan_id' => $pengaduan->id,
                'user_id' => $user->id,
                'status_lama' => 'draft',
                'status_baru' => 'menunggu_verifikasi',
                'catatan' => 'Laporan diajukan oleh warga.',
            ]);

            DB::commit();

            return redirect()->route('warga.pengaduan.index')->with('success', 'Laporan pengaduan Anda berhasil dikirim.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengirim pengaduan. Silakan coba lagi. ' . $e->getMessage()]);
        }
    }

    /**
     * Tampilkan detail pengaduan
     */
    public function show($id)
    {
        $user = Auth::user();
        $pengaduan = Pengaduan::with(['kategori', 'lampiran', 'riwayat.user.profil'])
            ->where('user_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('warga/pengaduan/show', [
            'pengaduan' => $pengaduan
        ]);
    }
}
