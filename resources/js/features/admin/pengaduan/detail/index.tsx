import { useForm, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    MapPin, 
    User, 
    Calendar, 
    Clock, 
    FileText, 
    Image as ImageIcon,
    Send,
    AlertCircle,
    CheckCircle2,
    Trash
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge, PrioritasBadge } from '../components/status-badge';
import { Timeline } from '../components/timeline';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface PengaduanDetailProps {
    pengaduan: {
        id: string;
        nomor_pengaduan: string;
        judul: string;
        deskripsi: string;
        status: any;
        prioritas: any;
        progres: number;
        alamat_lokasi: string;
        created_at: string;
        user: {
            profil: {
                nama_lengkap: string;
                alamat: string;
            }
        };
        kategori: {
            nama_tampilan: string;
        };
        lampiran: any[];
        riwayat: any[];
    }
}

export function PengaduanDetailPage({ pengaduan }: PengaduanDetailProps) {
    const { data, setData, post, processing, errors } = useForm({
        status: pengaduan.status,
        progress: pengaduan.progres,
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.pengaduan.update(pengaduan.id).url, {
            onSuccess: () => setData('catatan', ''),
        });
    };

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini secara permanen?')) {
            router.delete(admin.pengaduan.destroy(pengaduan.id).url, {
                onSuccess: () => {
                    // Redirect will happen from controller back(), 
                    // but we might want to redirect to index specifically if deleting from detail
                    router.visit(admin.pengaduan.index().url);
                }
            });
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
                        <Link href={admin.pengaduan.index().url}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{pengaduan.judul}</h1>
                        <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {pengaduan.nomor_pengaduan}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <StatusBadge status={pengaduan.status} />
                        <PrioritasBadge prioritas={pengaduan.prioritas} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Hapus Laporan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Detail & Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Deskripsi Masalah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-slate-700 leading-relaxed">
                            <p className="whitespace-pre-wrap">{pengaduan.deskripsi}</p>
                            
                            {pengaduan.lampiran && pengaduan.lampiran.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Lampiran Media ({pengaduan.lampiran.length})
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {pengaduan.lampiran.map((file) => (
                                            <div key={file.id} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                <img src={file.url_file} alt={file.nama_file} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="secondary" size="sm" asChild>
                                                        <a href={file.url_file} target="_blank">Lihat</a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-500" />
                                Timeline Penanganan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Timeline entries={pengaduan.riwayat} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Sidebar Actions & Info */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <Card className="border-none shadow-md ring-1 ring-slate-200 bg-slate-50/10">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-base text-center md:text-left">Perbarui Penanganan</CardTitle>
                            <CardDescription className="text-center md:text-left">Update progres dan status terbaru.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Status Baru</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                                            <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                                            <SelectItem value="dalam_proses">Dalam Proses</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Progres ({data.progress}%)</Label>
                                    </div>
                                    <Input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        step="5"
                                        value={data.progress}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('progress', parseInt(e.target.value))}
                                        className="h-2 bg-slate-200 accent-blue-600 cursor-pointer"
                                    />
                                    <Progress value={data.progress} className="h-1" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Catatan / Balasan Admin</Label>
                                    <Textarea 
                                        placeholder="Tulis balasan atau catatan perkembangan..." 
                                        className="min-h-[100px] resize-none"
                                        value={data.catatan}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan', e.target.value)}
                                    />
                                    {errors.catatan && <p className="text-xs text-red-500">{errors.catatan}</p>}
                                </div>

                                <Button className="w-full" disabled={processing}>
                                    {processing ? "Memproses..." : (
                                        <>
                                            <Send className="h-3 w-3 mr-2" />
                                            Kirim Update
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Pelapor Info */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {pengaduan.user.profil.nama_lengkap.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{pengaduan.user.profil.nama_lengkap}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pihak Pelapor</p>
                                </div>
                            </div>
                            <div className="space-y-2.5 pt-4 border-t border-slate-50 text-sm text-slate-600">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <span>{pengaduan.alamat_lokasi || "Lokasi tidak spesifik"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span>{pengaduan.user.profil.alamat}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
