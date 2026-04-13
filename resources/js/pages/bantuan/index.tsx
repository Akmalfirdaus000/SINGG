import { Head } from '@inertiajs/react';
import { 
    Search, 
    MessageCircle, 
    HelpCircle, 
    ChevronDown, 
    HelpCircle as HelpIcon,
    ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'; // Using the standard layout

interface Faq {
    id: string;
    pertanyaan: string;
    jawaban: string;
    kategori: string;
}

interface Props {
    faqs: Faq[];
}

export default function BantuanIndex({ faqs }: Props) {
    const [search, setSearch] = useState('');

    const filteredFaqs = faqs.filter(faq => 
        faq.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
        faq.jawaban.toLowerCase().includes(search.toLowerCase())
    );

    const categories = ['umum', 'pengaduan', 'layanan', 'akun', 'teknis'];

    return (
        <>
            <Head title="Pusat Bantuan & FAQ" />

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-outfit">Ada yang bisa kami bantu?</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-inter">
                        Cari jawaban untuk pertanyaan Anda atau jelajahi kategori bantuan di bawah ini.
                    </p>
                    <div className="relative max-w-xl mx-auto mt-8">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input 
                            placeholder="Ketik pertanyaan Anda di sini..." 
                            className="pl-12 h-12 text-lg rounded-2xl border-slate-200 shadow-xl shadow-slate-100 ring-offset-blue-600 focus-visible:ring-blue-600"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden group">
                        <CardContent className="p-6 relative">
                            <MessageCircle className="h-12 w-12 opacity-20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-2">Hubungi Kami</h3>
                            <p className="text-blue-100 text-sm mb-4">Masih butuh bantuan? Tim kami siap membantu Anda melalui layanan pengaduan.</p>
                            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 border-none" asChild>
                                <a href="/pengaduan">Kirim Aduan <ArrowRight className="ml-2 h-4 w-4" /></a>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white overflow-hidden group">
                        <CardContent className="p-6 relative">
                            <HelpIcon className="h-12 w-12 text-slate-100 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Panduan Pengguna</h3>
                            <p className="text-slate-500 text-sm mb-4">Unduh buku panduan lengkap penggunaan aplikasi Si Nagari Gasan Gadang.</p>
                            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">Unduh PDF</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit">Pertanyaan Umum</h2>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 unrounded border-none px-3">
                            {filteredFaqs.length} Artikel
                        </Badge>
                    </div>

                    {filteredFaqs.length > 0 ? (
                        <div className="w-full space-y-4">
                            {categories.map(cat => {
                                const catFaqs = filteredFaqs.filter(f => f.kategori === cat);
                                if (catFaqs.length === 0) return null;

                                return (
                                    <div key={cat} className="space-y-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8 flex items-center gap-2">
                                            <span className="h-px w-8 bg-slate-200"></span> {cat}
                                        </h4>
                                        {catFaqs.map((faq) => (
                                            <Collapsible key={faq.id} className="border border-slate-200 rounded-2xl bg-white overflow-hidden px-2 shadow-sm transition-all hover:ring-2 hover:ring-blue-50">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-lg font-semibold text-slate-800 py-4 px-4">
                                                    {faq.pertanyaan}
                                                    <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="text-slate-600 text-base leading-relaxed pb-6 px-4">
                                                    {faq.jawaban}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">Tidak ada hasil ditemukan</h3>
                            <p className="text-slate-500">Coba gunakan kata kunci lain atau jelajahi kategori yang tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

BantuanIndex.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[{ title: 'Pusat Bantuan', href: '#' }]}>{page}</AppSidebarLayout>
);
