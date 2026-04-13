import AppLayout from '@/layouts/app-layout';
import PesanIndexFeature from '@/features/admin/pesan/index/index';

interface Props {
    conversations: any[];
    currentUserId: string;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pusat Pesan', href: '/admin/pesan' },
];

export default function PesanIndex({ conversations, currentUserId }: Props) {
    return (
        <div className="p-4 h-full">
            <PesanIndexFeature 
                conversations={conversations} 
                currentUserId={currentUserId} 
            />
        </div>
    );
}

PesanIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
