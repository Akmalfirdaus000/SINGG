import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'draft' | 'menunggu_verifikasi' | 'terverifikasi' | 'dalam_proses' | 'selesai' | 'ditutup' | 'ditolak';
export type PrioritasType = 'rendah' | 'sedang' | 'tinggi' | 'urgent';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config: Record<StatusType, { label: string; className: string }> = {
        draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
        menunggu_verifikasi: { label: 'Menunggu Verifikasi', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
        terverifikasi: { label: 'Terverifikasi', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
        dalam_proses: { label: 'Dalam Proses', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
        selesai: { label: 'Selesai', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
        ditutup: { label: 'Ditutup', className: 'bg-gray-200 text-gray-700 hover:bg-gray-300' },
        ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
    };

    const item = config[status] || { label: status, className: '' };

    return (
        <Badge className={cn('whitespace-nowrap border-none font-medium', item.className, className)}>
            {item.label}
        </Badge>
    );
}

interface PrioritasBadgeProps {
    prioritas: PrioritasType;
    className?: string;
}

export function PrioritasBadge({ prioritas, className }: PrioritasBadgeProps) {
    const config: Record<PrioritasType, { label: string; className: string }> = {
        rendah: { label: 'Rendah', className: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        sedang: { label: 'Sedang', className: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
        tinggi: { label: 'Tinggi', className: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
        urgent: { label: 'Urgent', className: 'bg-red-50 text-red-600 hover:bg-red-100' },
    };

    const item = config[prioritas] || { label: prioritas, className: '' };

    return (
        <Badge className={cn('whitespace-nowrap border-none font-medium', item.className, className)}>
            {item.label}
        </Badge>
    );
}
