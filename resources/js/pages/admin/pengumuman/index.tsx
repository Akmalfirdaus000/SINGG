import AppLayout from '@/layouts/app-layout';
import { PengumumanListPage } from '@/features/admin/pengumuman/index';

interface Props {
    pengumuman: any;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Berita & Pengumuman', href: '/admin/pengumuman' },
];

export default function Index({ pengumuman }: Props) {
    return (
        <div className="p-4 h-full">
            <PengumumanListPage pengumuman={pengumuman} />
        </div>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
