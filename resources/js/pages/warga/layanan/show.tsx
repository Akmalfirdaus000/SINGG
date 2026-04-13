import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Clock, 
    CheckCircle2, 
    XCircle,
    FileText,
    Calendar,
    Download,
    User,
    MapPin,
    AlertCircle,
    Info,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';

interface Lampiran {
    id: string;
    nama_file: string;
    url_file: string;
    tipe_file: string;
    nama_persyaratan: string;
}

interface HistoryItem {
    id: string;
    status_baru: string;
    catatan: string;
    created_at: string;
    user: {
        profil: {
            nama_lengkap: string;
        }
    }
}

interface Document {
    id: string;
    nomor_dokumen: string;
    status: string;
    nama_pemohon: string;
    nik_pemohon: string;
    alamat_pemohon: string;
    telepon_pemohon: string;
    created_at: string;
    perkiraan_tanggal_selesai: string;
    url_dokumen_dihasilkan: string;
    jenis_dokumen: {
        nama_tampilan: string;
        hari_proses: number;
    };
    lampiran: Lampiran[];
    riwayat: HistoryItem[];
}

interface Props {
    dokumen: Document;
}

const statusMap: any = {
    'menunggu_verifikasi': { label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    'terverifikasi': { label: 'Terverifikasi', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    'dalam_tinjauan': { label: 'Dalam Tinjauan', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    'disetujui': { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    'selesai': { label: 'Selesai', color: 'bg-green-100 text-green-700 border-green-200' },
    'ditolak': { label: 'Ditolak', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export default function LayananShow({ dokumen }: Props) {
    return (
        <>
            <Head title={`Detail Permohonan ${dokumen.nomor_dokumen}`} />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                {/* Back Link */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="rounded-full text-slate-500 hover:text-blue-600">
                        <Link href={warga.layanan.index().url}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Kembali ke Layanan
                        </Link>
                    </Button>
                </div>

                {/* Main Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={`border-none ${statusMap[dokumen.status]?.color} px-4 py-1 text-xs font-bold`}>
                                {statusMap[dokumen.status]?.label}
                            </Badge>
                            <span className="text-sm font-mono text-slate-400">#{dokumen.nomor_dokumen}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
                            {dokumen.jenis_dokumen.nama_tampilan}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-inter">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="font-bold text-slate-700">Diajukan:</span>
                                {new Date(dokumen.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="font-bold text-slate-700">Estimasi:</span>
                                {dokumen.perkiraan_tanggal_selesai ? 
                                    new Date(dokumen.perkiraan_tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                                    'Diproses'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {dokumen.url_dokumen_dihasilkan && (
                             <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 h-auto shadow-xl shadow-blue-100 transition-all group">
                                <a href={dokumen.url_dokumen_dihasilkan} target="_blank" rel="noopener noreferrer">
                                   <div className="flex flex-col items-center gap-1">
                                       <Download className="h-6 w-6 group-hover:translate-y-1 transition-transform" />
                                       <span className="text-xs font-bold uppercase tracking-widest">Unduh Hasil</span>
                                   </div>
                                </a>
                             </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details & Attachments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600">Info Pemohon</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Nama Lengkap</p>
                                        <p className="text-sm font-semibold text-slate-800">{dokumen.nama_pemohon}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">NIK</p>
                                        <p className="text-sm font-mono text-slate-800">{dokumen.nik_pemohon}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Nomor Telepon</p>
                                        <p className="text-sm text-slate-800">{dokumen.telepon_pemohon || '-'}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600">Alamat Korespondensi</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 h-full">
                                    <p className="text-sm text-slate-700 leading-relaxed italic">
                                        "{dokumen.alamat_pemohon}"
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Official Document Preview */}
                        {dokumen.url_dokumen_dihasilkan && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-slate-900 border-b border-slate-800 p-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-400" />
                                        <CardTitle className="text-lg font-bold font-outfit text-white">Hasil Dokumen Resmi</CardTitle>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                                        <a href={dokumen.url_dokumen_dihasilkan} target="_blank">Lihat Layar Penuh</a>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0 bg-slate-100">
                                    <iframe 
                                        src={dokumen.url_dokumen_dihasilkan} 
                                        className="w-full h-[600px] border-none shadow-inner"
                                        title="Pratinjau Hasil"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Attachments */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <CardTitle className="text-lg font-bold font-outfit">Lampiran Permohonan</CardTitle>
                                </div>
                                <Badge className="bg-slate-100 text-slate-600 border-none">{dokumen.lampiran.length} File</Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {dokumen.lampiran.map((file) => (
                                        <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{file.nama_persyaratan}</p>
                                                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{file.nama_file}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                                <a href={file.url_file} target="_blank" rel="noopener noreferrer">Buka File</a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Status Tracking/Timeline */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white p-6">
                                <div className="flex items-center gap-3">
                                    <History className="h-5 w-5 text-blue-400" />
                                    <CardTitle className="text-lg font-bold font-outfit">Log Perjalanan Dokumen</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                    {dokumen.riwayat.map((log, idx) => (
                                        <div key={log.id} className="relative pl-10">
                                            <div className={`absolute left-0 top-0 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${idx === 0 ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                                 {idx === 0 && <AlertCircle className="h-3 w-3 text-white" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge variant="outline" className={`text-[10px] px-2 py-0 border-none ${statusMap[log.status_baru]?.color}`}>
                                                        {statusMap[log.status_baru]?.label}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-400 font-inter">
                                                        {new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800 font-inter leading-none pt-1">
                                                    {idx === 0 ? 'Update Terbaru' : 'Status Terarsip'}
                                                </p>
                                                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 italic mt-2">
                                                   "{log.catatan}"
                                                </p>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-slate-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oleh: {log.user?.profil?.nama_lengkap || 'System'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                            <div className="relative z-10 space-y-3">
                                <div className="p-2 bg-white/20 rounded-xl w-fit">
                                    <Info className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-lg font-outfit leading-tight">Butuh bantuan terkait pengajuan?</h4>
                                <p className="text-sm text-blue-50 opacity-90 font-inter">Kirim pesan langsung ke admin melalui Pusat Pesan kami.</p>
                                <Button asChild variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold py-6">
                                    <Link href={warga.pesan.start({ type: 'layanan', id: dokumen.id } as any).url}>
                                        Tanya Admin
                                    </Link>
                                </Button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:rotate-12 transition-transform">
                                <FileText size={150} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

LayananShow.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Layanan Mandiri', href: '/layanan' },
        { title: 'Detail Permohonan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
