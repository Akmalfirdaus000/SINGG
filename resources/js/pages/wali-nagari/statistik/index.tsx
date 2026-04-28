import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Download, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatistikProps {
    pengaduan_stats: any[];
    dokumen_stats: any[];
}

export default function StatistikIndex({ pengaduan_stats, dokumen_stats }: StatistikProps) {
    const [activeTab, setActiveTab] = useState<'layanan' | 'pengaduan'>('layanan');

    const exportToHtml = () => {
        const title = activeTab === 'layanan' ? 'Laporan Statistik Layanan Administrasi' : 'Laporan Statistik Pengaduan Masyarakat';
        const data = activeTab === 'layanan' ? dokumen_stats : pengaduan_stats;
        const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { margin: 0; color: #1e3a8a; }
                    .meta { color: #666; font-size: 0.9em; margin-top: 5px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f8fafc; color: #1e3a8a; }
                    .footer { margin-top: 50px; font-size: 0.8em; text-align: center; color: #999; }
                    .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
                    .badge-blue { background: #dbeafe; color: #1e40af; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <div class="meta">Nagari Gasan Gadang - Dicetak pada ${date}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Parameter / Jenis</th>
                            <th>Total Volume</th>
                            <th>Status / Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.nama_tampilan || item.status.replace(/_/g, ' ').toUpperCase()}</td>
                                <td><strong>${item.total}</strong></td>
                                <td><span class="badge badge-blue">Aktif Terdata</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    Dokumen ini digenerate secara otomatis oleh Sistem Informasi Nagari Guguak (SINGG)
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan_${activeTab}_${new Date().getTime()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Head title="Statistik & Laporan" />

            <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-6 sm:px-6 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Statistik & Laporan 📊
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Analisis data pelayanan dan monitoring kinerja Nagari Gasan Gadang.
                        </p>
                    </div>
                    <Button onClick={exportToHtml} className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-lg w-full md:w-auto">
                        <Download className="h-4 w-4" />
                        Export Laporan (.html)
                    </Button>
                </div>

                {/* Tabs Menu */}
                <div className="flex p-1 bg-slate-100 rounded-xl w-full max-w-md mx-auto">
                    <button 
                        onClick={() => setActiveTab('layanan')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'layanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText className="h-4 w-4" />
                        Layanan Administrasi
                    </button>
                    <button 
                        onClick={() => setActiveTab('pengaduan')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'pengaduan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Activity className="h-4 w-4" />
                        Pengaduan Masyarakat
                    </button>
                </div>

                <div className="grid gap-8">
                    {activeTab === 'layanan' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-none shadow-xl ring-1 ring-slate-200">
                                <CardHeader className="bg-blue-50/50 border-b border-blue-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                                            <BarChart3 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900">Volume Pelayanan Administrasi</CardTitle>
                                            <CardDescription>Berdasarkan jenis dokumen yang diajukan masyarakat</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8">
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {dokumen_stats.map((stat, idx) => (
                                            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3 group hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 group-hover:border-blue-400 group-hover:text-blue-600">ID: #{idx+1}</Badge>
                                                    <span className="text-3xl font-black text-slate-900 group-hover:text-blue-700">{stat.total}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-700 line-clamp-1">{stat.nama_tampilan}</h4>
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                                                        style={{ width: `${Math.min(100, (stat.total / 50) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {dokumen_stats.length === 0 && (
                                            <div className="col-span-full py-12 text-center">
                                                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500 font-medium">Belum ada data pelayanan administrasi.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <Card className="border-none shadow-xl ring-1 ring-slate-200">
                                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-600 rounded-lg text-white">
                                            <PieChart className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900">Status Penanganan Aduan</CardTitle>
                                            <CardDescription>Distribusi status penyelesaian pengaduan warga</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8">
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {pengaduan_stats.map((stat, idx) => (
                                            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3 group hover:bg-emerald-50/50 hover:border-emerald-200 transition-all">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 group-hover:border-emerald-400 group-hover:text-emerald-600 capitalize">{stat.status.replace('_', ' ')}</Badge>
                                                    <span className="text-3xl font-black text-slate-900 group-hover:text-emerald-700">{stat.total}</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mt-auto">
                                                    <div 
                                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                                        style={{ width: `${Math.min(100, (stat.total / 100) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {pengaduan_stats.length === 0 && (
                                            <div className="col-span-full py-12 text-center">
                                                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500 font-medium">Belum ada data pengaduan masyarakat.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Card className="border-none shadow-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <CheckCircle2 className="h-32 w-32" />
                        </div>
                        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black mb-2 italic">Nagari Gasan Gadang Mandiri</h3>
                                <p className="text-blue-100 max-w-lg font-medium">
                                    Terus tingkatkan efisiensi pelayanan melalui digitalisasi SINGG. Statistik ini diperbarui secara real-time berdasarkan aktivitas admin dan warga.
                                </p>
                            </div>
                            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold border-none shadow-lg">
                                Lihat Laporan Tahunan
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

StatistikIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Statistik & Laporan', href: '#' }]}>{page}</AppLayout>
);
