import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';

interface PengaduanProps {
    complaints: {
        data: any[];
        links: any[];
    };
}

export default function PengaduanIndex({ complaints }: PengaduanProps) {
    return (
        <>
            <Head title="Pengaduan Masyarakat" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Pengaduan Masyarakat 📢
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Monitoring laporan dan keluhan masyarakat yang telah selesai ditangani.
                    </p>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Daftar Aduan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Nomor</TableHead>
                                    <TableHead>Judul Adun</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Pelapor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {complaints.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-6 font-mono text-xs">{item.nomor_pengaduan}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm">{item.judul}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.deskripsi}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.kategori?.nama_tampilan}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{item.user?.profil?.nama_lengkap || 'Anonim'}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'selesai' ? 'default' : 'secondary'}>
                                                {item.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/wali-nagari/pengaduan/${item.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {complaints.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Belum ada pengaduan.
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

PengaduanIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Pengaduan Masyarakat', href: '#' }]}>{page}</AppLayout>
);
