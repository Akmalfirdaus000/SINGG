import { Head } from '@inertiajs/react';
import { AntreanDashboard } from '@/features/admin/antrean/index';

interface Props {
    antrean: any[];
    statistik: any;
}

export default function Index({ antrean, statistik }: Props) {
    return (
        <>
            <Head title="Manajemen Antrean" />
            <AntreanDashboard antrean={antrean} statistik={statistik} />
        </>
    );
}
