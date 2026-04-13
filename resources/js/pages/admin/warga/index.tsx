import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    User, 
    ShieldCheck, 
    ShieldAlert, 
    Mail, 
    Smartphone,
    Eye,
    Edit2,
    Trash2
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { WargaForm } from '@/features/admin/warga/components/warga-form';

interface Warga {
    id: string;
    nik: string;
    email: string;
    phone: string;
    is_active: boolean;
    profil?: {
        nama_lengkap: string;
        jenis_kelamin: string;
        alamat: string;
    }
}

interface Props {
    warga: {
        data: Warga[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function WargaIndex({ warga, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [formOpen, setFormOpen] = useState(false);
    const [selectedWarga, setSelectedWarga] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(admin.warga.index().url, { search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleAdd = () => {
        setSelectedWarga(null);
        setFormOpen(true);
    };

    const handleEdit = (w: Warga) => {
        setSelectedWarga(w);
        setFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data warga ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(admin.warga.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Manajemen Data Warga" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 mt-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Data Warga Nagari</h1>
                        <p className="text-sm text-slate-500 font-inter">Kelola database kependudukan dan akses akun warga.</p>
                    </div>
                    <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Warga
                    </Button>
                </div>

                <div className="px-4 pb-8">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                        <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Cari NIK atau Nama..." 
                                    className="pl-9 h-9 bg-white"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </form>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 font-normal unrounded">
                                    Total: {warga.data.length} Warga
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-[300px]">Identitas Warga</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Status Akun</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {warga.data.length > 0 ? warga.data.map((item) => (
                                        <TableRow key={item.id} className="group border-slate-50 hover:bg-blue-50/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0 ring-2 ring-white">
                                                        {item.profil?.nama_lengkap?.charAt(0) || <User className="h-4 w-4 text-slate-400" />}
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">{item.profil?.nama_lengkap || 'Tidak ada nama'}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                                                            {item.profil?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        {item.email || '-'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Smartphone className="h-3 w-3 text-slate-400" />
                                                        {item.phone || '-'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.is_active ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none text-[10px] h-5 hover:bg-emerald-50">
                                                        <ShieldCheck className="h-3 w-3 mr-1" /> AKTIF
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-50 text-red-600 border-none shadow-none text-[10px] h-5 hover:bg-red-50">
                                                        <ShieldAlert className="h-3 w-3 mr-1" /> SUSPENDED
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                                                    {item.nik}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={admin.warga.show(item.id).url}>
                                                                <Eye className="h-4 w-4 mr-2" /> Detail Profil
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(item)} className="cursor-pointer">
                                                            <Edit2 className="h-4 w-4 mr-2" /> Edit Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                                            <Trash2 className="h-4 w-4 mr-2" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                                Data warga tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    
                    <div className="mt-4 flex items-center justify-between px-2 pb-4">
                        <p className="text-xs text-slate-500 font-medium">
                            Menampilkan {warga.data.length} dari total data terdaftar
                        </p>
                    </div>
                </div>
            </div>

            <WargaForm 
                open={formOpen} 
                onOpenChange={setFormOpen} 
                warga={selectedWarga} 
            />
        </>
    );
}

WargaIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Data Warga', href: '#' }]}>{page}</AppLayout>
);
