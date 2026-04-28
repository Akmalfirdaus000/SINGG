import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, User, MapPin, History } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ShowProps {
    document: any;
}

export default function LayananShow({ document }: ShowProps) {
    const handleApprove = () => {
        if (confirm('Setujui permohonan ini?')) {
            router.post(`/wali-nagari/layanan/${document.id}/approve`);
        }
    };

    const handleReject = () => {
        const catatan = prompt('Alasan penolakan:');
        if (catatan) {
            router.post(`/wali-nagari/layanan/${document.id}/reject`, { catatan });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'selesai': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'disetujui': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'menunggu_ttd_wali_nagari': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'ditolak': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <>
            <Head title={`Detail Layanan - ${document.nomor_dokumen}`} />

            <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/wali-nagari/layanan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                            Detail Permohonan
                        </h1>
                        <p className="text-sm text-gray-500">{document.nomor_dokumen}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        {document.status === 'menunggu_ttd_wali_nagari' && (
                            <>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Setujui & TTD
                                </Button>
                                <Button variant="destructive" onClick={handleReject}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Data Pemohon */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Pemohon</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Nama Lengkap</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        {document.nama_pemohon}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">NIK</p>
                                    <p className="font-mono text-sm">{document.nik_pemohon}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Alamat</p>
                                    <p className="text-sm flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                        {document.alamat_pemohon}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detail Permohonan */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Isi Permohonan</CardTitle>
                                <CardDescription>{document.jenis_dokumen?.nama_tampilan}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                                    <dl className="grid gap-4 sm:grid-cols-2">
                                        {document.data_form && Object.entries(document.data_form).map(([key, value]: [string, any]) => (
                                            <div key={key}>
                                                <dt className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</dt>
                                                <dd className="text-sm font-medium">{value?.toString() || '-'}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lampiran */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Dokumen Lampiran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    {document.lampiran?.map((file: any) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{file.nama_file}</p>
                                                    <p className="text-xs text-gray-500">{(file.ukuran_file / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={file.url_file} target="_blank" rel="noopener noreferrer">Buka</a>
                                            </Button>
                                        </div>
                                    ))}
                                    {(!document.lampiran || document.lampiran.length === 0) && (
                                        <p className="text-sm text-gray-500 text-center py-4">Tidak ada lampiran.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pratinjau Surat (Tampil setelah TTD/Disetujui) */}
                        {['disetujui', 'selesai'].includes(document.status) && (
                            <Card className="border-none shadow-sm overflow-hidden ring-2 ring-emerald-500/20">
                                <CardHeader className="bg-emerald-600 text-white p-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Pratinjau Surat Resmi (Sudah TTD)
                                        </CardTitle>
                                        <Badge className="bg-white text-emerald-700 hover:bg-white/90">E-Signature Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 bg-gray-100">
                                    <iframe 
                                        src={`/wali-nagari/layanan/${document.id}/preview`} 
                                        className="w-full h-[600px] border-none"
                                        title="Pratinjau Surat"
                                    />
                                    <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                        <p>Surat ini sudah mencantumkan Tanda Tangan Elektronik Wali Nagari.</p>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`/wali-nagari/layanan/${document.id}/preview`} target="_blank" rel="noopener noreferrer">Buka Fullscreen</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className={`p-4 rounded-full ${getStatusColor(document.status)}`}>
                                        <Clock className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Status Saat Ini</p>
                                        <Badge className={`px-3 py-1 text-sm ${getStatusColor(document.status)}`}>
                                            {document.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
                                    <div className="w-full text-left space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Dibuat</span>
                                            <span className="font-medium">{new Date(document.created_at).toLocaleString()}</span>
                                        </div>
                                        {document.approved_at && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Disetujui</span>
                                                <span className="font-medium text-green-600">{new Date(document.approved_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Riwayat */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    Riwayat Aktivitas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {document.riwayat?.map((log: any) => (
                                        <div key={log.id} className="relative pl-6 pb-4 border-l border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                            <div className="absolute left-[-5px] top-0 h-2 w-2 rounded-full bg-blue-500" />
                                            <p className="text-xs font-medium">{log.status_baru.replace(/_/g, ' ')}</p>
                                            <p className="text-[10px] text-gray-500 mb-1">{new Date(log.created_at).toLocaleString()}</p>
                                            {log.catatan && <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">{log.catatan}</p>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

LayananShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Daftar Layanan', href: '/wali-nagari/layanan' },
        { title: 'Detail', href: '#' }
    ]}>{page}</AppLayout>
);
