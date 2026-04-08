<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// Override Fortify login routes dengan custom controller
Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('admin/statistik', [\App\Http\Controllers\Admin\StatistikController::class, 'statistik'])->name('admin.statistik');
    
    // Admin Pengaduan
    Route::get('admin/pengaduan', [\App\Http\Controllers\Admin\PengaduanController::class, 'index'])->name('admin.pengaduan.index');
    Route::get('admin/pengaduan/riwayat', [\App\Http\Controllers\Admin\PengaduanController::class, 'riwayat'])->name('admin.pengaduan.riwayat');
    Route::get('admin/pengaduan/{id}', [\App\Http\Controllers\Admin\PengaduanController::class, 'show'])->name('admin.pengaduan.show');
    Route::post('admin/pengaduan/{id}', [\App\Http\Controllers\Admin\PengaduanController::class, 'update'])->name('admin.pengaduan.update');
    Route::delete('admin/pengaduan/{id}', [\App\Http\Controllers\Admin\PengaduanController::class, 'destroy'])->name('admin.pengaduan.destroy');
    // Admin Layanan Administrasi
    Route::get('admin/layanan', [\App\Http\Controllers\Admin\LayananController::class, 'index'])->name('admin.layanan.index');
    Route::get('admin/layanan/{id}', [\App\Http\Controllers\Admin\LayananController::class, 'show'])->name('admin.layanan.show');
    Route::post('admin/layanan/{id}', [\App\Http\Controllers\Admin\LayananController::class, 'update'])->name('admin.layanan.update');
    Route::delete('admin/layanan/{id}', [\App\Http\Controllers\Admin\LayananController::class, 'destroy'])->name('admin.layanan.destroy');

    // Admin Katalog Layanan
    Route::get('admin/katalog-layanan', [\App\Http\Controllers\Admin\KatalogLayananController::class, 'index'])->name('admin.katalog.index');
    Route::post('admin/katalog-layanan', [\App\Http\Controllers\Admin\KatalogLayananController::class, 'store'])->name('admin.katalog.store');
    Route::post('admin/katalog-layanan/{id}', [\App\Http\Controllers\Admin\KatalogLayananController::class, 'update'])->name('admin.katalog.update');
    Route::delete('admin/katalog-layanan/{id}', [\App\Http\Controllers\Admin\KatalogLayananController::class, 'destroy'])->name('admin.katalog.destroy');

    // Admin Manajemen Antrean
    Route::get('admin/antrean', [\App\Http\Controllers\Admin\AntreanController::class, 'index'])->name('admin.antrean.index');
    Route::post('admin/antrean/next', [\App\Http\Controllers\Admin\AntreanController::class, 'next'])->name('admin.antrean.next');
    Route::post('admin/antrean/{id}', [\App\Http\Controllers\Admin\AntreanController::class, 'update'])->name('admin.antrean.update');
    Route::delete('admin/antrean/reset', [\App\Http\Controllers\Admin\AntreanController::class, 'reset'])->name('admin.antrean.reset');
});

require __DIR__.'/settings.php';
