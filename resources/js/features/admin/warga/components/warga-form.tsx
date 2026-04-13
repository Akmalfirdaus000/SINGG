import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import { useEffect } from 'react';

interface WargaFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warga?: any;
}

export function WargaForm({ open, onOpenChange, warga }: WargaFormProps) {
    const isEdit = !!warga;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nik: '',
        nama_lengkap: '',
        email: '',
        phone: '',
        password: '',
        alamat: '',
        jenis_kelamin: '',
        is_active: 1,
    });

    useEffect(() => {
        if (open) {
            if (isEdit) {
                setData({
                    nik: warga.nik || '',
                    nama_lengkap: warga.profil?.nama_lengkap || '',
                    email: warga.email || '',
                    phone: warga.phone || '',
                    password: '', // Password empty on edit unless user wants to change it
                    alamat: warga.profil?.alamat || '',
                    jenis_kelamin: warga.profil?.jenis_kelamin || '',
                    is_active: warga.is_active ? 1 : 0,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [open, warga]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(admin.warga.update(warga.id).url, {
                onSuccess: () => onOpenChange(false),
            });
        } else {
            post(admin.warga.store().url, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Data Warga' : 'Tambah Warga Baru'}</DialogTitle>
                        <DialogDescription>
                            Isi detail informasi warga di bawah ini. {isEdit ? 'Kosongkan password jika tidak ingin mengubahnya.' : ''}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nik" className="text-right">NIK</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="nik" 
                                    value={data.nik} 
                                    onChange={e => setData('nik', e.target.value)} 
                                    maxLength={16}
                                    placeholder="16 digit NIK"
                                    disabled={isEdit}
                                />
                                {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama" className="text-right">Nama</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="nama" 
                                    value={data.nama_lengkap} 
                                    onChange={e => setData('nama_lengkap', e.target.value)} 
                                    placeholder="Nama lengkap sesuai KTP"
                                />
                                {errors.nama_lengkap && <p className="text-xs text-red-500 mt-1">{errors.nama_lengkap}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="alamat@email.com"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                                    required={!isEdit}
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender" className="text-right">Gender</Label>
                            <div className="col-span-3">
                                <Select 
                                    value={data.jenis_kelamin} 
                                    onValueChange={v => setData('jenis_kelamin', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kelamin && <p className="text-xs text-red-500 mt-1">{errors.jenis_kelamin}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat" className="text-right">Alamat</Label>
                            <div className="col-span-3">
                                <Textarea 
                                    id="alamat" 
                                    value={data.alamat} 
                                    onChange={e => setData('alamat', e.target.value)} 
                                    placeholder="Alamat lengkap domisili"
                                />
                                {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat}</p>}
                            </div>
                        </div>

                        {isEdit && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <div className="col-span-3">
                                    <Select 
                                        value={data.is_active.toString()} 
                                        onValueChange={v => setData('is_active', parseInt(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Aktif</SelectItem>
                                            <SelectItem value="0">Nonaktif (Suspended)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Data' : 'Simpan Warga')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
