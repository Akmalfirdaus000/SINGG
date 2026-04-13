<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\LampiranDokumen;
use App\Models\RiwayatDokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * Menu 1: Ajukan Permohonan (Katalog Layanan)
     */
    public function index(Request $request)
    {
        $query = JenisDokumen::where('is_active', true)->orderBy('urutan');

        if ($request->has('search')) {
            $query->where('nama_tampilan', 'like', "%{$request->search}%");
        }

        $services = $query->get();

        return Inertia::render('warga/layanan/index', [
            'services' => $services,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menu 2: Lacak Permohonan (Permohonan Aktif)
     */
    public function lacak(Request $request)
    {
        $user = $request->user();
        $query = Dokumen::with(['jenisDokumen'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan'])
            ->latest();

        $documents = $query->paginate(10)->withQueryString();

        return Inertia::render('warga/layanan/status', [
            'documents' => $documents,
        ]);
    }

    /**
     * Menu 3: Riwayat Dokumen (Permohonan Selesai/Ditolak)
     */
    public function riwayat(Request $request)
    {
        $user = $request->user();
        $query = Dokumen::with(['jenisDokumen'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['disetujui', 'ditolak', 'selesai', 'kedaluwarsa'])
            ->latest();

        $documents = $query->paginate(10)->withQueryString();

        return Inertia::render('warga/layanan/riwayat', [
            'documents' => $documents,
        ]);
    }

    /**
     * Halaman Form Pengajuan Dokumen
     */
    public function create($jenis_id)
    {
        $jenis = JenisDokumen::findOrFail($jenis_id);
        $user = Auth::user()->load('profil');

        return Inertia::render('warga/layanan/create', [
            'jenis' => $jenis,
            'user_profile' => $user->profil,
        ]);
    }

    /**
     * Simpan Pengajuan Baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis_id' => 'required|exists:jenis_dokumen,id',
            'nama_pemohon' => 'required|string|max:255',
            'nik_pemohon' => 'required|string|max:16',
            'alamat_pemohon' => 'required|string',
            'telepon_pemohon' => 'nullable|string|max:20',
            'data_form' => 'nullable|array',
            'lampiran.*' => 'nullable|file|max:5120', // Max 5MB per file
        ]);

        $user = Auth::user();
        $jenis = JenisDokumen::findOrFail($request->jenis_id);

        try {
            DB::beginTransaction();

            // Generate Nomor Dokumen
            $datePart = now()->format('Ymd');
            $countToday = Dokumen::whereDate('created_at', now()->toDateString())->count() + 1;
            $prefix = strtoupper(substr($jenis->nama, 0, 3));
            $nomor = $prefix . '-' . $datePart . '-' . str_pad($countToday, 4, '0', STR_PAD_LEFT);

            // Create Dokumen
            $dokumen = Dokumen::create([
                'nomor_dokumen' => $nomor,
                'user_id' => $user->id,
                'jenis_dokumen_id' => $jenis->id,
                'status' => 'menunggu_verifikasi',
                'nama_pemohon' => $request->nama_pemohon,
                'nik_pemohon' => $request->nik_pemohon,
                'alamat_pemohon' => $request->alamat_pemohon,
                'telepon_pemohon' => $request->telepon_pemohon,
                'data_form' => $request->data_form,
                'hari_proses' => $jenis->hari_proses,
                'perkiraan_tanggal_selesai' => now()->addDays($jenis->hari_proses),
            ]);

            // Handle Lampiran
            if ($request->hasFile('lampiran')) {
                foreach ($request->file('lampiran') as $key => $file) {
                    $path = $file->store('dokumen_lampiran', 'public');
                    
                    LampiranDokumen::create([
                        'dokumen_id' => $dokumen->id,
                        'nama_file' => $file->getClientOriginalName(),
                        'url_file' => '/storage/' . $path,
                        'tipe_file' => $file->getMimeType(),
                        'ukuran_file' => $file->getSize(),
                        'nama_persyaratan' => $key, // Nama persyaratan dari input key
                        'diunggah_oleh' => $user->id,
                    ]);
                }
            }

            // Create Initial History
            RiwayatDokumen::create([
                'dokumen_id' => $dokumen->id,
                'user_id' => $user->id,
                'status_lama' => 'draft',
                'status_baru' => 'menunggu_verifikasi',
                'catatan' => 'Permohonan diajukan oleh warga.',
            ]);

            DB::commit();

            return redirect()->route('warga.layanan.lacak')->with('success', 'Permohonan Anda berhasil diajukan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengajukan permohonan. ' . $e->getMessage()]);
        }
    }

    /**
     * Tampilkan detail permohonan
     */
    public function show($id)
    {
        $user = Auth::user();
        $dokumen = Dokumen::with(['jenisDokumen', 'lampiran', 'riwayat.user.profil'])
            ->where('user_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('warga/layanan/show', [
            'dokumen' => $dokumen
        ]);
    }
}
