import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MapPin, 
    Calendar,
    User,
    Shield,
    Image as ImageIcon,
    FileText,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface Lampiran {
    id: string;
    url_file: string;
    nama_file: string;
}

interface Riwayat {
    id: string;
    status_baru: string;
    catatan: string;
    created_at: string;
    user: {
        profil: {
            nama_lengkap: string;
        };
    };
}

interface Pengaduan {
    id: string;
    nomor_pengaduan: string;
    judul: string;
    deskripsi: string;
    status: string;
    prioritas: string;
    alamat_lokasi: string;
    progres: number;
    created_at: string;
    is_anonim: boolean;
    is_publik: boolean;
    kategori: {
        nama_tampilan: string;
    };
    lampiran: Lampiran[];
    riwayat: Riwayat[];
}

interface Props {
    pengaduan: Pengaduan;
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    'menunggu_verifikasi': { label: 'Menunggu Verifikasi', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
    'terverifikasi': { label: 'Terverifikasi', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: CheckCircle2 },
    'dalam_proses': { label: 'Sedang Diproses', color: 'bg-indigo-50 text-indigo-600 border-indigo-200', icon: AlertCircle },
    'selesai': { label: 'Selesai', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
    'ditolak': { label: 'Ditolak', color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle },
};

export default function PengaduanShow({ pengaduan }: Props) {
    const status = statusMap[pengaduan.status] || { label: pengaduan.status, color: 'bg-slate-100', icon: Clock };
    const StatusIcon = status.icon;



    return (
        <>
            <Head title={`Detail Pengaduan - ${pengaduan.nomor_pengaduan}`} />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Link 
                        href={warga.pengaduan.index().url} 
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors group"
                    >
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-slate-400">ID: {pengaduan.nomor_pengaduan}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Status */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 unrounded">
                                    {pengaduan.kategori.nama_tampilan}
                                </Badge>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold ${status.color}`}>
                                    <StatusIcon className="h-4 w-4" />
                                    {status.label}
                                </div>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">{pengaduan.judul}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    Dibuat pada {new Date(pengaduan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                {pengaduan.is_anonim && (
                                    <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                                        <Shield className="h-4 w-4" />
                                        Pelaporan Anonim
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                    Deskripsi Laporan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {pengaduan.deskripsi}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Attachments */}
                        {pengaduan.lampiran.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-outfit">
                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                    Lampiran Foto
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {pengaduan.lampiran.map((img) => (
                                        <a 
                                            key={img.id} 
                                            href={img.url_file} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="aspect-square rounded-2xl overflow-hidden ring-1 ring-slate-200 group hover:ring-blue-400 transition-all"
                                        >
                                            <img 
                                                src={img.url_file} 
                                                alt={img.nama_file} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline / History */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-outfit">
                                <Clock className="h-5 w-5 text-slate-400" />
                                Riwayat & Pembaruan
                            </h3>
                            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                                {pengaduan.riwayat.map((step, i) => (
                                    <div key={step.id} className="relative pl-12">
                                        <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm
                                            ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            {i === 0 ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-900 capitalize">
                                                    {step.status_baru.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(step.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">{step.catatan}</p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                    {step.user.profil.nama_lengkap.charAt(0)}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500">{step.user.profil.nama_lengkap}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Progress Tracker */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white">
                            <CardHeader className="p-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Status Laporan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-3xl font-black text-slate-900 font-outfit">{pengaduan.progres}%</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Selesai</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${pengaduan.status === 'selesai' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                            style={{ width: `${pengaduan.progres}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lokasi</p>
                                            <p className="text-sm text-slate-700 font-medium">{pengaduan.alamat_lokasi || 'Tidak disertakan'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Shield className="h-5 w-5 text-slate-400 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visibilitas</p>
                                            <p className="text-sm text-slate-700 font-medium">{pengaduan.is_publik ? 'Publik' : 'Privat'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Card */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-blue-600 text-white overflow-hidden relative">
                            <CardContent className="p-6 space-y-4 relative z-10">
                                <MessageCircle className="h-10 w-10 text-blue-400 opacity-50" />
                                <h3 className="font-bold">Butuh Bantuan?</h3>
                                <p className="text-sm text-blue-100">Jika Anda memiliki pertanyaan lebih lanjut mengenai laporan ini, silakan hubungi admin melalui pusat pesan.</p>
                                <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50" variant="secondary">
                                    <Link href={warga.pesan.start({ type: 'pengaduan', id: pengaduan.id } as any).url}>
                                        Kirim Pesan
                                    </Link>
                                </Button>
                            </CardContent>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PengaduanShow.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Pengaduan Saya', href: '/pengaduan' },
        { title: 'Detail Laporan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
