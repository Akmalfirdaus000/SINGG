import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, User, Clock, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ShowProps {
    complaint: any;
}

export default function PengaduanShow({ complaint }: ShowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'selesai': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'dalam_proses': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'menunggu_verifikasi': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'ditolak': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50';
            case 'tinggi': return 'text-orange-600 bg-orange-50';
            case 'sedang': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <>
            <Head title={`Detail Pengaduan - ${complaint.judul}`} />

            <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/wali-nagari/pengaduan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                             <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                                Detail Pengaduan
                            </h1>
                            <Badge className={getPriorityColor(complaint.prioritas)} variant="outline">
                                {complaint.prioritas.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{complaint.nomor_pengaduan}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Judul & Deskripsi */}
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
                                    <MessageSquare className="h-4 w-4" />
                                    {complaint.kategori?.nama_tampilan}
                                </div>
                                <CardTitle className="text-2xl font-bold">{complaint.judul}</CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    Diajukan oleh <span className="font-medium text-gray-900 dark:text-gray-200">{complaint.user?.profil?.nama_lengkap}</span> • {new Date(complaint.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {complaint.deskripsi}
                                    </p>
                                </div>
                                
                                {complaint.alamat_lokasi && (
                                    <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-red-500 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Lokasi Kejadian</p>
                                            <p className="text-sm">{complaint.alamat_lokasi}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Lampiran Foto/File */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-purple-500" />
                                    Lampiran Pengaduan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {complaint.lampiran?.map((file: any) => (
                                        <div key={file.id} className="group relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-square">
                                            {file.tipe_file.includes('image') ? (
                                                <img src={file.url_file} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Lampiran" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                    <AlertCircle className="h-8 w-8 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="sm" variant="secondary" asChild>
                                                    <a href={file.url_file} target="_blank" rel="noopener noreferrer">Lihat Full</a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!complaint.lampiran || complaint.lampiran.length === 0) && (
                                        <p className="text-sm text-gray-500 py-4 col-span-full text-center">Tidak ada lampiran.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                         {/* Status Tracker */}
                         <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-3 w-3 rounded-full ${complaint.status === 'selesai' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Status Laporan</span>
                                        </div>
                                        <Badge className={getStatusColor(complaint.status)} variant="outline">
                                            {complaint.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <Clock className="h-3 w-3 text-white" />
                                                </div>
                                                <div className="w-px flex-1 bg-gray-100 dark:bg-gray-800" />
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-xs font-bold">Laporan Masuk</p>
                                                <p className="text-[10px] text-gray-400">{new Date(complaint.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${complaint.status !== 'menunggu_verifikasi' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                                                    <User className="h-3 w-3 text-white" />
                                                </div>
                                                <div className="w-px flex-1 bg-gray-100 dark:bg-gray-800" />
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-xs font-bold text-gray-400">Verifikasi Petugas</p>
                                                {complaint.status !== 'menunggu_verifikasi' && <p className="text-[10px] text-gray-400">Terverifikasi</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Petugas Card */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Petugas Penanggung Jawab</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{complaint.assigned_to_user?.profil?.nama_lengkap || 'Belum Ditugaskan'}</p>
                                        <p className="text-xs text-gray-500">Petugas Lapangan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PengaduanShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Monitoring Pengaduan', href: '/wali-nagari/pengaduan' },
        { title: 'Detail', href: '#' }
    ]}>{page}</AppLayout>
);
