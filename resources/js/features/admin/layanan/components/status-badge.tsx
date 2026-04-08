import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { label: string; className: string }> = {
        draft: {
            label: 'Draft',
            className: 'bg-slate-100 text-slate-600 border-slate-200',
        },
        menunggu_verifikasi: {
            label: 'Menunggu Verifikasi',
            className: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        terverifikasi: {
            label: 'Terverifikasi',
            className: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        dalam_tinjauan: {
            label: 'Dalam Tinjauan',
            className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        },
        disetujui: {
            label: 'Disetujui',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        ditolak: {
            label: 'Ditolak',
            className: 'bg-red-50 text-red-700 border-red-200',
        },
        selesai: {
            label: 'Selesai',
            className: 'bg-green-100 text-green-800 border-green-200',
        },
        kedaluwarsa: {
            label: 'Kedaluwarsa',
            className: 'bg-gray-100 text-gray-600 border-gray-200',
        },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-600' };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            config.className
        )}>
            {config.label}
        </span>
    );
}
