<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Percakapan;
use App\Models\Pesan;
use App\Models\User;
use App\Models\PeranPengguna;
use App\Models\Pengaduan;
use App\Models\Dokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PesanController extends Controller
{
    /**
     * Tampilkan daftar percakapan warga
     */
    public function index()
    {
        $currentUserId = Auth::id();

        $conversations = Percakapan::with(['user1.profil', 'user2.profil', 'pesan' => function($q) {
                $q->latest()->limit(1);
            }])
            ->where(function($q) use ($currentUserId) {
                $q->where('user_id_1', $currentUserId)
                  ->orWhere('user_id_2', $currentUserId);
            })
            ->withCount(['pesan as unread_count' => function($q) use ($currentUserId) {
                $q->where('penerima_id', $currentUserId)->where('is_dibaca', false);
            }])
            ->latest('last_message_at')
            ->get()
            ->map(function($conv) {
                // Add context label
                $conv->context_label = $this->getContextLabel($conv);
                return $conv;
            });

        return Inertia::render('warga/pesan/index', [
            'conversations' => $conversations,
            'currentUserId' => $currentUserId,
            'selectedId' => request('select')
        ]);
    }

    /**
     * Tampilkan pesan dalam percakapan
     */
    public function show($id)
    {
        $currentUserId = Auth::id();
        $conversation = Percakapan::where(function($q) use ($currentUserId) {
                $q->where('user_id_1', $currentUserId)
                  ->orWhere('user_id_2', $currentUserId);
            })
            ->with(['user1.profil', 'user2.profil', 'pesan.pengirim.profil'])
            ->findOrFail($id);

        // Mark as read
        Pesan::where('percakapan_id', $id)
            ->where('penerima_id', $currentUserId)
            ->update(['is_dibaca' => true, 'read_at' => now()]);

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->pesan,
            'context_label' => $this->getContextLabel($conversation)
        ]);
    }

    /**
     * Kirim pesan baru dalam percakapan yang ada
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'isi' => 'required|string',
        ]);

        $currentUserId = Auth::id();
        $conversation = Percakapan::where(function($q) use ($currentUserId) {
                $q->where('user_id_1', $currentUserId)
                  ->orWhere('user_id_2', $currentUserId);
            })
            ->findOrFail($id);
        
        // Tentukan penerima
        $penerimaId = ($conversation->user_id_1 === $currentUserId) 
            ? $conversation->user_id_2 
            : $conversation->user_id_1;

        $pesan = Pesan::create([
            'percakapan_id' => $conversation->id,
            'pengirim_id' => $currentUserId,
            'penerima_id' => $penerimaId,
            'isi' => $request->isi,
            'status_pesan' => 'terkirim',
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json($pesan);
    }

    /**
     * Memulai percakapan baru (umum atau kontekstual)
     */
    public function start(Request $request)
    {
        $currentUserId = Auth::id();
        $contextType = $request->query('type'); // 'pengaduan' or 'layanan'
        $contextId = $request->query('id');

        // Cari admin utama
        $adminId = User::whereHas('peran', function($q) {
            $q->where('peran', 'admin');
        })->first()?->id;

        if (!$adminId) return back()->with('error', 'Petugas admin tidak ditemukan.');

        // Cek apakah sudah ada percakapan dengan konteks ini
        $conversation = Percakapan::where(function($q) use ($currentUserId, $adminId) {
                $q->where('user_id_1', $currentUserId)->where('user_id_2', $adminId);
            })
            ->orWhere(function($q) use ($currentUserId, $adminId) {
                $q->where('user_id_1', $adminId)->where('user_id_2', $currentUserId);
            })
            ->where('context_type', $contextType)
            ->where('context_id', $contextId)
            ->first();

        if (!$conversation) {
            $conversation = Percakapan::create([
                'user_id_1' => $currentUserId,
                'user_id_2' => $adminId,
                'status' => 'active',
                'context_type' => $contextType,
                'context_id' => $contextId,
                'last_message_at' => now(),
            ]);
        }

        return redirect()->route('warga.pesan.index', ['select' => $conversation->id]);
    }

    private function getContextLabel($conversation)
    {
        if (!$conversation->context_type) return 'Diskusi Umum';

        if ($conversation->context_type === 'pengaduan') {
            $pengaduan = Pengaduan::find($conversation->context_id);
            return $pengaduan ? "Pengaduan: {$pengaduan->nomor_pengaduan}" : "Diskusi Pengaduan";
        }

        if ($conversation->context_type === 'layanan') {
            $dokumen = Dokumen::find($conversation->context_id);
            return $dokumen ? "Layanan: {$dokumen->nomor_dokumen}" : "Diskusi Layanan";
        }

        return 'Diskusi';
    }
}
