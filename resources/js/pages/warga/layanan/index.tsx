import { Head, Link } from '@inertiajs/react';
import { 
    FileText, 
    Search, 
    ChevronRight, 
    Clock, 
    Info,
    ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import warga from '@/routes/warga';

interface Service {
    id: string;
    nama: string;
    nama_tampilan: string;
    deskripsi: string;
    hari_proses: number;
    persyaratan: any[];
}

interface Props {
    services: Service[];
}

export default function LayananIndex({ services }: Props) {
    const [search, setSearch] = useState('');

    const filteredServices = services.filter(service => 
        service.nama_tampilan.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Ajukan Permohonan" />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-2xl shadow-blue-200">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-outfit mb-4">
                            Layanan Mandiri Warga
                        </h1>
                        <p className="text-blue-50 text-lg opacity-90 font-inter leading-relaxed">
                            Ajukan permohonan surat keterangan dan dokumen administrasi desa secara online, cepat, dan mudah.
                        </p>
                    </div>
                    {/* Decorative Background Icons */}
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <FileText size={300} />
                    </div>
                </div>

                {/* Sub-Menu Navigation (Mockup for context, but active links) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Button variant="outline" className="h-16 justify-between px-6 rounded-2xl border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-slate-700">Ajukan Permohonan</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </Button>
                    <Button variant="ghost" asChild className="h-16 justify-between px-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:ring-blue-200 transition-all group">
                        <Link href={warga.layanan.lacak().url}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-700">Lacak Permohonan</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="h-16 justify-between px-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:ring-blue-200 transition-all group">
                        <Link href={warga.layanan.riwayat().url}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Info className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-700">Riwayat Dokumen</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Link>
                    </Button>
                </div>

                {/* Search & Statistics */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Cari jenis surat (misal: Domisili)..." 
                            className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <p className="text-sm text-slate-500 font-inter">
                        Menampilkan <span className="font-bold text-slate-900">{filteredServices.length}</span> jenis layanan
                    </p>
                </div>

                {/* Katalog Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <Card key={service.id} className="group border-none shadow-sm ring-1 ring-slate-200 hover:ring-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-3 py-1">
                                         {service.hari_proses} Hari Kerja
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold font-outfit text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {service.nama_tampilan}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px] font-inter">
                                    {service.deskripsi}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4 flex-grow">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Persyaratan Utama:</p>
                                <ul className="space-y-2">
                                    {service.persyaratan?.slice(0, 3).map((p: any, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                            {p.nama}
                                        </li>
                                    ))}
                                    {service.persyaratan?.length > 3 && (
                                        <li className="text-xs text-blue-500 font-semibold mt-1">
                                            +{service.persyaratan.length - 3} persyaratan lainnya
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6 px-6">
                                <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-xl py-6 group-hover:shadow-lg group-hover:shadow-blue-200 transition-all font-bold">
                                    <Link href={warga.layanan.create(service.id).url}>
                                        Ajukan Sesuai Prosedur
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                
                {filteredServices.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-300">
                            <Search size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-500">Layanan tidak ditemukan</h3>
                        <p className="text-slate-400">Coba gunakan kata kunci pencarian yang berbeda.</p>
                        <Button variant="outline" onClick={() => setSearch('')} className="rounded-xl">
                            Reset Pencarian
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

LayananIndex.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Layanan Mandiri', href: '/layanan' },
        { title: 'Katalog', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
