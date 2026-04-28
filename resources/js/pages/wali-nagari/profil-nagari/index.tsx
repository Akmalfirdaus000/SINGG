import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Info, Users, Landmark, Search } from 'lucide-react';

interface ProfilNagariProps {
    nagari: {
        nama: string;
        kecamatan: string;
        kabupaten: string;
        provinsi: string;
        visi: string;
        misi: string[];
        kepala_nagari: string;
    };
}

export default function ProfilNagariIndex({ nagari }: ProfilNagariProps) {
    return (
        <>
            <Head title="Profil Nagari" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Profil Nagari 🏛️
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Informasi umum dan struktur pemerintahan Nagari.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1 border-none shadow-sm overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
                        <CardContent className="-mt-12 relative">
                            <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg mx-auto mb-4 dark:bg-gray-900">
                                <div className="h-full w-full rounded-xl bg-blue-50 flex items-center justify-center dark:bg-gray-800">
                                    <Landmark className="h-10 w-10 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold">{nagari.nama}</h2>
                                <p className="text-sm text-gray-500">{nagari.kecamatan}, {nagari.kabupaten}</p>
                                <div className="mt-4 flex flex-col gap-2 text-sm text-left">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span>{nagari.provinsi}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <span>Populasi: ~5.000 Jiwa</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    Visi & Misi
                                </CardTitle>
                                <CardDescription>Pedoman jangka panjang pembangunan Nagari</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-2">Visi</h4>
                                    <p className="italic text-gray-600 dark:text-gray-300">"{nagari.visi}"</p>
                                </div>
                                <hr className="dark:border-gray-800" />
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-2">Misi</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        {nagari.misi.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>Pemerintahan Nagari</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-gray-500 mb-1">Wali Nagari</p>
                                        <p className="font-bold">{nagari.kepala_nagari}</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-gray-500 mb-1">Sekretaris Nagari</p>
                                        <p className="font-bold">Bpk. Sekretaris</p>
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

ProfilNagariIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Profil Nagari', href: '#' }]}>{page}</AppLayout>
);
