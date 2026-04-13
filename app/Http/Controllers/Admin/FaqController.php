<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Tampilkan daftar FAQ untuk admin
     */
    public function index(Request $request)
    {
        $query = Faq::query()->orderBy('urutan')->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where('pertanyaan', 'like', "%{$search}%")
                  ->orWhere('jawaban', 'like', "%{$search}%");
        }

        if ($request->has('kategori') && $request->kategori !== '') {
            $query->where('kategori', $request->kategori);
        }

        $faqs = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/faq/index', [
            'faqs' => $faqs,
            'filters' => $request->only(['search', 'kategori']),
        ]);
    }

    /**
     * Simpan FAQ baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'kategori' => 'required|string|max:50',
            'urutan' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);

        Faq::create($request->all());

        return back()->with('success', 'FAQ berhasil ditambahkan.');
    }

    /**
     * Update FAQ
     */
    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'kategori' => 'required|string|max:50',
            'urutan' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);

        $faq->update($request->all());

        return back()->with('success', 'FAQ berhasil diperbarui.');
    }

    /**
     * Hapus FAQ
     */
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return back()->with('success', 'FAQ berhasil dihapus.');
    }
}
