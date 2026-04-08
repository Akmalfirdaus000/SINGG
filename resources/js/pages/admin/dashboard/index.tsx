import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardFeature from '@/features/admin/dashboard';
import type { Auth } from '@/types';
import { dashboard } from '@/routes';

interface DashboardProps {
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

export default function Dashboard({ stats, latest, announcements, unread }: DashboardProps) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;

    return (
        <>
            <Head title="Panel Administrasi Nagari" />

            <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {/* Header Greeting */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            Panel Administrasi Nagari 👋
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Selamat datang kembali, {user.profil?.nama_lengkap || 'Admin'}. Berikut adalah ringkasan aktivitas Nagari hari ini.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Laporan Lengkap
                        </Button>
                    </div>
                </div>

                <DashboardFeature stats={stats} latest={latest} announcements={announcements} unread={unread} />
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: dashboard() }]}>{page}</AppLayout>
);
