import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Megaphone, 
    AlertCircle, 
    Pin, 
    Calendar,
    Eye,
    CheckCircle2
} from 'lucide-react';
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
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnnouncementForm } from '../components/announcement-form';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface Pengumuman {
    id: string;
    judul: string;
    isi: string;
    tipe: string;
    is_penting: boolean;
    is_semat: boolean;
    published_at: string;
    jumlah_dilihat: number;
    dibuat_oleh_user?: {
        profil?: {
            nama_lengkap: string;
        }
    };
}

interface Props {
    pengumuman: {
        data: Pengumuman[];
        links: any[];
    }
}

export function PengumumanListPage({ pengumuman }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Pengumuman | null>(null);

    const handleCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: Pengumuman) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Yakin ingin menghapus pengumuman ini?')) {
            router.delete(admin.pengumuman.destroy(id).url);
        }
    };

    const getTipeBadge = (tipe: string) => {
        switch (tipe) {
            case 'umum': return <Badge variant="secondary" className="bg-slate-100 text-slate-600">Umum</Badge>;
            case 'informasi': return <Badge variant="secondary" className="bg-blue-50 text-blue-600">Informasi</Badge>;
            case 'kegiatan': return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">Kegiatan</Badge>;
            case 'maintenance': return <Badge variant="secondary" className="bg-amber-50 text-amber-600">Maintenance</Badge>;
            default: return <Badge variant="secondary">{tipe}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Berita & Pengumuman</h1>
                    <p className="text-sm text-slate-500 font-inter">Kelola konten informasi yang ditayangkan kepada warga.</p>
                </div>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Pengumuman
                </Button>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Cari judul pengumuman..." className="pl-9 h-9 bg-white" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-[400px]">Konten Pengumuman</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Statistik</TableHead>
                                <TableHead>Diterbitkan</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengumuman.data.length > 0 ? pengumuman.data.map((item) => (
                                <TableRow key={item.id} className="group border-slate-50 hover:bg-blue-50/30 transition-colors">
                                    <TableCell>
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center",
                                                item.is_penting ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                            )}>
                                                {item.is_penting ? <AlertCircle className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900 truncate">{item.judul}</p>
                                                    {item.is_semat && <Pin className="h-3 w-3 text-blue-500 fill-current" />}
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-1">{item.isi}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTipeBadge(item.tipe)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {item.is_penting && <Badge className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] h-4">PENTING</Badge>}
                                            {item.is_semat && <Badge className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px] h-4">DISEMATKAN</Badge>}
                                            {!item.is_penting && !item.is_semat && <span className="text-xs text-slate-400 font-medium">Normal</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {item.jumlah_dilihat}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                0
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-slate-900">
                                                {new Date(item.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(item.published_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem onClick={() => handleEdit(item)} className="cursor-pointer">
                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                        Belum ada pengumuman yang diterbitkan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AnnouncementForm 
                open={isFormOpen} 
                onOpenChange={setIsFormOpen} 
                item={editingItem} 
            />
        </div>
    );
}
