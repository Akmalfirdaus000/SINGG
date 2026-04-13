import { useForm, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    User, 
    Calendar, 
    FileText, 
    ClipboardList,
    Send,
    CheckCircle2,
    Trash,
    Phone,
    CreditCard,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '../components/status-badge';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface DocumentDetailProps {
    document: {
        id: string;
        nomor_dokumen: string;
        nama_pemohon: string;
        nik_pemohon: string;
        alamat_pemohon: string;
        telepon_pemohon: string;
        status: string;
        data_form: Record<string, any>;
        created_at: string;
        jenis_dokumen: {
            nama_tampilan: string;
            biaya: number;
        };
        lampiran: any[];
        riwayat: any[];
        url_dokumen_dihasilkan?: string;
    }
}

export function LayananDetailPage({ document }: DocumentDetailProps) {
    const { data, setData, post, processing, errors } = useForm({
        status: document.status,
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.layanan.update(document.id).url, {
            onSuccess: () => setData('catatan', ''),
        });
    };

    const handleTerbitkan = () => {
        if (window.confirm('Terbitkan surat resmi dan selesaikan permohonan ini?')) {
            router.post(admin.layanan.terbitkan(document.id).url, {}, {
                onSuccess: () => {
                    // Success handling is managed by Inertia automatic page refresh
                }
            });
        }
    };

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus permohonan ini?')) {
            router.delete(admin.layanan.destroy(document.id).url, {
                onSuccess: () => router.visit(admin.layanan.index().url)
            });
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
                        <Link href={admin.layanan.index().url}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{document.jenis_dokumen.nama_tampilan}</h1>
                        <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {document.nomor_dokumen}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <StatusBadge status={document.status} />
                        <span className="text-sm text-muted-foreground ml-2">
                            Diajukan pada {new Date(document.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {['disetujui', 'selesai'].includes(document.status) && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all font-bold"
                            onClick={handleTerbitkan}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Terbitkan Surat
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Hapus Permohonan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Data & Attachments */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-blue-500" />
                                Data Formulir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {Object.entries(document.data_form ?? {}).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <dt className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                            {key.replace(/_/g, ' ')}
                                        </dt>
                                        <dd className="text-sm text-slate-700 font-medium">
                                            {typeof value === 'object' ? JSON.stringify(value) : value || '-'}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>

                    {document.url_dokumen_dihasilkan && (
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                            <CardHeader className="bg-emerald-600 text-white border-b border-emerald-500 p-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Pratinjau Surat Resmi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 bg-slate-100">
                                <iframe 
                                    src={document.url_dokumen_dihasilkan} 
                                    className="w-full h-[600px] border-none"
                                    title="Pratinjau Surat"
                                />
                                <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                    <p>Tampilan pratinjau surat yang dihasilkan oleh sistem.</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={document.url_dokumen_dihasilkan} target="_blank">Buka di Tab Baru</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {document.lampiran && document.lampiran.length > 0 && (
                        <Card className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                    Lampiran Persyaratan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {document.lampiran.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/30 group hover:border-blue-200 hover:bg-blue-50/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{file.nama_file}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">{(file.ukuran_file / 1024).toFixed(1)} KB • {file.tipe_file.split('/')[1]}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={file.url_file} target="_blank">Unduh</a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5 text-slate-500" />
                                Riwayat Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {(document.riwayat ?? []).map((log, idx) => (
                                    <div key={log.id} className="flex gap-4 relative">
                                        {idx !== document.riwayat.length - 1 && (
                                            <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200" />
                                        )}
                                        <div className={cn(
                                            "mt-1.5 h-[22px] w-[22px] rounded-full flex items-center justify-center z-10 border-4 border-white",
                                            idx === 0 ? "bg-blue-500" : "bg-slate-300"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-slate-900">
                                                    Status: <StatusBadge status={log.status_baru} />
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <p className="text-sm text-slate-600 italic">"{log.catatan}"</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Petugas: {log.user?.profil?.nama_lengkap || 'Warga'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Applicant Info & Update Form */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md ring-1 ring-slate-200 bg-slate-50/10">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-base">Perbarui Status</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Status Baru</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger className="bg-white border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                                            <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                                            <SelectItem value="dalam_tinjauan">Dalam Tinjauan</SelectItem>
                                            <SelectItem value="disetujui">Disetujui</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catatan / Alasan</Label>
                                    <Textarea 
                                        placeholder="Tulis catatan verifikasi atau alasan penolakan..." 
                                        className="min-h-[120px] resize-none bg-white border-slate-200"
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                    />
                                    {errors.catatan && <p className="text-xs text-red-500">{errors.catatan}</p>}
                                </div>

                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                                    {processing ? "Memproses..." : (
                                        <>
                                            <Send className="h-3.5 w-3.5 mr-2" />
                                            Update Permohonan
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-base">Informasi Pemohon</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {document.nama_pemohon.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{document.nama_pemohon}</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citizen Applicant</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-slate-50 text-sm">
                                <div className="flex items-start gap-2 text-slate-600">
                                    <CreditCard className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">NIK</p>
                                        <p>{document.nik_pemohon}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Telepon</p>
                                        <p>{document.telepon_pemohon || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-orange-50 border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Estimasi Biaya</p>
                                    <p className="text-lg font-bold text-orange-700">
                                        Rp {new Intl.NumberFormat('id-ID').format(document.jenis_dokumen.biaya)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
