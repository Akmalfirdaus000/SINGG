import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface WargaProps {
    warga: {
        data: any[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function WargaIndex({ warga, filters }: WargaProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/wali-nagari/warga', { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Data Masyarakat" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Data Masyarakat 👥
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Daftar seluruh warga yang terdaftar dalam sistem SINGG Nagari.
                    </p>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="text-lg font-semibold">Tabel Warga</CardTitle>
                            <form onSubmit={handleSearch} className="flex max-w-sm items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama atau NIK..."
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" size="sm">Cari</Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] pl-4 sm:pl-6">Foto</TableHead>
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead className="hidden md:table-cell">NIK</TableHead>
                                    <TableHead className="hidden sm:table-cell">Pekerjaan</TableHead>
                                    <TableHead className="hidden lg:table-cell">Alamat</TableHead>
                                    <TableHead className="text-right pr-4 sm:pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warga.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-4 sm:pl-6">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                {item.profil?.url_foto_profil ? (
                                                    <img src={item.profil.url_foto_profil} className="h-full w-full rounded-full object-cover" />
                                                ) : (
                                                    <User className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.profil?.nama_lengkap || 'Tidak ada nama'}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{item.nik}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell font-mono text-xs">{item.nik}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-sm">{item.profil?.pekerjaan || '-'}</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm truncate max-w-[200px]">{item.profil?.alamat || '-'}</TableCell>
                                        <TableCell className="text-right pr-4 sm:pr-6">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.is_active ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {warga.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Data tidak ditemukan.
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

WargaIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Data Masyarakat', href: '#' }]}>{page}</AppLayout>
);
