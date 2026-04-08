import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Bell,
    Calendar,
    ChevronRight,
    ClipboardList,
    Clock,
    Download,
    ExternalLink,
    FilePlus,
    FileText,
    Mail,
    MapPin,
    Megaphone,
    MessageSquare,
    PlusCircle,
    ShieldAlert,
    Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Auth } from '@/types';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';

interface DashboardProps {
    stats: {
        activeComplaints: number;
        processingDocuments: number;
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

export default function Dashboard({ stats, latest, announcements, unread }: DashboardProps) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;

    return (
        <>
            <Head title="Dashboard Warga" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {/* 1. Header Greeting & Notifications */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            Halo, {user.profil?.nama_lengkap || 'Warga'}! 👋
                        </h1>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <Link href="#" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                <Bell className="h-4 w-4" />
                                <span>{unread.notifications} notifikasi baru</span>
                            </Link>
                            <Separator orientation="vertical" className="h-4" />
                            <Link href="#" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                <Mail className="h-4 w-4" />
                                <span>{unread.messages} pesan belum dibaca</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="relative rounded-full">
                            <Bell className="h-5 w-5" />
                            {unread.notifications > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {unread.notifications}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* 2. Ringkasan Aktivitas (Stats Cards) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    <Card className="shadow-sm transition-shadow hover:shadow-md border-l-4 border-l-blue-500">
                        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                            <CardDescription className="text-xs font-semibold uppercase">Pengaduan Aktif</CardDescription>
                            <CardTitle className="text-2xl font-bold sm:text-3xl">{stats.activeComplaints}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <p className="text-xs text-gray-500">Laporan yang sedang ditangani</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md border-l-4 border-l-amber-500">
                        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                            <CardDescription className="text-xs font-semibold uppercase">Dokumen Diproses</CardDescription>
                            <CardTitle className="text-2xl font-bold sm:text-3xl">{stats.processingDocuments}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <p className="text-xs text-gray-500">Permohonan administrasi berjalan</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md border-l-4 border-l-emerald-500">
                        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
                            <CardDescription className="text-xs font-semibold uppercase">Rating Pelayanan</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                                {stats.rating.average}
                                <span className="text-sm font-normal text-gray-500">/ 5</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <p className="text-xs text-gray-500">Berdasarkan {stats.rating.count} ulasan Anda</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Aksi Cepat (Quick Actions) */}
                <div className="flex flex-col gap-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <PlusCircle className="h-5 w-5 text-primary" />
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
                        <Button className="h-16 bg-red-500 text-lg font-semibold shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" asChild>
                            <Link href="#">
                                <ShieldAlert className="mr-2 h-5 w-5" />
                                Laporkan Masalah
                            </Link>
                        </Button>
                        <Button className="h-16 bg-blue-500 text-lg font-semibold shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" asChild>
                            <Link href="#">
                                <FilePlus className="mr-2 h-5 w-5" />
                                Ajukan Dokumen
                            </Link>
                        </Button>
                        <Button className="h-16 bg-emerald-500 text-lg font-semibold shadow-sm hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700" asChild>
                            <Link href="#">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Chat Admin
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Left Column (Main Content) */}
                    <div className="space-y-8 lg:col-span-3">
                        {/* 4. Pengaduan Terakhir */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Pengaduan Terakhir
                                </h2>
                                <Button variant="link" className="h-auto p-0 text-primary" asChild>
                                    <Link href="#" className="flex items-center gap-1">
                                        Lihat Semua <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {latest.complaint ? (
                                <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                                    <CardHeader className="bg-gray-50/50 pb-4 dark:bg-neutral-900">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2 font-mono text-[10px]">
                                                    #{latest.complaint.nomor_pengaduan}
                                                </Badge>
                                                <CardTitle className="text-xl">{latest.complaint.judul}</CardTitle>
                                            </div>
                                            <Badge variant={latest.complaint.status === 'dalam_proses' ? 'secondary' : 'default'} className="uppercase">
                                                {latest.complaint.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="grid gap-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                <span>{latest.complaint.alamat_lokasi}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span>Dilaporkan pada {new Date(latest.complaint.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>

                                            <div className="mt-2 space-y-2">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span>Progress Penanganan</span>
                                                    <span>{latest.complaint.progress}%</span>
                                                </div>
                                                <Progress value={latest.complaint.progress} className="h-2.5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end bg-gray-50/30 dark:bg-neutral-900/50">
                                        <Button size="sm" asChild>
                                            <Link href="#">
                                                Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ) : (
                                <Card className="border-2 border-dashed bg-gray-50/50 p-12 text-center text-gray-500 dark:bg-neutral-900">
                                    <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                    <p>Belum ada pengaduan yang dibuat.</p>
                                    <Button variant="outline" className="mt-4" asChild>
                                        <Link href="#">Mulai Laporkan Masalah</Link>
                                    </Button>
                                </Card>
                            )}
                        </section>

                        {/* 5. Dokumen Anda */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Dokumen Terbaru
                                </h2>
                                <Button variant="link" className="h-auto p-0 text-primary" asChild>
                                    <Link href="#" className="flex items-center gap-1">
                                        Lihat Semua <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {latest.document ? (
                                <div className="space-y-4">
                                    <Card className="group cursor-pointer border-l-4 border-l-primary transition-colors hover:bg-gray-50 dark:hover:bg-neutral-900">
                                        <CardContent className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-lg bg-primary/10 p-2.5">
                                                    <FileText className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-mono text-xs text-gray-500">{latest.document.nomor_dokumen}</p>
                                                    <p className="font-bold">{latest.document.jenis_dokumen?.nama || 'Dokumen'}</p>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
                                                            {latest.document.status.toUpperCase()}
                                                        </Badge>
                                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                            <Clock className="h-3 w-3" />
                                                            Estimasi: {latest.document.perkiraan_tanggal_selesai ? new Date(latest.document.perkiraan_tanggal_selesai).toLocaleDateString('id-ID') : 'Segera'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                {latest.document.status === 'selesai' && (
                                                    <Button variant="outline" size="sm" className="h-8">
                                                        <Download className="mr-2 h-4 w-4" /> Download
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" className="h-8">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <p className="rounded-lg border bg-gray-50/50 p-4 text-sm italic text-gray-500 dark:bg-neutral-900">
                                    Belum ada pengajuan dokumen aktif.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Right Column (Sidebar/Announcements) */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* 6. Pengumuman Terbaru */}
                        <section>
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Megaphone className="h-5 w-5 text-primary" />
                                Pengumuman Nagari
                            </h2>
                            <div className="space-y-4">
                                {announcements.length > 0 ? announcements.map((item) => (
                                    <Card key={item.id} className={item.is_penting ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10' : ''}>
                                        <CardContent className="p-4">
                                            <div className="mb-1 flex justify-between items-start">
                                                <span className="text-[10px] font-bold uppercase leading-none tracking-widest text-gray-400">
                                                    {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                                {item.is_penting && <Badge className="h-4 bg-amber-500 text-[9px]">PENTING</Badge>}
                                            </div>
                                            <h3 className="mb-1 text-sm font-bold leading-tight">{item.judul}</h3>
                                            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                                                {item.konten}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <p className="text-xs text-gray-500">Tidak ada pengumuman terbaru.</p>
                                )}
                            </div>
                        </section>

                        {/* 7. Profil Singkat Card */}
                        <Card className="border-none bg-primary/5">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <Avatar className="h-20 w-20 shadow-xl ring-4 ring-white dark:ring-neutral-900">
                                        <AvatarImage src={user.avatar || user.profil?.url_foto_profil} />
                                        <AvatarFallback className="bg-primary text-2xl font-bold text-white">
                                            {user.profil?.nama_lengkap?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-bold">{user.profil?.nama_lengkap || 'Warga'}</h3>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                        <Badge variant="outline" className="mt-2 bg-white dark:bg-neutral-900">
                                            {user.nik || 'NIK Belum Terverifikasi'}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="grid w-full grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase text-gray-400">Status Akun</p>
                                            <p className="text-xs font-semibold text-emerald-500">{user.is_active ? 'Aktif' : 'Nonaktif'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase text-gray-400">Role</p>
                                            <p className="text-xs font-semibold">User Nagari</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link href={edit()}>Edit Profil</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]}>{page}</AppLayout>
);
