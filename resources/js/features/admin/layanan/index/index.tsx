import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { 
    Search, 
    Filter, 
    Eye, 
    Trash,
    ChevronLeft, 
    ChevronRight,
    FileText,
    User,
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
import { StatusBadge } from '../components/status-badge';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface Document {
    id: string;
    nomor_dokumen: string;
    nama_pemohon: string;
    nik_pemohon: string;
    status: string;
    created_at: string;
    jenis_dokumen: {
        nama_tampilan: string;
    };
}

interface ListPageProps {
    documents: {
        data: Document[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    jenisDokumen: any[];
    filters: {
        status?: string;
        jenis?: string;
        search?: string;
    };
}

export function LayananListPage({ documents, jenisDokumen, filters }: ListPageProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'all') delete newFilters[key as keyof typeof filters];
        
        router.get(admin.layanan.index().url, newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus permohonan ini?')) {
            router.delete(admin.layanan.destroy(id).url);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Proses Permohonan</h1>
                    <p className="text-muted-foreground">Verifikasi dan kelola pengajuan dokumen warga.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-3 border-b border-slate-50">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari nomor/nama..."
                                    className="w-[200px] pl-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>

                            <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
                                <SelectTrigger className="w-[180px] bg-white border-slate-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                                    <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                                    <SelectItem value="dalam_tinjauan">Dalam Tinjauan</SelectItem>
                                    <SelectItem value="disetujui">Disetujui</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                    <SelectItem value="ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.jenis || 'all'} onValueChange={(v) => handleFilterChange('jenis', v)}>
                                <SelectTrigger className="w-[220px] bg-white border-slate-200 text-left">
                                    <SelectValue placeholder="Jenis Dokumen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Jenis</SelectItem>
                                    {jenisDokumen.map((j) => (
                                        <SelectItem key={j.id} value={j.id}>{j.nama_tampilan}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-slate-50/50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Dokumen</th>
                                    <th className="px-6 py-4 font-semibold">Pemohon</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold">Tgl Pengajuan</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {documents.data.length > 0 ? (
                                    documents.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {item.nomor_dokumen}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <FileText className="h-3 w-3" />
                                                    {item.jenis_dokumen.nama_tampilan}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900 font-medium">{item.nama_pemohon}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {item.nik_pemohon}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild className="hover:bg-blue-50 hover:text-blue-600">
                                                        <Link href={admin.layanan.show(item.id).url}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="hover:bg-red-50 text-slate-400 hover:text-red-600"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            Tidak ada permohonan yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                {documents.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            Menampilkan halaman {documents.current_page} dari {documents.last_page}
                        </div>
                        <div className="flex gap-2">
                            {documents.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    disabled={!link.url || link.active}
                                    asChild={!!link.url}
                                    className={cn(
                                        "h-8 min-w-[32px] px-2",
                                        link.active && "bg-blue-50 border-blue-200 text-blue-600"
                                    )}
                                >
                                    {link.url ? (
                                        <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
