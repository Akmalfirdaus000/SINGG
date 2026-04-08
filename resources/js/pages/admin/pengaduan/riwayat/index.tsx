import { Head } from '@inertiajs/react';
import { PengaduanListPage } from '@/features/admin/pengaduan/index';

interface Props {
    pengaduans: any;
    kategori: any[];
    filters: any;
}

export default function RiwayatIndex({ pengaduans, kategori, filters }: Props) {
    return (
        <>
            <Head title="Riwayat Pengaduan" />
            <PengaduanListPage 
                pengaduans={pengaduans} 
                kategori={kategori} 
                filters={filters}
                title="Riwayat Pengaduan"
                description="Daftar laporan yang telah selesai diproses atau ditolak."
                isRiwayat={true}
            />
        </>
    );
}
