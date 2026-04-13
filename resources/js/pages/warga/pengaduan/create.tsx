import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Upload, 
    X, 
    Camera, 
    FileText, 
    MapPin, 
    Shield, 
    EyeOff,
    Send,
    CheckCircle
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import warga from '@/routes/warga';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

import { LocationPicker } from '@/components/location-picker';

interface Category {
    id: string;
    nama: string;
    nama_tampilan: string;
    deskripsi?: string;
}

interface Props {
    categories: Category[];
}

export default function PengaduanCreate({ categories }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        kategori_id: '',
        deskripsi: '',
        alamat_lokasi: '',
        latitude: -6.2088, // Default to Jakarta if not set
        longitude: 106.8456,
        is_anonim: false,
        is_publik: true,
        lampiran: [] as File[],
    });

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            alamat_lokasi: address
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newFiles = [...data.lampiran, ...files];
            setData('lampiran', newFiles);

            // Generate previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = data.lampiran.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        
        // Revoke the object URL to free memory
        URL.revokeObjectURL(previews[index]);
        
        setData('lampiran', newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(warga.pengaduan.store().url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Buat Pengaduan Baru" />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-slate-100">
                        <Link href={warga.pengaduan.index().url}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-outfit">Sampaikan Keluhan Anda</h1>
                        <p className="text-slate-500 font-inter">Laporan yang Anda buat akan ditinjau oleh tim admin kami.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white p-2">
                                <CardContent className="space-y-6 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="judul" className="text-slate-700 font-semibold">Judul Laporan</Label>
                                        <Input 
                                            id="judul" 
                                            placeholder="Contoh: Lampu Jalan Mati di Dusun 1" 
                                            className="h-11 rounded-xl border-slate-200"
                                            value={data.judul}
                                            onChange={e => setData('judul', e.target.value)}
                                        />
                                        {errors.judul && <p className="text-xs text-red-500">{errors.judul}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kategori" className="text-slate-700 font-semibold">Kategori</Label>
                                        <Select value={data.kategori_id} onValueChange={(v: string) => setData('kategori_id', v)}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                                <SelectValue placeholder="Pilih Kategori Masalah" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.nama_tampilan}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.kategori_id && <p className="text-xs text-red-500">{errors.kategori_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deskripsi" className="text-slate-700 font-semibold">Deskripsi Kejadian</Label>
                                        <Textarea 
                                            id="deskripsi" 
                                            placeholder="Ceritakan detail masalah yang terjadi, waktu kejadian, dan dampak yang dirasakan..." 
                                            className="min-h-[150px] rounded-xl border-slate-200 py-3"
                                            value={data.deskripsi}
                                            onChange={e => setData('deskripsi', e.target.value)}
                                        />
                                        {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white p-2">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-blue-600" />
                                        Lampiran Foto
                                    </CardTitle>
                                    <CardDescription>Lampirkan hingga 5 foto terkait masalah untuk memperjelas laporan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {previews.map((url, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-slate-100 group">
                                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFile(i)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {previews.length < 5 && (
                                            <label className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 cursor-pointer transition-all">
                                                <Upload className="h-6 w-6 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Tambah</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                            </label>
                                        )}
                                    </div>
                                    {errors.lampiran && <p className="text-xs text-red-500">{errors.lampiran}</p>}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Options */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white">
                                <CardHeader className="p-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        Lokasi Kejadian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lokasi" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Lokasi di Peta</Label>
                                        <LocationPicker onLocationSelect={handleLocationSelect} />
                                        {errors.alamat_lokasi && <p className="text-xs text-red-500">{errors.alamat_lokasi}</p>}
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                                        <div className="p-2 bg-white rounded-md text-blue-600 h-fit shadow-sm">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Informasi lokasi membantu petugas untuk menindaklanjuti laporan lebih cepat.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>


                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white">
                                <CardHeader className="p-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-slate-400" />
                                        Privasi Laporan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-semibold">Laporan Publik</Label>
                                            <p className="text-xs text-slate-500">Dapat dilihat oleh warga lain.</p>
                                        </div>
                                        <Checkbox 
                                            checked={data.is_publik} 
                                            onCheckedChange={(v: boolean) => setData('is_publik', v)} 
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-semibold">Anonim</Label>
                                            <p className="text-xs text-slate-500">Sembunyikan identitas Anda.</p>
                                        </div>
                                        <Checkbox 
                                            checked={data.is_anonim} 
                                            onCheckedChange={(v: boolean) => setData('is_anonim', v)} 
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 shadow-xl shadow-blue-100 group"
                            >
                                {processing ? (
                                    <>Memproses...</>
                                ) : (
                                    <>
                                        Kirim Laporan
                                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

PengaduanCreate.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Pengaduan Saya', href: '/pengaduan' },
        { title: 'Buat Laporan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
