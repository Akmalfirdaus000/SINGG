import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Upload, 
    X, 
    FileText, 
    Info,
    Send,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';

interface Requirement {
    nama: string;
    wajib: boolean;
}

interface JenisDokumen {
    id: string;
    nama: string;
    nama_tampilan: string;
    deskripsi: string;
    persyaratan: Requirement[];
    hari_proses: number;
}

interface UserProfile {
    nama_lengkap: string;
    nik: string;
    alamat: string;
    phone?: string;
}

interface Props {
    jenis: JenisDokumen;
    user_profile: UserProfile;
}

export default function LayananCreate({ jenis, user_profile }: Props) {
    const [previews, setPreviews] = useState<Record<string, string>>({});

    const { data, setData, post, processing, errors } = useForm({
        jenis_id: jenis.id,
        nama_pemohon: user_profile.nama_lengkap || '',
        nik_pemohon: user_profile.nik || '',
        alamat_pemohon: user_profile.alamat || '',
        telepon_pemohon: user_profile.phone || '',
        data_form: {} as Record<string, any>,
        lampiran: {} as Record<string, File>,
    });

    const handleFileChange = (reqName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('lampiran', { ...data.lampiran, [reqName]: file });
            
            // Preview
            const url = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [reqName]: url }));
        }
    };

    const removeFile = (reqName: string) => {
        const newLampiran = { ...data.lampiran };
        delete newLampiran[reqName];
        setData('lampiran', newLampiran);

        if (previews[reqName]) {
            URL.revokeObjectURL(previews[reqName]);
            const newPreviews = { ...previews };
            delete newPreviews[reqName];
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(warga.layanan.store().url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Ajukan ${jenis.nama_tampilan}`} />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-slate-100">
                        <Link href={warga.layanan.index().url}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none px-3 py-0.5">
                                {jenis.hari_proses} Hari Kerja
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-outfit">Permohonan {jenis.nama_tampilan}</h1>
                        <p className="text-slate-500 font-inter text-sm">{jenis.deskripsi}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
                        
                        {/* Identitas Pemohon */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white p-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-slate-900 mb-1">
                                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg font-bold font-outfit">Identitas Pemohon</CardTitle>
                                    </div>
                                    <CardDescription>Pastikan data identitas Anda sudah sesuai dengan profil.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_pemohon" className="text-slate-700 font-semibold">Nama Lengkap</Label>
                                            <Input 
                                                id="nama_pemohon" 
                                                className="h-11 rounded-xl border-slate-200"
                                                value={data.nama_pemohon}
                                                onChange={e => setData('nama_pemohon', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nik_pemohon" className="text-slate-700 font-semibold">NIK</Label>
                                            <Input 
                                                id="nik_pemohon" 
                                                className="h-11 rounded-xl border-slate-200"
                                                value={data.nik_pemohon}
                                                onChange={e => setData('nik_pemohon', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="alamat_pemohon" className="text-slate-700 font-semibold">Alamat Lengkap</Label>
                                        <Textarea 
                                            id="alamat_pemohon" 
                                            className="min-h-[80px] rounded-xl border-slate-200 py-3"
                                            value={data.alamat_pemohon}
                                            onChange={e => setData('alamat_pemohon', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Lampiran Dokumen Persyaratan */}
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white p-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-slate-900 mb-1">
                                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                            <Upload className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg font-bold font-outfit">Persyaratan Dokumen</CardTitle>
                                    </div>
                                    <CardDescription>Unggah hasil scan atau foto dokumen asli sesuai persyaratan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-0">
                                    {jenis.persyaratan?.map((req, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-800">{req.nama}</p>
                                                    {req.wajib && <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Wajib</span>}
                                                </div>
                                                
                                                {previews[req.nama] ? (
                                                     <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        onClick={() => removeFile(req.nama)}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 rounded-full"
                                                     >
                                                        <X className="h-4 w-4" />
                                                     </Button>
                                                ) : null}
                                            </div>

                                            {previews[req.nama] ? (
                                                <div className="relative aspect-[16/9] md:aspect-[3/1] rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-inner group">
                                                    <img src={previews[req.nama]} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <p className="text-white font-bold flex items-center gap-2">
                                                            <CheckCircle2 className="h-5 w-5" />
                                                            Sudah Dipilih
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-300 bg-white hover:bg-white hover:border-blue-400 cursor-pointer transition-all">
                                                    <Upload className="h-6 w-6 text-slate-400" />
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold text-slate-700">Pilih File</p>
                                                        <p className="text-[10px] text-slate-400">PDF, JPG, atau PNG (Maks 5MB)</p>
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileChange(req.nama, e)}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                    />
                                                </label>
                                            )}
                                            {errors[`lampiran.${req.nama}`] && <p className="text-xs text-rose-500">{errors[`lampiran.${req.nama}`]}</p>}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white overflow-hidden">
                                <CardHeader className="p-5 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-slate-500" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600">Alur Proses</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-6">
                                    <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                        {[
                                            { t: 'Pengajuan', d: 'Warga mengisi form' },
                                            { t: 'Verifikasi', d: 'Tim admin mengecek data' },
                                            { t: 'Persetujuan', d: 'Disetujui oleh Kades/RT/RW' },
                                            { t: 'Selesai', d: 'Dokumen dapat diambil/unduh' },
                                        ].map((step, i) => (
                                            <div key={i} className="relative pl-6">
                                                <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-slate-200 bg-white" />
                                                <p className="font-bold text-slate-800 leading-none mb-1">{step.t}</p>
                                                <p className="text-xs text-slate-500">{step.d}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 shadow-xl shadow-blue-100 group transition-all"
                            >
                                {processing ? (
                                    <>Memproses...</>
                                ) : (
                                    <>
                                        Ajukan Permohonan
                                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

LayananCreate.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Layanan Mandiri', href: '/layanan' },
        { title: 'Ajukan Permohonan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
