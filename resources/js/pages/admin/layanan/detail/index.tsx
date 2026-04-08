import { Head } from '@inertiajs/react';
import { LayananDetailPage } from '@/features/admin/layanan/detail';

interface Props {
    document: any;
}

export default function Detail({ document }: Props) {
    return (
        <>
            <Head title={`Detail Permohonan - ${document.nomor_dokumen}`} />
            <LayananDetailPage document={document} />
        </>
    );
}
