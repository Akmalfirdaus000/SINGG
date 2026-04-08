import { Head } from '@inertiajs/react';
import { LayananListPage } from '@/features/admin/layanan/index';

interface Props {
    documents: any;
    jenisDokumen: any[];
    filters: any;
}

export default function Index({ documents, jenisDokumen, filters }: Props) {
    return (
        <>
            <Head title="Proses Permohonan Dokumen" />
            <LayananListPage 
                documents={documents} 
                jenisDokumen={jenisDokumen} 
                filters={filters} 
            />
        </>
    );
}
