import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Check, 
    X, 
    BookOpen,
    Clock,
    CreditCard,
    ListChecks,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface JenisDokumen {
    id: string;
    nama: string;
    nama_tampilan: string;
    deskripsi: string;
    biaya: number;
    hari_proses: number;
    persyaratan: any[];
    is_active: boolean;
}

interface Props {
    katalog: JenisDokumen[];
}

export function KatalogListPage({ katalog }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<JenisDokumen | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        nama_tampilan: '',
        deskripsi: '',
        biaya: 0,
        hari_proses: 3,
        persyaratan: [] as string[],
        is_active: true,
    });

    const [newRequirement, setNewRequirement] = useState('');

    const handleOpen = (item?: JenisDokumen) => {
        if (item) {
            setEditing(item);
            setData({
                nama_tampilan: item.nama_tampilan,
                deskripsi: item.deskripsi || '',
                biaya: item.biaya,
                hari_proses: item.hari_proses,
                persyaratan: (item.persyaratan as any[] || []).map(p => typeof p === 'string' ? p : p.nama),
                is_active: item.is_active,
            });
        } else {
            setEditing(null);
            reset();
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Transform persyaratan array of strings to array of objects for storage if needed
        // but for now let's keep it simple as expected by our controller logic
        const payload = {
            ...data,
            persyaratan: data.persyaratan.map(p => ({ nama: p, wajib: true }))
        };

        if (editing) {
            router.post(admin.katalog.update(editing.id).url, payload as any, {
                onSuccess: () => setIsOpen(false)
            });
        } else {
            router.post(admin.katalog.store().url, payload as any, {
                onSuccess: () => setIsOpen(false)
            });
        }
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setData('persyaratan', [...data.persyaratan, newRequirement.trim()]);
            setNewRequirement('');
        }
    };

    const removeRequirement = (index: number) => {
        const next = [...data.persyaratan];
        next.splice(index, 1);
        setData('persyaratan', next);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Yakin ingin menghapus jenis layanan ini? Semua data terkait mungkin akan terpengaruh.')) {
            router.delete(admin.katalog.destroy(id).url);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Katalog Layanan</h1>
                    <p className="text-muted-foreground">Kelola jenis dokumen dan persyaratan yang tersedia.</p>
                </div>
                <Button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Layanan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {katalog.map((item) => (
                    <Card key={item.id} className={cn(
                        "group relative overflow-hidden border-none shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-blue-200",
                        !item.is_active && "bg-slate-50 opacity-75"
                    )}>
                        {!item.is_active && (
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-none">Nonaktif</Badge>
                            </div>
                        )}
                        <CardHeader className="pb-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg leading-tight">{item.nama_tampilan}</CardTitle>
                            <CardDescription className="line-clamp-2">{item.deskripsi || "Tidak ada deskripsi."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>{item.hari_proses} Hari</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    <span className="font-semibold text-orange-600">
                                        {item.biaya > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(item.biaya)}` : 'Gratis'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Persyaratan Dokumen</p>
                                <div className="flex flex-wrap gap-1.5 text-[11px]">
                                    {(item.persyaratan as any[] || []).map((p, i) => (
                                        <Badge key={i} variant="outline" className="bg-slate-50 border-slate-200 text-slate-500 font-medium">
                                            {typeof p === 'string' ? p : p.nama}
                                        </Badge>
                                    ))}
                                    {(!item.persyaratan || item.persyaratan.length === 0) && (
                                        <span className="text-slate-400 italic">Tanpa syarat unggahan</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpen(item)}>
                                    <Edit2 className="h-3 w-3 mr-1.5" />
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
                        <DialogDescription>
                            Konfigurasi detail layanan administrasi untuk warga.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_tampilan">Nama Layanan</Label>
                                <Input 
                                    id="nama_tampilan" 
                                    placeholder="Contoh: Surat Keterangan Domisili" 
                                    value={data.nama_tampilan}
                                    onChange={e => setData('nama_tampilan', e.target.value)}
                                    className={cn(errors.nama_tampilan && "border-red-500")}
                                />
                                {errors.nama_tampilan && <p className="text-xs text-red-500">{errors.nama_tampilan}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="biaya">Biaya (Rp)</Label>
                                    <Input 
                                        id="biaya" 
                                        type="number"
                                        value={data.biaya}
                                        onChange={e => setData('biaya', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hari_proses">Estimasi Hari</Label>
                                    <Input 
                                        id="hari_proses" 
                                        type="number"
                                        value={data.hari_proses}
                                        onChange={e => setData('hari_proses', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                                <Textarea 
                                    id="deskripsi" 
                                    placeholder="Jelaskan kegunaan layanan ini..." 
                                    className="resize-none"
                                    value={data.deskripsi}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Persyaratan Unggahan</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Tambah syarat (mis: Scan KTP)" 
                                        value={newRequirement}
                                        onChange={e => setNewRequirement(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                    />
                                    <Button type="button" size="icon" variant="secondary" onClick={addRequirement}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    {data.persyaratan.map((p, i) => (
                                        <Badge key={i} className="bg-white text-slate-700 border-slate-200 flex gap-1 pr-1 cursor-default">
                                            {p}
                                            <button type="button" onClick={() => removeRequirement(i)} className="hover:text-red-500">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {data.persyaratan.length === 0 && (
                                        <span className="text-xs text-slate-400 italic">Belum ada persyaratan</span>
                                    )}
                                </div>
                            </div>

                            {editing && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <Label htmlFor="is_active" className="cursor-pointer">Status Aktif</Label>
                                    <Checkbox 
                                        id="is_active" 
                                        checked={data.is_active}
                                        onCheckedChange={(v: boolean) => setData('is_active', v)}
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                                {processing ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Layanan')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
