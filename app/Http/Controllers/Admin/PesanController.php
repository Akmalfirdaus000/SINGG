<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Percakapan;
use App\Models\Pesan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PesanController extends Controller
{
    /**
     * Tampilkan daftar percakapan
     */
    public function index()
    {
        $currentUserId = Auth::id();

        // Ambil semua percakapan yang melibatkan admin (atau semua jika sistem bersifat tiket)
        // Di sini kita ambil semua percakapan aktif untuk admin kelola
        $conversations = Percakapan::with(['user1.profil', 'user2.profil', 'pesan' => function($q) {
                $q->latest()->limit(1);
            }])
            ->withCount(['pesan as unread_count' => function($q) use ($currentUserId) {
                $q->where('penerima_id', $currentUserId)->where('is_dibaca', false);
            }])
            ->latest('last_message_at')
            ->get();

        return Inertia::render('admin/pesan/index', [
            'conversations' => $conversations,
            'currentUserId' => $currentUserId
        ]);
    }

    /**
     * Tampilkan pesan dalam percakapan
     */
    public function show($id)
    {
        $currentUserId = Auth::id();
        $conversation = Percakapan::with(['user1.profil', 'user2.profil', 'pesan.pengirim.profil'])
            ->findOrFail($id);

        // Mark as read
        Pesan::where('percakapan_id', $id)
            ->where('penerima_id', $currentUserId)
            ->update(['is_dibaca' => true, 'read_at' => now()]);

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->pesan
        ]);
    }

    /**
     * Kirim pesan baru
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'isi' => 'required|string',
        ]);

        $conversation = Percakapan::findOrFail($id);
        $currentUserId = Auth::id();
        
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
}
