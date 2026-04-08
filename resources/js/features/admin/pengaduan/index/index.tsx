import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Eye, 
    Trash,
    ChevronLeft, 
    ChevronRight,
    MapPin,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PrioritasBadge } from '../components/status-badge';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface Pengaduan {
    id: string;
    nomor_pengaduan: string;
    judul: string;
    status: any;
    prioritas: any;
    created_at: string;
    progres: number;
    user: {
        profil: {
            nama_lengkap: string;
        }
    };
    kategori: {
        nama_tampilan: string;
    };
}

interface ListPageProps {
    pengaduans: {
        data: Pengaduan[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    kategori: any[];
    filters: {
        status?: string;
        kategori?: string;
        search?: string;
    };
    title?: string;
    description?: string;
    isRiwayat?: boolean;
}

export function PengaduanListPage({ 
    pengaduans, 
    kategori, 
    filters,
    title = "Manajemen Pengaduan",
    description = "Kelola dan pantau semua laporan dari warga.",
    isRiwayat = false
}: ListPageProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'all') delete (newFilters as any)[key];
        
        router.get(admin.pengaduan.index({ query: newFilters }).url, {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = () => {
        handleFilterChange('search', search);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-3 text-center md:text-left">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Cari nomor pengaduan atau judul..." 
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {!isRiwayat ? (
                                    <>
                                        <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                                        <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                                        <SelectItem value="dalam_proses">Dalam Proses</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>

                        <Select value={filters.kategori || 'all'} onValueChange={(v) => handleFilterChange('kategori', v)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {kategori.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.nama_tampilan}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="default" onClick={handleSearch}>Filter</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-y border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Pengaduan</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Pelapor</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pengaduans.data.length > 0 ? (
                                    pengaduans.data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs font-bold text-blue-600">{item.nomor_pengaduan}</span>
                                                    <span className="font-medium text-slate-900 line-clamp-1">{item.judul}</span>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <PrioritasBadge prioritas={item.prioritas} className="scale-75 origin-left" />
                                                        {item.progres > 0 && (
                                                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-blue-500" style={{ width: `${item.progres}%` }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-600">{item.kategori.nama_tampilan}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.user.profil.nama_lengkap}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={admin.pengaduan.show(item.id).url}>
                                                            <Eye className="h-4 w-4 text-slate-500" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => {
                                                            if (window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini secara permanen?')) {
                                                                router.delete(admin.pengaduan.destroy(item.id).url);
                                                            }
                                                        }}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="h-8 w-8 text-slate-300" />
                                                <p className="text-slate-500 font-medium">Tidak ada pengaduan ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Pagination */}
                    {pengaduans.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                            <div className="text-sm text-slate-500">
                                Menampilkan Halaman <span className="font-medium text-slate-900">{pengaduans.current_page}</span> dari <span className="font-medium text-slate-900">{pengaduans.last_page}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={pengaduans.current_page === 1}
                                    onClick={() => router.get(pengaduans.links[0].url)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    disabled={pengaduans.current_page === pengaduans.last_page}
                                    onClick={() => router.get(pengaduans.links[pengaduans.links.length - 1].url)}
                                >
                                    Selanjutnya
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
