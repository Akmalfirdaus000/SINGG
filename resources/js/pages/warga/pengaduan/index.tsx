import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight,
    MapPin,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import warga from '@/routes/warga';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface Pengaduan {
    id: string;
    nomor_pengaduan: string;
    judul: string;
    status: string;
    created_at: string;
    kategori: {
        nama_tampilan: string;
    };
    progres: number;
}

interface Props {
    pengaduans: {
        data: Pengaduan[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    'draft': { label: 'Draft', color: 'bg-slate-100 text-slate-600', icon: Clock },
    'menunggu_verifikasi': { label: 'Menunggu', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
    'terverifikasi': { label: 'Terverifikasi', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: AlertCircle },
    'dalam_proses': { label: 'Diproses', color: 'bg-indigo-50 text-indigo-600 border-indigo-200', icon: Activity },
    'selesai': { label: 'Selesai', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
    'ditolak': { label: 'Ditolak', color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle },
};

function Activity(props: any) {
    return <Clock {...props} />; // Placeholder icon if 'Activity' is missing
}

export default function PengaduanIndex({ pengaduans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(warga.pengaduan.index({ query: { search, status: filters.status } }).url, {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleStatusChange = (value: string) => {
        router.get(warga.pengaduan.index({ query: { search, status: value === 'semua' ? '' : value } }).url);
    };



    return (
        <>
            <Head title="Daftar Pengaduan Saya" />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">Pengaduan Saya</h1>
                        <p className="text-slate-500 font-inter">Pantau perkembangan laporan dan aduan Anda di sini.</p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 shadow-xl shadow-blue-100 group">
                        <Link href={warga.pengaduan.create().url}>
                            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Buat Pengaduan Baru
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                        <Input 
                            placeholder="Cari berdasarkan judul laporan..." 
                            className="pl-12 h-11 bg-white border-slate-200 rounded-2xl"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </form>
                    <Select value={filters.status || 'semua'} onValueChange={handleStatusChange}>
                        <SelectTrigger className="h-11 w-full md:w-[200px] bg-white border-slate-200 rounded-2xl">
                            <Filter className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Status</SelectItem>
                            {Object.entries(statusMap).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {pengaduans.data.length > 0 ? pengaduans.data.map((item) => {
                        const status = statusMap[item.status] || { label: item.status, color: 'bg-slate-100', icon: AlertCircle };
                        const StatusIcon = status.icon;

                        return (
                            <Link key={item.id} href={warga.pengaduan.show(item.id).url}>
                                <Card className="border-none shadow-sm ring-1 ring-slate-100 hover:ring-2 hover:ring-blue-100 transition-all group overflow-hidden bg-white">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            {/* Status Badge Sidebar (Visual) */}
                                            <div className={`w-2 md:self-stretch ${status.color.split(' ')[0]}`}></div>
                                            
                                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-500 font-medium px-3 py-0.5 border-slate-100">
                                                            {item.kategori.nama_tampilan}
                                                        </Badge>
                                                        <span className="text-xs text-slate-400 font-mono">{item.nomor_pengaduan}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {item.judul}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.color}`}>
                                                        <StatusIcon className="h-4 w-4" />
                                                        {status.label}
                                                    </div>
                                                    
                                                    {/* Progress Bar Mini */}
                                                    <div className="w-full space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            <span>Progres</span>
                                                            <span>{item.progres}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full transition-all duration-500 ${item.status === 'selesai' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                                style={{ width: `${item.progres}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="hidden md:block">
                                                    <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-blue-400 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    }) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                                <AlertCircle className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Belum ada pengaduan</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                Anda belum memiliki riwayat pengaduan. Klik tombol di atas untuk membuat laporan baru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

PengaduanIndex.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[{ title: 'Pengaduan Saya', href: '#' }]}>{page}</AppSidebarLayout>
);
