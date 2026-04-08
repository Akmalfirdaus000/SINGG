<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Notifikasi;
use App\Models\Pengaduan;
use App\Models\Pengumuman;
use App\Models\Pesan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if ($isAdmin) {
            // Global Stats for Admin
            $activeComplaintsCount = Pengaduan::whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'dalam_proses'])
                ->count();

            $processingDocumentsCount = Dokumen::whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui'])
                ->count();

            $totalCitizensCount = \App\Models\User::whereHas('peran', function ($query) {
                $query->where('peran', 'warga');
            })->count();

            $averageRating = Pengaduan::whereNotNull('rating')->avg('rating') ?: 0;
            $ratingCount = Pengaduan::whereNotNull('rating')->count();

            $latestComplaint = Pengaduan::with('user.profil')->latest()->first();
            $latestDocument = Dokumen::with(['user.profil', 'jenisDokumen'])->latest()->first();

            $view = 'admin/dashboard';
        } else {
            // Personal Stats for Warga
            $activeComplaintsCount = Pengaduan::where('user_id', $user->id)
                ->whereIn('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_proses'])
                ->count();

            $processingDocumentsCount = Dokumen::where('user_id', $user->id)
                ->whereIn('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui'])
                ->count();

            $totalCitizensCount = 0; // Not used for warga

            $averageRating = Pengaduan::where('user_id', $user->id)
                ->whereNotNull('rating')
                ->avg('rating') ?: 0;

            $ratingCount = Pengaduan::where('user_id', $user->id)
                ->whereNotNull('rating')
                ->count();

            $latestComplaint = Pengaduan::where('user_id', $user->id)->latest()->first();
            $latestDocument = Dokumen::with('jenisDokumen')->where('user_id', $user->id)->latest()->first();
            
            $view = 'warga/dashboard';
        }

        // Map status to progress percentage for the latest complaint
        if ($latestComplaint) {
            $latestComplaint->progress = match ($latestComplaint->status) {
                'draft' => 10,
                'menunggu_verifikasi' => 20,
                'terverifikasi' => 40,
                'dalam_proses' => 70,
                'selesai' => 100,
                default => 0,
            };
        }

        // Announcements (Global)
        $announcements = Pengumuman::where('is_penting', true)
            ->orWhere('published_at', '>=', now()->subDays(30))
            ->latest('published_at')
            ->take(3)
            ->get();

        // Notifications & Messages (Personal)
        $unreadNotifications = Notifikasi::where('user_id', $user->id)
            ->where('is_dibaca', false)
            ->count();

        $unreadMessages = Pesan::where('penerima_id', $user->id)
            ->where('is_dibaca', false)
            ->count();

        return Inertia::render($view, [
            'stats' => [
                'activeComplaints' => $activeComplaintsCount,
                'processingDocuments' => $processingDocumentsCount,
                'extraCount' => $isAdmin ? $totalCitizensCount : 0, // Total citizens for admin vs 0 for warga
                'rating' => [
                    'average' => round($averageRating, 1),
                    'count' => $ratingCount,
                ],
            ],
            'latest' => [
                'complaint' => $latestComplaint,
                'document' => $latestDocument,
            ],
            'announcements' => $announcements,
            'unread' => [
                'notifications' => $unreadNotifications,
                'messages' => $unreadMessages,
            ],
        ]);
    }
}
