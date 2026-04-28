import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Users, FileText, MessageSquare, CheckCircle, ArrowRight, Wallet, PieChart, TrendingUp, Star, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Auth } from '@/types';
import { Link } from '@inertiajs/react';
import { walinagari } from '@/routes';

interface DashboardProps {
    stats: {
        total_warga: number;
        pengajuan_pending: number;
        pengaduan_aktif: number;
        dokumen_selesai: number;
        total_pendapatan: number;
        kepuasan_warga: number;
    };
    demografi: {
        laki_laki: number;
        perempuan: number;
    };
    trends: any[];
    latest: {
        pengaduan: any[];
        dokumen: any[];
    };
}

export default function WaliNagariDashboard({ stats, demografi, trends, latest }: DashboardProps) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;

    const mainStats = [
        { title: 'Total Populasi', value: stats.total_warga, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Pendapatan Layanan', value: `Rp ${new Intl.NumberFormat('id-ID').format(stats.total_pendapatan)}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Kepuasan Warga', value: stats.kepuasan_warga.toFixed(1) + '/5.0', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Petugas Aktif', value: '12 Org', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const demografiTotal = demografi.laki_laki + demografi.perempuan || 1;
    const lpPercent = Math.round((demografi.laki_laki / demografiTotal) * 100);
    const prPercent = Math.round((demografi.perempuan / demografiTotal) * 100);

    return (
        <>
            <Head title="Executive Dashboard Wali Nagari" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {/* Executive Header */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                             <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl font-outfit">
                                Panel Eksekutif Nagari 🏛️
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                                Laporan Kinerja & Ringkasan Strategis Pemerintahan Nagari.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {mainStats.map((item, index) => (
                        <Card key={index} className="border-none shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md dark:ring-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`${item.bg} p-3 rounded-2xl`}>
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.title}</p>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1 antialiased">{item.value}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Demographics & Trends Middle Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Demography Visual */}
                        <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-indigo-500" />
                                    Komposisi Penduduk
                                </CardTitle>
                                <CardDescription>Berdasarkan data profil terdaftar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex h-12 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                                        <div 
                                            className="bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" 
                                            style={{ width: `${lpPercent}%` }}
                                        >
                                            {lpPercent > 10 ? `LAKI-LAKI ${lpPercent}%` : ''}
                                        </div>
                                        <div 
                                            className="bg-pink-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" 
                                            style={{ width: `${prPercent}%` }}
                                        >
                                            {prPercent > 10 ? `PEREMPUAN ${prPercent}%` : ''}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                                            <p className="text-xs font-bold text-blue-600 uppercase">Laki-laki</p>
                                            <p className="text-2xl font-black text-blue-900 dark:text-blue-200">{demografi.laki_laki} <span className="text-xs font-normal text-blue-500">Jiwa</span></p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 dark:bg-pink-900/10 dark:border-pink-900/30">
                                            <p className="text-xs font-bold text-pink-600 uppercase">Perempuan</p>
                                            <p className="text-2xl font-black text-pink-900 dark:text-pink-200">{demografi.perempuan} <span className="text-xs font-normal text-pink-500">Jiwa</span></p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 md:grid-cols-2">
                             {/* Operational Stats */}
                            <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Antrean Layanan</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-4xl font-black text-amber-600">{stats.pengajuan_pending}</h2>
                                        <p className="text-xs text-gray-400 mt-1">Permohonan TTD</p>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-full dark:bg-amber-900/20">
                                        <FileText className="h-8 w-8 text-amber-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Aduan Tertunda</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-4xl font-black text-red-600">{stats.pengaduan_aktif}</h2>
                                        <p className="text-xs text-gray-400 mt-1">Butuh Tindakan</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-full dark:bg-red-900/20">
                                        <MessageSquare className="h-8 w-8 text-red-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Latest Activities */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 flex flex-col">
                        <CardHeader className="border-b border-gray-50 dark:border-gray-800">
                            <CardTitle className="text-lg font-bold">Aktivitas Terkini</CardTitle>
                            <CardDescription>Log terpadu pelayanan nagari</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {latest.dokumen.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-900">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4 border-blue-200 text-blue-600">Layanan</Badge>
                                            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{item.jenis_dokumen?.nama_tampilan}</p>
                                        <p className="text-xs text-gray-500 italic">Oleh: {item.nama_pemohon}</p>
                                    </div>
                                ))}
                                {latest.pengaduan.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-900">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4 border-red-200 text-red-600">Aduan</Badge>
                                            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-200 truncate">{item.judul}</p>
                                        <p className="text-xs text-gray-500 italic">{item.kategori?.nama_tampilan}</p>
                                    </div>
                                ))}
                                {(latest.dokumen.length === 0 && latest.pengaduan.length === 0) && (
                                    <div className="p-12 text-center">
                                        <Info className="h-12 w-12 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400 font-medium">Belum ada aktivitas baru hari ini.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                             <Button variant="outline" className="w-full text-xs font-bold gap-2" asChild>
                                <Link href="/wali-nagari/statistik">
                                    Analisis Lanjutan <ArrowRight className="h-4 w-4" />
                                </Link>
                             </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

WaliNagariDashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Executive Overview', href: '#' }]}>{page}</AppLayout>
);
