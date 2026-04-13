<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ProfilPengguna;
use App\Models\PeranPengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WargaController extends Controller
{
    /**
     * Tampilkan daftar warga
     */
    public function index(Request $request)
    {
        $query = User::with(['profil', 'peran'])
            ->whereHas('peran', function ($q) {
                $q->where('peran', 'warga');
            })
            ->latest();

        // Pencarian berdasarkan Nama atau NIK
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhereHas('profil', function ($qp) use ($search) {
                      $qp->where('nama_lengkap', 'like', "%{$search}%");
                  });
            });
        }

        $warga = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/warga/index', [
            'warga' => $warga,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Tampilkan detail warga
     */
    public function show($id)
    {
        $warga = User::with(['profil', 'peran', 'pengaduan', 'dokumen'])
            ->whereHas('peran', function ($q) {
                $q->where('peran', 'warga');
            })
            ->findOrFail($id);

        return Inertia::render('admin/warga/show', [
            'warga' => $warga
        ]);
    }

    /**
     * Simpan data warga baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:16|unique:users,nik',
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'alamat' => 'nullable|string',
            'jenis_kelamin' => 'nullable|string|in:L,P',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create User
            $user = User::create([
                'nik' => $request->nik,
                'email' => $request->email,
                'phone' => $request->phone,
                'password_hash' => Hash::make($request->password),
                'is_active' => true,
            ]);

            // 2. Create Profile
            ProfilPengguna::create([
                'user_id' => $user->id,
                'nama_lengkap' => $request->nama_lengkap,
                'alamat' => $request->alamat,
                'jenis_kelamin' => $request->jenis_kelamin,
            ]);

            // 3. Assign Role Warga
            PeranPengguna::create([
                'user_id' => $user->id,
                'peran' => 'warga',
                'is_active' => true,
            ]);

            DB::commit();
            return back()->with('success', 'Data warga berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menambahkan data warga: ' . $e->getMessage());
        }
    }

    /**
     * Update data warga
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nik' => 'required|string|size:16|unique:users,nik,' . $user->id,
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'alamat' => 'nullable|string',
            'jenis_kelamin' => 'nullable|string|in:L,P',
            'is_active' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();

            // 1. Update User
            $userData = [
                'nik' => $request->nik,
                'email' => $request->email,
                'phone' => $request->phone,
                'is_active' => $request->is_active,
            ];

            if ($request->filled('password')) {
                $userData['password_hash'] = Hash::make($request->password);
            }

            $user->update($userData);

            // 2. Update Profile
            $user->profil()->update([
                'nama_lengkap' => $request->nama_lengkap,
                'alamat' => $request->alamat,
                'jenis_kelamin' => $request->jenis_kelamin,
            ]);

            DB::commit();
            return back()->with('success', 'Data warga berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui data warga: ' . $e->getMessage());
        }
    }

    /**
     * Hapus data warga (Soft Delete)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'Data warga berhasil dihapus.');
    }
}
