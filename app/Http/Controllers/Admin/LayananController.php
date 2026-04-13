<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\RiwayatDokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * Tampilkan daftar permohonan dokumen
     */
    public function index(Request $request)
    {
        $query = Dokumen::with(['user.profil', 'jenisDokumen'])
            ->latest();

        // 1. Filter Status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // 2. Filter Jenis Dokumen
        if ($request->has('jenis') && $request->jenis !== '') {
            $query->where('jenis_dokumen_id', $request->jenis);
        }

        // 3. Pencarian (Nomor Dokumen atau Nama Pemohon)
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_dokumen', 'like', "%{$search}%")
                  ->orWhere('nama_pemohon', 'like', "%{$search}%")
                  ->orWhere('nik_pemohon', 'like', "%{$search}%");
            });
        }

        $documents = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/layanan/index/index', [
            'documents' => $documents,
            'jenisDokumen' => JenisDokumen::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'jenis', 'search']),
        ]);
    }

    /**
     * Tampilkan detail permohonan
     */
    public function show($id)
    {
        $document = Dokumen::with(['user.profil', 'jenisDokumen', 'lampiran', 'riwayat.user.profil'])
            ->findOrFail($id);

        return Inertia::render('admin/layanan/detail/index', [
            'document' => $document
        ]);
    }

    /**
     * Update status permohonan
     */
    public function update(Request $request, $id)
    {
        $document = Dokumen::findOrFail($id);
        
        $request->validate([
            'status' => 'required|string',
            'catatan' => 'required|string',
        ]);

        $statusLama = $document->status;
        $statusBaru = $request->status;

        $updateData = [
            'status' => $statusBaru,
        ];

        // Specific logic based on status
        if ($statusBaru === 'terverifikasi') {
            $updateData['verified_by'] = Auth::id();
            $updateData['verified_at'] = now();
        } elseif ($statusBaru === 'disetujui') {
            $updateData['approved_by'] = Auth::id();
            $updateData['approved_at'] = now();
        } elseif ($statusBaru === 'ditolak') {
            $updateData['rejected_by'] = Auth::id();
            $updateData['rejected_at'] = now();
            $updateData['alasan_penolakan'] = $request->catatan;
        } elseif ($statusBaru === 'selesai') {
            $updateData['completed_at'] = now();
        }

        $document->update($updateData);

        // Catat di Riwayat
        RiwayatDokumen::create([
            'dokumen_id' => $document->id,
            'user_id' => Auth::id(),
            'status_lama' => $statusLama,
            'status_baru' => $statusBaru,
            'catatan' => $request->catatan,
        ]);

        return back()->with('success', 'Status permohonan berhasil diperbarui.');
    }

    /**
     * Hapus permohonan (Soft Delete)
     */
    public function destroy($id)
    {
        $document = Dokumen::findOrFail($id);
        $document->delete();

        return back()->with('success', 'Permohonan berhasil dihapus.');
    }

    /**
     * Terbitkan surat PDF untuk permohonan
     */
    public function terbitkanSurat($id)
    {
        $dokumen = Dokumen::with(['user.profil', 'jenisDokumen'])->findOrFail($id);

        // Generate PDF
        $pdf = Pdf::loadView('surat.pengantar', compact('dokumen'));
        
        // Define path
        $fileName = 'surat_' . $dokumen->nomor_dokumen . '_' . time() . '.pdf';
        $path = 'surat/' . $fileName;

        // Save to storage
        Storage::disk('public')->put($path, $pdf->output());

        // Update document
        $dokumen->update([
            'url_dokumen_dihasilkan' => asset('storage/' . $path),
            'generated_at' => now(),
            'status' => 'selesai' // Secara otomatis selesaikan jika diterbitkan
        ]);

        // Catat di Riwayat jika status berubah
        RiwayatDokumen::create([
            'dokumen_id' => $dokumen->id,
            'user_id' => Auth::id(),
            'status_lama' => 'disetujui',
            'status_baru' => 'selesai',
            'catatan' => 'Surat resmi telah diterbitkan.',
        ]);

        return back()->with('success', 'Surat berhasil diterbitkan dan status diperbarui menjadi selesai.');
    }
}
