import { Calendar, User, Info } from 'lucide-react';
import { StatusBadge } from '../components/status-badge';
import { cn } from '@/lib/utils';

export interface TimelineEntry {
    id: string;
    status_baru: any;
    status_lama: any;
    catatan: string;
    created_at: string;
    user?: {
        profil: {
            nama_lengkap: string;
        }
    };
}

interface TimelineProps {
    entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
    if (entries.length === 0) return null;

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-slate-100 before:to-transparent">
            {entries.map((entry, idx) => (
                <div key={entry.id} className="relative flex items-start gap-6 group">
                    <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ring-1 ring-slate-100 transition-all",
                        idx === 0 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-slate-50 text-slate-400"
                    )}>
                        {idx === 0 ? (
                            <Info className="h-4 w-4" />
                        ) : (
                            <Calendar className="h-4 w-4" />
                        )}
                    </div>
                    <div className="flex-1 space-y-2 pt-1.5">
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "font-semibold",
                                    idx === 0 ? "text-slate-900" : "text-slate-600"
                                )}>
                                    Status Diperbarui Menjadi
                                </span>
                                <StatusBadge status={entry.status_baru} className="scale-90" />
                            </div>
                            <time className="text-xs text-slate-400 font-medium">
                                {new Date(entry.created_at).toLocaleString('id-ID', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </time>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                                {entry.catatan || "Tidak ada catatan."}
                            </p>
                        </div>
                        {entry.user && (
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <User className="h-3 w-3" />
                                <span>Oleh: {entry.user.profil.nama_lengkap}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
