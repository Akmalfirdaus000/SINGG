import { Head, Link } from '@inertiajs/react';
import { 
    Archive, 
    Download, 
    ExternalLink,
    Search,
    Filter,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    FileMinus
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';

interface Document {
    id: string;
    nomor_dokumen: string;
    status: string;
    created_at: string;
    completed_at: string;
    url_dokumen_dihasilkan: string;
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
    'selesai': { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    'disetujui': { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    'ditolak': { label: 'Ditolak', color: 'bg-rose-100 text-rose-700', icon: XCircle },
    'kedaluwarsa': { label: 'Kedaluwarsa', color: 'bg-slate-100 text-slate-700', icon: FileMinus },
};

export default function LayananRiwayat({ documents }: Props) {
    const [search, setSearch] = useState('');

    const filteredDocuments = documents.data.filter(doc => 
        doc.jenis_dokumen.nama_tampilan.toLowerCase().includes(search.toLowerCase()) ||
        doc.nomor_dokumen.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Riwayat Dokumen" />

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
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">Riwayat Permohonan</h1>
                        <p className="text-slate-500 font-inter">Arsip permohonan Anda yang telah selesai diproses.</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Cari nomor dokumen atau jenis surat..." 
                            className="pl-10 h-11 rounded-xl border-slate-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" className="rounded-xl gap-2 font-inter text-slate-600 border border-slate-200 h-11">
                        <Filter className="h-4 w-4" />
                        Filter Status
                    </Button>
                </div>

                {/* Results Table/List */}
                <div className="space-y-3">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => {
                            const StatusIcon = statusMap[doc.status]?.icon || Archive;
                            return (
                                <Card key={doc.id} className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-slate-300 transition-all rounded-2xl overflow-hidden group">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row items-stretch">
                                            {/* Status Indicator Bar */}
                                            <div className={`w-1 md:w-2 ${statusMap[doc.status]?.color.split(' ')[0]}`} />
                                            
                                            <div className="p-5 flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                                <div className="md:col-span-5 space-y-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="secondary" className={`${statusMap[doc.status]?.color} border-none`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusMap[doc.status]?.label}
                                                        </Badge>
                                                        <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">
                                                            {doc.nomor_dokumen}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 font-outfit text-lg">
                                                        {doc.jenis_dokumen.nama_tampilan}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-inter">
                                                        Diajukan pada: {new Date(doc.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>

                                                <div className="md:col-span-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal Selesai</p>
                                                    <p className="text-sm font-semibold text-slate-700 font-inter">
                                                        {doc.completed_at ? new Date(doc.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                    </p>
                                                </div>

                                                <div className="md:col-span-4 flex justify-end gap-2">
                                                    {doc.url_dokumen_dihasilkan && (
                                                        <Button asChild className="rounded-xl h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all font-bold">
                                                            <a href={doc.url_dokumen_dihasilkan} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Unduh PDF
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" asChild className="rounded-xl h-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                        <Link href={warga.layanan.show(doc.id).url}>
                                                            Detail
                                                            <ExternalLink className="h-3.5 w-3.5 ml-2" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <div className="inline-flex p-6 bg-white rounded-full text-slate-200 shadow-sm">
                                <Archive size={48} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-500">Belum Ada Riwayat</h3>
                                <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed font-inter">
                                    Dokumen yang telah selesai atau ditolak akan muncul di sini secara otomatis.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

LayananRiwayat.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Layanan Mandiri', href: '/layanan' },
        { title: 'Riwayat Dokumen', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
