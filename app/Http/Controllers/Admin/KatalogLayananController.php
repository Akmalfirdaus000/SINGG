<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisDokumen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class KatalogLayananController extends Controller
{
    /**
     * Tampilkan katalog layanan
     */
    public function index()
    {
        $katalog = JenisDokumen::orderBy('urutan')->get();

        return Inertia::render('admin/katalog/index/index', [
            'katalog' => $katalog
        ]);
    }

    /**
     * Store new layanan
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_tampilan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'biaya' => 'required|numeric|min:0',
            'hari_proses' => 'required|integer|min:1',
            'persyaratan' => 'nullable|array',
        ]);

        JenisDokumen::create([
            'id' => Str::uuid(),
            'nama' => Str::snake(Str::lower($request->nama_tampilan)),
            'nama_tampilan' => $request->nama_tampilan,
            'deskripsi' => $request->deskripsi,
            'biaya' => $request->biaya,
            'hari_proses' => $request->hari_proses,
            'persyaratan' => $request->persyaratan ?? [],
            'is_active' => true,
            'urutan' => JenisDokumen::max('urutan') + 1,
        ]);

        return back()->with('success', 'Layanan baru berhasil ditambahkan.');
    }

    /**
     * Update layanan
     */
    public function update(Request $request, $id)
    {
        $layanan = JenisDokumen::findOrFail($id);

        $request->validate([
            'nama_tampilan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'biaya' => 'required|numeric|min:0',
            'hari_proses' => 'required|integer|min:1',
            'persyaratan' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $layanan->update([
            'nama_tampilan' => $request->nama_tampilan,
            'deskripsi' => $request->deskripsi,
            'biaya' => $request->biaya,
            'hari_proses' => $request->hari_proses,
            'persyaratan' => $request->persyaratan ?? [],
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Hapus layanan
     */
    public function destroy($id)
    {
        $layanan = JenisDokumen::findOrFail($id);
        $layanan->delete();

        return back()->with('success', 'Layanan berhasil dihapus dari katalog.');
    }
}
