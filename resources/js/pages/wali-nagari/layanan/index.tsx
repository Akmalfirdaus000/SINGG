import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface LayananProps {
    documents: {
        data: any[];
        links: any[];
    };
}

export default function LayananIndex({ documents }: LayananProps) {
    return (
        <>
            <Head title="Pengajuan Layanan" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Pengajuan Layanan 📄
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Daftar permohonan dokumen yang memerlukan tanda tangan Anda.
                    </p>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Tabel Permohonan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Nomor</TableHead>
                                    <TableHead>Jenis Dokumen</TableHead>
                                    <TableHead>Pemohon</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-6 font-mono text-xs">{item.nomor_dokumen}</TableCell>
                                        <TableCell className="font-medium text-sm">{item.jenis_dokumen?.nama_tampilan}</TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">{item.nama_pemohon}</div>
                                            <div className="text-xs text-gray-500">{item.nik_pemohon}</div>
                                        </TableCell>
                                        <TableCell className="text-sm">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge className={item.status === 'menunggu_ttd_wali_nagari' ? 'bg-amber-100 text-amber-700' : ''} variant={item.status === 'selesai' ? 'default' : 'outline'}>
                                                {item.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Lihat Detail" asChild>
                                                    <Link href={`/wali-nagari/layanan/${item.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {item.status === 'menunggu_ttd_wali_nagari' && (
                                                    <>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-green-600" 
                                                            title="Setujui & TTD"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if(confirm('Setujui permohonan ini?')) {
                                                                    router.post(`/wali-nagari/layanan/${item.id}/approve`);
                                                                }
                                                            }}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-red-600" 
                                                            title="Tolak"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const catatan = prompt('Alasan penolakan:');
                                                                if(catatan) {
                                                                    router.post(`/wali-nagari/layanan/${item.id}/reject`, { catatan });
                                                                }
                                                            }}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {documents.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Belum ada pengajuan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LayananIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Pengajuan Layanan', href: '#' }]}>{page}</AppLayout>
);
