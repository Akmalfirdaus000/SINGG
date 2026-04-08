import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatistikFeatureProps {
    summary: {
        pelayanan: {
            total: number;
            selesai: number;
            proses: number;
        };
        pengaduan: {
            total: number;
            selesai: number;
        };
    };
    charts: {
        trend: any[];
        distribusi: any[];
        performa: any[];
    };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StatistikFeature({ summary, charts }: StatistikFeatureProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                <Card className="relative overflow-hidden shadow-sm border-none bg-blue-500 text-white">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-blue-100 text-xs font-semibold uppercase italic">Total Pelayanan</CardDescription>
                        <CardTitle className="text-3xl font-bold sm:text-4xl">{summary.pelayanan.total}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-center gap-2 text-blue-100 text-xs">
                            <FileText className="h-4 w-4" />
                            <span>Total berkas administrasi</span>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <FileText className="h-16 w-16" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden shadow-sm border-none bg-emerald-500 text-white">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-emerald-100 text-xs font-semibold uppercase italic">Pelayanan Selesai</CardDescription>
                        <CardTitle className="text-3xl font-bold sm:text-4xl">{summary.pelayanan.selesai}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-center gap-2 text-emerald-100 text-xs">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Berkas berhasil diproses</span>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden shadow-sm border-none bg-amber-500 text-white">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-amber-100 text-xs font-semibold uppercase italic">Dalam Proses</CardDescription>
                        <CardTitle className="text-3xl font-bold sm:text-4xl">{summary.pelayanan.proses}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-center gap-2 text-amber-100 text-xs">
                            <Clock className="h-4 w-4" />
                            <span>Menunggu tindak lanjut</span>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Clock className="h-16 w-16" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden shadow-sm border-none bg-rose-500 text-white">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-rose-100 text-xs font-semibold uppercase italic">Total Pengaduan</CardDescription>
                        <CardTitle className="text-3xl font-bold sm:text-4xl">{summary.pengaduan.total}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-center gap-2 text-rose-100 text-xs">
                            <AlertCircle className="h-4 w-4" />
                            <span>Laporan dari masyarakat</span>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <AlertCircle className="h-16 w-16" />
                    </div>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Tren Pelayanan 6 Bulan Terakhir
                        </CardTitle>
                        <CardDescription>Grafik jumlah permohonan layanan per bulan</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.trend}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Distribusi Jenis Layanan
                        </CardTitle>
                        <CardDescription>Persentase layanan berdasarkan kategori</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {charts.distribusi.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.distribusi}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {charts.distribusi.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500 italic">
                                Belum ada data distribusi
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="shadow-sm lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-emerald-500" />
                            Aktivitas 7 Hari Terakhir
                        </CardTitle>
                        <CardDescription>Performa harian proses pelayanan</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.performa}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                    <CardHeader>
                        <CardTitle>Insight Pelayanan</CardTitle>
                        <CardDescription>Ringkasan performa sistem Nagari Gasan Gadang</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                <div className="rounded-full bg-blue-100 dark:bg-blue-800 p-2 text-blue-600 dark:text-blue-300">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100">Laju Penyelesaian</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Rata-rata {summary.pelayanan.total > 0 ? ((summary.pelayanan.selesai / summary.pelayanan.total) * 100).toFixed(1) : 0}% 
                                        dari permohonan telah berhasil diselesaikan dalam kurun waktu target.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                                <div className="rounded-full bg-orange-100 dark:bg-orange-800 p-2 text-orange-600 dark:text-orange-300">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-orange-900 dark:text-orange-100">Pengaduan Masuk</h4>
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                        Terdapat {summary.pengaduan.total - summary.pengaduan.selesai} pengaduan yang masih membutuhkan respon atau dalam penanganan petugas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
