import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    ChevronRight,
    ClipboardList,
    Clock,
    FileSearch,
    FileText,
    LayoutDashboard,
    Megaphone,
    ShieldCheck,
    Star,
    Users,
    MapPin,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Auth } from '@/types';

interface DashboardFeatureProps {
    stats: {
        activeComplaints: number;
        processingDocuments: number;
        extraCount: number;
        rating: {
            average: number;
            count: number;
        };
    };
    latest: {
        complaint: any;
        document: any;
    };
    announcements: any[];
    unread: {
        notifications: number;
        messages: number;
    };
}

export default function DashboardFeature({ stats, latest, announcements, unread }: DashboardFeatureProps) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;

    return (
        <div className="flex flex-col gap-8">
            {/* Global Stats (Admin Oversight) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-xs font-semibold uppercase italic">Total Pengaduan Nagari</CardDescription>
                        <CardTitle className="text-2xl font-bold sm:text-3xl">{stats.activeComplaints}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <p className="text-xs text-gray-500">Laporan warga yang butuh tindak lanjut</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-xs font-semibold uppercase italic">Permohonan Dokumen</CardDescription>
                        <CardTitle className="text-2xl font-bold sm:text-3xl">{stats.processingDocuments}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <p className="text-xs text-gray-500">Berkas administrasi dalam antrean</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-emerald-500">
                    <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                        <CardDescription className="text-xs font-semibold uppercase italic">Total Warga Terdaftar</CardDescription>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                            <Users className="h-6 w-6 text-emerald-500" />
                            {stats.extraCount}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <p className="text-xs text-gray-500">Masyarakat Nagari Gasan Gadang</p>
                    </CardContent>
                </Card>
            </div>

            {/* Manajemen Cepat (Admin Quick Actions) */}
            <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Manajemen Cepat
                </h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <Button variant="outline" className="h-16 flex-col gap-1 border-2 border-dashed border-primary/20 hover:border-primary hover:bg-primary/5 sm:h-20" asChild>
                        <Link href="#">
                            <ShieldCheck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                            <span className="text-[10px] font-bold sm:text-xs">Verifikasi Warga</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1 border-2 border-dashed border-blue-200 hover:border-blue-500 hover:bg-blue-50 sm:h-20" asChild>
                        <Link href="#">
                            <ClipboardList className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
                            <span className="text-[10px] font-bold sm:text-xs">Kelola Pengaduan</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1 border-2 border-dashed border-amber-200 hover:border-amber-500 hover:bg-amber-50 sm:h-20" asChild>
                        <Link href="#">
                            <FileText className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
                            <span className="text-[10px] font-bold sm:text-xs">Layanan Dokumen</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1 border-2 border-dashed border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 sm:h-20" asChild>
                        <Link href="#">
                            <Megaphone className="h-5 w-5 text-emerald-500 sm:h-6 sm:w-6" />
                            <span className="text-[10px] font-bold sm:text-xs">Buat Pengumuman</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Left Column (Global Oversight) */}
                <div className="space-y-8 lg:col-span-3">
                    {/* Aktivitas Pengaduan Terbaru */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <Activity className="h-5 w-5 text-primary" />
                                Aktivitas Pengaduan Terbaru
                            </h2>
                            <Button variant="link" className="p-0 text-primary" asChild>
                                <Link href="#">Lihat Semua <ChevronRight className="h-4 w-4" /></Link>
                            </Button>
                        </div>

                        {latest.complaint ? (
                            <Card className="overflow-hidden shadow-md ring-1 ring-black/5">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={latest.complaint.user?.profil?.url_foto_profil} />
                                                <AvatarFallback>{latest.complaint.user?.profil?.nama_lengkap?.charAt(0) || 'W'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500">{latest.complaint.user?.profil?.nama_lengkap || 'Warga'}</p>
                                                <CardTitle className="text-lg">{latest.complaint.judul}</CardTitle>
                                            </div>
                                        </div>
                                        <Badge variant={latest.complaint.status === 'dalam_proses' ? 'secondary' : 'default'} className="uppercase">
                                            {latest.complaint.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{latest.complaint.alamat_lokasi}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span>Progress Resolve</span>
                                            <span>{latest.complaint.progress}%</span>
                                        </div>
                                        <Progress value={latest.complaint.progress} className="h-2" />
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/10">
                                    <Button size="sm" className="w-full" asChild>
                                        <Link href="#">Update Status Penanganan</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ) : (
                            <p className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">Tidak ada pengaduan aktif saat ini.</p>
                        )}
                    </section>

                    {/* Antrean Dokumen Nagari */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FileSearch className="h-5 w-5 text-primary" />
                                Antrean Dokumen Teratas
                            </h2>
                        </div>

                        {latest.document ? (
                            <Card className="hover:bg-muted/5 transition-colors">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{latest.document.nomor_dokumen}</p>
                                            <p className="font-bold">{latest.document.jenis_dokumen?.nama || 'Dokumen'}</p>
                                            <p className="text-xs text-muted-foreground">Pemohon: {latest.document.user?.profil?.nama_lengkap || 'Warga'}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">Proses Berkas</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">Belum ada antrean dokumen masuk.</p>
                        )}
                    </section>
                </div>

                {/* Right Column (News & Admin Stats) */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Rating Pelayanan Global */}
                    <Card className="bg-primary/5 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Kepuasan Warga</CardTitle>
                            <CardDescription>Rata-rata rating dari feedback pengaduan</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="flex items-center justify-center gap-2 text-5xl font-black text-primary">
                                <Star className="h-10 w-10 fill-primary" />
                                {stats.rating.average}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Berdasarkan {stats.rating.count} ulasan warga</p>
                        </CardContent>
                    </Card>

                    {/* Pengumuman Aktif */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold">Pengumuman Aktif</h2>
                        <div className="space-y-3">
                            {announcements.map((item) => (
                                <div key={item.id} className="flex gap-3 border-b border-muted pb-3 last:border-0 last:pb-0">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <Megaphone className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-bold leading-tight">{item.title || item.judul}</h4>
                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.konten}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                                <Link href="#">Kelola Pengumuman</Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
