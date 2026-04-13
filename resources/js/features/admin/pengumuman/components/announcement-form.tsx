import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface Pengumuman {
    id: string;
    judul: string;
    isi: string;
    tipe: string;
    is_penting: boolean;
    is_semat: boolean;
    target_peran?: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: Pengumuman | null;
}

export function AnnouncementForm({ open, onOpenChange, item }: Props) {
    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        judul: '',
        isi: '',
        tipe: 'umum',
        target_peran: 'warga',
        is_penting: false,
        is_semat: false,
    });

    useEffect(() => {
        if (item) {
            setData({
                judul: item.judul,
                isi: item.isi,
                tipe: item.tipe,
                target_peran: item.target_peran || 'warga',
                is_penting: item.is_penting,
                is_semat: item.is_semat,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (item) {
            put(admin.pengumuman.update(item.id).url, {
                onSuccess: () => onOpenChange(false)
            });
        } else {
            post(admin.pengumuman.store().url, {
                onSuccess: () => onOpenChange(false)
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{item ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
                    <DialogDescription>
                        Isi detail informasi yang ingin disampaikan kepada warga atau admin lainnya.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Pengumuman</Label>
                            <Input 
                                id="judul" 
                                placeholder="Masukkan judul..." 
                                value={data.judul}
                                onChange={e => setData('judul', e.target.value)}
                                className={cn(errors.judul && "border-red-500")}
                            />
                            {errors.judul && <p className="text-xs text-red-500">{errors.judul}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipe">Kategori/Tipe</Label>
                                <Select value={data.tipe} onValueChange={v => setData('tipe', v)}>
                                    <SelectTrigger id="tipe">
                                        <SelectValue placeholder="Pilih tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="umum">Umum</SelectItem>
                                        <SelectItem value="informasi">Informasi</SelectItem>
                                        <SelectItem value="kegiatan">Kegiatan</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target_peran">Target Audience</Label>
                                <Select value={data.target_peran} onValueChange={v => setData('target_peran', v)}>
                                    <SelectTrigger id="target_peran">
                                        <SelectValue placeholder="Pilih target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="warga">Warga</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="semua">Semua Pengguna</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isi">Isi Konten</Label>
                            <Textarea 
                                id="isi" 
                                placeholder="Tulis pengumuman di sini..." 
                                className={cn("min-h-[150px] resize-none", errors.isi && "border-red-500")}
                                value={data.isi}
                                onChange={e => setData('isi', e.target.value)}
                            />
                            {errors.isi && <p className="text-xs text-red-500">{errors.isi}</p>}
                        </div>

                        <div className="flex flex-wrap gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_penting" 
                                    checked={data.is_penting}
                                    onCheckedChange={(v: boolean) => setData('is_penting', v)}
                                />
                                <Label htmlFor="is_penting" className="text-sm font-medium cursor-pointer">Ditandai Penting</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_semat" 
                                    checked={data.is_semat}
                                    onCheckedChange={(v: boolean) => setData('is_semat', v)}
                                />
                                <Label htmlFor="is_semat" className="text-sm font-medium cursor-pointer">Sematkan (Sticky)</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                            {processing ? 'Menyimpan...' : (item ? 'Simpan Perubahan' : 'Terbitkan Sekarang')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
