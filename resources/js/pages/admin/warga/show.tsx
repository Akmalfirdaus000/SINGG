import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Briefcase, 
    CreditCard, 
    ShieldCheck, 
    ShieldAlert,
    MessageSquare,
    FileText,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { Separator } from '@/components/ui/separator';

interface Warga {
    id: string;
    nik: string;
    email: string;
    phone: string;
    is_active: boolean;
    created_at: string;
    profil?: {
        nama_lengkap: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        jenis_kelamin: string;
        pekerjaan: string;
        alamat: string;
        desa: string;
        kecamatan: string;
        kota: string;
        url_foto_profil: string;
    };
    pengaduan?: any[];
    dokumen?: any[];
}

interface Props {
    warga: Warga;
}

export default function WargaShow({ warga }: Props) {
    return (
        <>
            <Head title={`Detail Warga - ${warga.profil?.nama_lengkap}`} />

            <div className="space-y-6 px-4 py-8">
                {/* Header with Back Button */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-slate-100">
                            <Link href={admin.warga.index().url}>
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Detail Profil Warga</h1>
                            <p className="text-sm text-slate-500 font-inter">Informasi lengkap kependudukan dan aktivitas warga.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {warga.is_active ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1">
                                <ShieldCheck className="h-3 w-3 mr-1.5" /> AKUN AKTIF
                            </Badge>
                        ) : (
                            <Badge className="bg-red-50 text-red-600 border-none px-3 py-1">
                                <ShieldAlert className="h-3 w-3 mr-1.5" /> AKUN NONAKTIF
                            </Badge>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                             Edit Data
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Primary Info Card */}
                    <Card className="lg:col-span-1 border-none shadow-sm ring-1 ring-slate-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-32 w-32 rounded-3xl bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-blue-600 text-4xl font-bold">
                                    {warga.profil?.nama_lengkap?.charAt(0) || <User className="h-12 w-12" />}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900">{warga.profil?.nama_lengkap}</h2>
                                    <p className="text-sm text-slate-500 font-medium font-mono">{warga.nik}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                                        Warga Nagari
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none lowercase">
                                        {warga.profil?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </Badge>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="w-full space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col items-start truncate">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Email</span>
                                            <span className="truncate w-full">{warga.email || 'Tidak ada email'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col items-start truncate">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Telepon</span>
                                            <span className="truncate w-full">{warga.phone || 'Tidak ada nomor'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Member Sejak</span>
                                            <span>{new Date(warga.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-blue-500" /> Informasi Kependudukan
                                </CardTitle>
                                <CardDescription>Detail identitas dan domisili warga</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tempat, Tanggal Lahir</span>
                                    <p className="text-slate-900 font-medium">
                                        {warga.profil?.tempat_lahir || '-'}, {warga.profil?.tanggal_lahir ? new Date(warga.profil.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pekerjaan</span>
                                    <p className="text-slate-900 font-medium flex items-center gap-2">
                                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                        {warga.profil?.pekerjaan || 'Belum diisi'}
                                    </p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alamat Lengkap</span>
                                    <p className="text-slate-900 font-medium flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                        {warga.profil?.alamat || 'Alamat belum dilengkapi'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Mini-Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-blue-100 transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                        <MessageSquare className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Pengaduan</p>
                                        <p className="text-xl font-bold text-slate-900">{warga.pengaduan?.length || 0}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-blue-100 transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Dokumen</p>
                                        <p className="text-xl font-bold text-slate-900">{warga.dokumen?.length || 0}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-blue-100 transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                        <History className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Aktivitas</p>
                                        <p className="text-sm font-bold text-slate-900 text-emerald-600">Normal</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

WargaShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Data Warga', href: admin.warga.index().url },
        { title: 'Detail Profil', href: '#' }
    ]}>{page}</AppLayout>
);
