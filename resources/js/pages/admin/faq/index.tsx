import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    HelpCircle, 
    ArrowUpDown,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

interface Faq {
    id: string;
    pertanyaan: string;
    jawaban: string;
    kategori: string;
    urutan: number;
    is_active: boolean;
}

interface Props {
    faqs: {
        data: Faq[];
    };
    filters: {
        search?: string;
        kategori?: string;
    };
}

export default function FaqIndex({ faqs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [formOpen, setFormOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        pertanyaan: '',
        jawaban: '',
        kategori: 'umum',
        urutan: 0,
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(admin.faq.index().url, { search, kategori: filters.kategori }, {
            preserveState: true,
            replace: true
        });
    };

    const openAddModal = () => {
        setEditingFaq(null);
        reset();
        clearErrors();
        setFormOpen(true);
    };

    const openEditModal = (faq: Faq) => {
        setEditingFaq(faq);
        setData({
            pertanyaan: faq.pertanyaan,
            jawaban: faq.jawaban,
            kategori: faq.kategori,
            urutan: faq.urutan,
            is_active: faq.is_active,
        });
        clearErrors();
        setFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFaq) {
            put(admin.faq.update(editingFaq.id).url, {
                onSuccess: () => setFormOpen(false),
            });
        } else {
            post(admin.faq.store().url, {
                onSuccess: () => setFormOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus FAQ ini?')) {
            router.delete(admin.faq.destroy(id).url);
        }
    };

    const categories = ['umum', 'pengaduan', 'layanan', 'akun', 'teknis'];

    return (
        <>
            <Head title="Manajemen Bantuan & FAQ" />

            <div className="space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Bantuan & FAQ</h1>
                        <p className="text-sm text-slate-500 font-inter">Kelola pertanyaan umum untuk membantu warga menggunakan layanan.</p>
                    </div>
                    <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah FAQ
                    </Button>
                </div>

                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 bg-slate-50/30">
                        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Cari pertanyaan atau jawaban..." 
                                className="pl-9 h-9 bg-white"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </form>
                        <div className="flex items-center gap-2">
                            <Select 
                                value={filters.kategori || 'semua'} 
                                onValueChange={v => router.get(admin.faq.index().url, { search, kategori: v === 'semua' ? '' : v })}
                            >
                                <SelectTrigger className="h-9 w-[150px] bg-white">
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Kategori</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[80px]">Order</TableHead>
                                    <TableHead>Pertanyaan</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.data.length > 0 ? faqs.data.map((faq) => (
                                    <TableRow key={faq.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-mono text-xs text-slate-400">
                                            #{faq.urutan}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[400px]">
                                                <p className="font-semibold text-slate-900 line-clamp-1">{faq.pertanyaan}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{faq.jawaban}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize bg-slate-50 text-slate-600 border-slate-200">
                                                {faq.kategori}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {faq.is_active ? (
                                                <div className="flex items-center text-emerald-600 gap-1 text-xs font-medium">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-slate-400 gap-1 text-xs font-medium">
                                                    <XCircle className="h-3.5 w-3.5" /> Nonaktif
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => openEditModal(faq)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(faq.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                            Belum ada data FAQ.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Form */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
                            <DialogDescription>
                                Masukkan pertanyaan dan jawaban yang sering diajukan oleh warga.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="pertanyaan">Pertanyaan</Label>
                                <Input 
                                    id="pertanyaan" 
                                    value={data.pertanyaan} 
                                    onChange={e => setData('pertanyaan', e.target.value)} 
                                    placeholder="Contoh: Bagaimana cara mengajukan surat domisili?"
                                />
                                {errors.pertanyaan && <p className="text-xs text-red-500">{errors.pertanyaan}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jawaban">Jawaban</Label>
                                <Textarea 
                                    id="jawaban" 
                                    value={data.jawaban} 
                                    onChange={e => setData('jawaban', e.target.value)} 
                                    placeholder="Masukkan jawaban lengkap di sini..."
                                    className="min-h-[150px]"
                                />
                                {errors.jawaban && <p className="text-xs text-red-500">{errors.jawaban}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kategori">Kategori</Label>
                                    <Select value={data.kategori} onValueChange={v => setData('kategori', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="urutan">Urutan Tampilan</Label>
                                    <Input 
                                        id="urutan" 
                                        type="number"
                                        value={data.urutan} 
                                        onChange={e => setData('urutan', parseInt(e.target.value))} 
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    id="is_active" 
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                />
                                <Label htmlFor="is_active">Aktifkan FAQ ini (Muncul di halaman publik)</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                {processing ? 'Menyimpan...' : 'Simpan FAQ'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

FaqIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Bantuan & FAQ', href: '#' }]}>{page}</AppLayout>
);
