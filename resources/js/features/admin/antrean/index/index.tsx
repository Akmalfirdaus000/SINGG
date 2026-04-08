import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    Clock, 
    Play, 
    CheckCircle2, 
    XCircle, 
    Users, 
    Timer,
    RotateCcw,
    ChevronRight,
    AlertCircle,
    User,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface Antrean {
    id: string;
    nomor_antrean: string;
    jenis_layanan: string;
    status: 'menunggu' | 'dipanggil' | 'selesai' | 'batal';
    user?: {
        profil?: {
            nama_lengkap: string;
        }
    };
    created_at: string;
}

interface Props {
    antrean: Antrean[];
    statistik: {
        total: number;
        menunggu: number;
        dipanggil: number;
        selesai: number;
        current: string;
    }
}

export function AntreanDashboard({ antrean, statistik }: Props) {
    const { post, delete: destroy, processing } = useForm();

    const handleCallNext = () => {
        post(admin.antrean.next().url, {
            preserveScroll: true
        });
    };

    const handleStatusUpdate = (id: string, status: string) => {
        router.post(admin.antrean.update(id).url, {
            status: status
        } as any, {
            preserveScroll: true
        });
    };

    const handleReset = () => {
        if (window.confirm('Yakin ingin mengosongkan antrean hari ini? Tindakan ini tidak dapat dibatalkan.')) {
            destroy(admin.antrean.reset().url);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Antrean</h1>
                    <p className="text-muted-foreground">Monitor dan panggil antrean layanan hari ini.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Antrean
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider">Nomor Sekarang</CardDescription>
                        <CardTitle className="text-4xl font-extrabold text-blue-600">{statistik.current}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-amber-50/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider text-amber-600">Menunggu</CardDescription>
                        <CardTitle className="text-3xl font-bold">{statistik.menunggu}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-emerald-50/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider text-emerald-600">Selesai</CardDescription>
                        <CardTitle className="text-3xl font-bold">{statistik.selesai}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Hari Ini</CardDescription>
                        <CardTitle className="text-3xl font-bold">{statistik.total}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALL NEXT AREA */}
                <Card className="lg:col-span-1 border-none shadow-lg ring-1 ring-blue-100 bg-blue-50/20">
                    <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <Clock className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Panggil Antrean</h2>
                            <p className="text-sm text-slate-500">Klik tombol di bawah untuk memanggil nomor antrean berikutnya secara otomatis.</p>
                        </div>
                        <Button 
                            className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                            onClick={handleCallNext}
                            disabled={processing || statistik.menunggu === 0}
                        >
                            <Play className="h-6 w-6 mr-3 fill-current" />
                            PANGGIL BERIKUTNYA
                        </Button>
                        {statistik.menunggu === 0 && (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-100">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Tidak ada antrean menunggu
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* QUEUE LIST */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-slate-400" />
                            Daftar Antrean Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                            {antrean.length > 0 ? antrean.map((item) => (
                                <div key={item.id} className={cn(
                                    "flex items-center justify-between p-4 transition-colors",
                                    item.status === 'dipanggil' ? "bg-blue-50/50" : "hover:bg-slate-50/30"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg",
                                            item.status === 'menunggu' && "bg-slate-100 text-slate-500",
                                            item.status === 'dipanggil' && "bg-blue-100 text-blue-600 animate-pulse",
                                            item.status === 'selesai' && "bg-emerald-100 text-emerald-600",
                                            item.status === 'batal' && "bg-red-50 text-red-500"
                                        )}>
                                            {item.nomor_antrean}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                {item.user?.profil?.nama_lengkap || 'Guest Citizen'}
                                                {item.status === 'dipanggil' && (
                                                    <Badge className="bg-blue-600 text-[10px] h-4">SEDANG DIPANGGIL</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <Tag className="h-3 w-3" />
                                                    {item.jenis_layanan || 'Layanan Umum'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Timer className="h-3 w-3" />
                                                    {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.status === 'menunggu' && (
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleStatusUpdate(item.id, 'batal')}>Batal</Button>
                                        )}
                                        {item.status === 'dipanggil' && (
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8" onClick={() => handleStatusUpdate(item.id, 'selesai')}>
                                                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                Selesai
                                            </Button>
                                        )}
                                        {item.status === 'selesai' && (
                                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mr-2">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Sudah Dilayani
                                            </span>
                                        )}
                                        {item.status === 'batal' && (
                                            <span className="text-xs text-red-400 font-medium">Dibatalkan</span>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-slate-400">
                                    <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p>Belum ada antrean hari ini.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
