import { Head, Link } from '@inertiajs/react';
import { 
    Clock, 
    ChevronRight, 
    Search,
    AlertCircle,
    ArrowLeft,
    FileText,
    Calendar,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';

interface Document {
    id: string;
    nomor_dokumen: string;
    status: string;
    created_at: string;
    perkiraan_tanggal_selesai: string;
    jenis_dokumen: {
        nama_tampilan: string;
    };
}

interface Props {
    documents: {
        data: Document[];
        links: any[];
    };
}

const statusMap: any = {
    'menunggu_verifikasi': { label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-700 pill-amber' },
    'terverifikasi': { label: 'Terverifikasi', color: 'bg-blue-100 text-blue-700 pill-blue' },
    'dalam_tinjauan': { label: 'Dalam Tinjauan', color: 'bg-indigo-100 text-indigo-700 pill-indigo' },
};

export default function LayananStatus({ documents }: Props) {
    return (
        <>
            <Head title="Lacak Permohonan" />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                             <Link href={warga.layanan.index().url} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Katalog Layanan
                             </Link>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">Lacak Permohonan Aktif</h1>
                        <p className="text-slate-500 font-inter">Pantau progres pengajuan dokumen Anda secara real-time.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 shadow-sm shadow-blue-100/50">
                            <Activity className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Total Aktif</p>
                                <p className="text-xl font-black text-blue-900 leading-none">{documents.data.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document List */}
                <div className="space-y-4">
                    {documents.data.length > 0 ? (
                        documents.data.map((doc) => (
                            <Card key={doc.id} className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-blue-500/30 transition-all rounded-2xl overflow-hidden group">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Sidebar (Desktop) */}
                                        <div className={`w-2 md:w-3 ${statusMap[doc.status]?.color.split(' ')[0]}`} />
                                        
                                        <div className="p-6 flex-grow grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                            <div className="md:col-span-2 space-y-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={`border-none ${statusMap[doc.status]?.color}`}>
                                                        {statusMap[doc.status]?.label}
                                                    </Badge>
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                                        #{doc.nomor_dokumen}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                                                    {doc.jenis_dokumen.nama_tampilan}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 font-inter pt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(doc.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Selesai</p>
                                                <div className="flex items-center gap-2 text-slate-700 font-semibold font-inter">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    {doc.perkiraan_tanggal_selesai ? 
                                                        new Date(doc.perkiraan_tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 
                                                        'Sedang Dihitung'}
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button variant="ghost" asChild className="rounded-xl h-12 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:px-6 transition-all">
                                                    <Link href={warga.layanan.show(doc.id).url}>
                                                        Detail Progres
                                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
                            <CardContent className="space-y-4 pt-6">
                                <div className="inline-flex p-6 bg-slate-100 rounded-full text-slate-300">
                                    <Clock size={64} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-600 font-outfit">Tidak Ada Permohonan Aktif</h3>
                                <p className="text-slate-400 max-w-sm mx-auto font-inter leading-relaxed">
                                    Anda saat ini tidak memiliki permohonan yang sedang diproses. Silakan ajukan melalui katalog layanan.
                                </p>
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-blue-200 transition-all font-bold">
                                    <Link href={warga.layanan.index().url}>
                                        Ajukan Sekarang
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Helpful Note */}
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex gap-4">
                    <div className="p-3 bg-white rounded-2xl text-indigo-600 h-fit shadow-sm">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-indigo-900">Catatan Waktu Proses</h4>
                        <p className="text-sm text-indigo-700 leading-relaxed font-inter">
                            Estimasi waktu penyelesaian dapat berubah tergantung kelengkapan persyaratan yang Anda berikan. Pastikan untuk mengecek WhatsApp/Email untuk pemberitahuan lebih lanjut dari admin.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

LayananStatus.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Layanan Mandiri', href: '/layanan' },
        { title: 'Lacak Permohonan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
