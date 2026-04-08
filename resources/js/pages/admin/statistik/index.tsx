import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import StatistikFeature from '@/features/admin/statistik';

interface StatistikProps {
    summary: {
        pelayanan: {
            total: number;
            selesai: number;
            proses: number;
        };
        pengaduan: {
            total: number;
            selesai: number;
        };
    };
    charts: {
        trend: any[];
        distribusi: any[];
        performa: any[];
    };
}

export default function Statistik({ summary, charts }: StatistikProps) {
    return (
        <>
            <Head title="Statistik Pelayanan Nagari" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            Statistik Pelayanan Nagari 📊
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Analisis data performa pelayanan dan pengaduan masyarakat Nagari Gasan Gadang.
                        </p>
                    </div>
                </div>

                <StatistikFeature summary={summary} charts={charts} />
            </div>
        </>
    );
}

Statistik.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Statistik Pelayanan', href: '#' }]}>{page}</AppLayout>
);
