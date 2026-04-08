import { Head } from '@inertiajs/react';
import { PengaduanDetailPage } from '@/features/admin/pengaduan/detail';

interface Props {
    pengaduan: any;
}

export default function Detail({ pengaduan }: Props) {
    return (
        <>
            <Head title={`Detail Pengaduan ${pengaduan.nomor_pengaduan}`} />
            <PengaduanDetailPage pengaduan={pengaduan} />
        </>
    );
}
