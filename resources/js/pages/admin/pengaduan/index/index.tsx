import { Head } from '@inertiajs/react';
import { PengaduanListPage } from '@/features/admin/pengaduan/index';

interface Props {
    pengaduans: any;
    kategori: any[];
    filters: any;
}

export default function Index({ pengaduans, kategori, filters }: Props) {
    return (
        <>
            <Head title="Manajemen Pengaduan" />
            <PengaduanListPage 
                pengaduans={pengaduans} 
                kategori={kategori} 
                filters={filters} 
            />
        </>
    );
}
