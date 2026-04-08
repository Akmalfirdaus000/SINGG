<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriPengaduan;
use App\Models\Pengaduan;
use App\Models\RiwayatPengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengaduanController extends Controller
{
    /**
     * Tampilkan daftar pengaduan (dengan filter)
     */
    public function index(Request $request)
    {
        $query = Pengaduan::with(['user.profil', 'kategori'])
            ->whereNotIn('status', ['selesai', 'ditolak'])
            ->latest();

        // 1. Filter Status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // 2. Filter Kategori
        if ($request->has('kategori') && $request->kategori !== '') {
            $query->where('kategori_id', $request->kategori);
        }

        // 3. Pencarian
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pengaduan', 'like', "%{$search}%")
                  ->orWhere('judul', 'like', "%{$search}%");
            });
        }

        $pengaduans = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/pengaduan/index/index', [
            'pengaduans' => $pengaduans,
            'kategori' => KategoriPengaduan::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'kategori', 'search']),
        ]);
    }

    /**
     * Tampilkan riwayat pengaduan (yang sudah selesai / ditolak)
     */
    public function riwayat(Request $request)
    {
        $query = Pengaduan::with(['user.profil', 'kategori'])
            ->whereIn('status', ['selesai', 'ditolak'])
            ->latest();

        // 1. Filter Status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // 2. Filter Kategori
        if ($request->has('kategori') && $request->kategori !== '') {
            $query->where('kategori_id', $request->kategori);
        }

        // 3. Pencarian
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pengaduan', 'like', "%{$search}%")
                  ->orWhere('judul', 'like', "%{$search}%");
            });
        }

        $pengaduans = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/pengaduan/riwayat/index', [
            'pengaduans' => $pengaduans,
            'kategori' => KategoriPengaduan::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'kategori', 'search']),
        ]);
    }

    /**
     * Tampilkan detail pengaduan
     */
    public function show($id)
    {
        $pengaduan = Pengaduan::with([
            'user.profil', 
            'kategori', 
            'lampiran', 
            'riwayat.user.profil'
        ])->findOrFail($id);

        return Inertia::render('admin/pengaduan/detail/index', [
            'pengaduan' => $pengaduan
        ]);
    }

    /**
     * Update status/progress pengaduan
     */
    public function update(Request $request, $id)
    {
        $pengaduan = Pengaduan::findOrFail($id);
        
        $request->validate([
            'status' => 'required|string',
            'catatan' => 'required|string',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $statusLama = $pengaduan->status;
        $statusBaru = $request->status;

        // Update pengaduan
        $pengaduan->update([
            'status' => $statusBaru,
            'progres' => $request->progress ?? $pengaduan->progres,
        ]);

        // Catat di Riwayat
        RiwayatPengaduan::create([
            'pengaduan_id' => $pengaduan->id,
            'user_id' => Auth::id(),
            'status_lama' => $statusLama,
            'status_baru' => $statusBaru,
            'catatan' => $request->catatan,
        ]);

        return back()->with('success', 'Status pengaduan berhasil diperbarui.');
    }

    /**
     * Hapus pengaduan (Soft Delete)
     */
    public function destroy($id)
    {
        $pengaduan = Pengaduan::findOrFail($id);
        $pengaduan->delete();

        return back()->with('success', 'Pengaduan berhasil dihapus.');
    }
}
