<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    /**
     * Tampilkan daftar pengumuman
     */
    public function index()
    {
        $pengumuman = Pengumuman::with('dibuatOleh.profil')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/pengumuman/index', [
            'pengumuman' => $pengumuman
        ]);
    }

    /**
     * Simpan pengumuman baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tipe' => 'required|string',
            'is_penting' => 'boolean',
            'is_semat' => 'boolean',
        ]);

        Pengumuman::create([
            'dibuat_oleh' => Auth::id(),
            'judul' => $request->judul,
            'isi' => $request->isi,
            'tipe' => $request->tipe,
            'target_peran' => $request->target_peran,
            'is_penting' => $request->is_penting ?? false,
            'is_semat' => $request->is_semat ?? false,
            'published_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pengumuman berhasil dibuat.');
    }

    /**
     * Update pengumuman
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tipe' => 'required|string',
        ]);

        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->update($request->all());

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    /**
     * Hapus pengumuman
     */
    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();

        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
