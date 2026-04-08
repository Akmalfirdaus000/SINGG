import { Head } from '@inertiajs/react';
import { KatalogListPage } from '@/features/admin/katalog/index';

interface Props {
    katalog: any[];
}

export default function Index({ katalog }: Props) {
    return (
        <>
            <Head title="Katalog Layanan" />
            <KatalogListPage katalog={katalog} />
        </>
    );
}
