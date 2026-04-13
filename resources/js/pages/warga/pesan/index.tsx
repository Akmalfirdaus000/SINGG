import { Head, Link, usePage } from '@inertiajs/react';
import { 
    MessageSquare, 
    Search, 
    Plus, 
    User, 
    Clock, 
    ChevronRight,
    MessagesSquare,
    Info,
    Send
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import warga from '@/routes/warga';
import axios from 'axios';

interface Message {
    id: string;
    percakapan_id: string;
    pengirim_id: string;
    isi: string;
    status_pesan: string;
    is_dibaca: boolean;
    created_at: string;
    pengirim: {
        profil: {
            nama_lengkap: string;
            url_foto_profil?: string;
        }
    }
}

interface Conversation {
    id: string;
    user_id_1: string;
    user_id_2: string;
    status: string;
    context_type?: string;
    context_id?: string;
    context_label?: string;
    last_message_at: string;
    unread_count: number;
    user1: { id: string; profil: { nama_lengkap: string; url_foto_profil?: string } };
    user2: { id: string; profil: { nama_lengkap: string; url_foto_profil?: string } };
    pesan: Message[];
}

interface Props {
    conversations: Conversation[];
    currentUserId: string;
    selectedId?: string;
}

export default function PesanIndex({ conversations, currentUserId, selectedId }: Props) {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedId) {
            const conv = conversations.find(c => c.id === selectedId);
            if (conv) handleSelectConversation(conv);
        }
    }, [selectedId, conversations]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSelectConversation = async (conv: Conversation) => {
        setSelectedConversation(conv);
        setIsLoading(true);
        try {
            const response = await axios.get(warga.pesan.show(conv.id).url);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const text = newMessage;
        setNewMessage('');

        try {
            const response = await axios.post(warga.pesan.store(selectedConversation.id).url, {
                isi: text
            });
            // Optimization: append message locally
            const sentMessage = response.data;
            // Since we need pengirim.profil for display
            const fullMessage = {
                ...sentMessage,
                pengirim: {
                    profil: {
                        nama_lengkap: 'Anda', // Simplified for local update
                    }
                }
            };
            setMessages([...messages, fullMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredConversations = conversations.filter(c => {
        const otherUser = c.user_id_1 === currentUserId ? c.user2 : c.user1;
        return otherUser.profil.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (c.context_label && c.context_label.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <>
            <Head title="Pusat Pesan & Diskusi" />

            <div className="h-[calc(100vh-120px)] max-w-7xl mx-auto px-4 py-4 md:py-8">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col md:flex-row">
                    
                    {/* Sidebar: Conv List */}
                    <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-black text-slate-900 font-outfit">Pesan</h1>
                                <Button size="icon" variant="ghost" asChild className="rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                    <Link href={warga.pesan.start().url}>
                                        <Plus className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Cari pesan atau urusan..." 
                                    className="pl-10 h-11 rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-100 focus-visible:ring-blue-500"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto">
                            <div className="px-3 pb-6 space-y-1">
                                {filteredConversations.map((conv) => {
                                    const otherUser = conv.user_id_1 === currentUserId ? conv.user2 : conv.user1;
                                    const lastMsg = conv.pesan[0];
                                    const isActive = selectedConversation?.id === conv.id;

                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group ${
                                                isActive ? 'bg-white shadow-md ring-1 ring-slate-100' : 'hover:bg-white/60'
                                            }`}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                    <AvatarImage src={otherUser.profil.url_foto_profil} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                                        {otherUser.profil.nama_lengkap.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {conv.unread_count > 0 && (
                                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                        {conv.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className="font-bold text-slate-800 truncate text-sm">
                                                        {otherUser.profil.nama_lengkap}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-inter">
                                                        {new Date(conv.last_message_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 bg-slate-100 text-slate-500 font-semibold uppercase tracking-tighter">
                                                        {conv.context_label || 'Umum'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate font-inter">
                                                    {lastMsg?.isi || 'Belum ada pesan'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow flex flex-col h-full bg-white">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={(selectedConversation.user_id_1 === currentUserId ? selectedConversation.user2 : selectedConversation.user1).profil.url_foto_profil} />
                                            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                                {(selectedConversation.user_id_1 === currentUserId ? selectedConversation.user2 : selectedConversation.user1).profil.nama_lengkap.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm md:text-base">
                                                {(selectedConversation.user_id_1 === currentUserId ? selectedConversation.user2 : selectedConversation.user1).profil.nama_lengkap}
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                <span className="text-[10px] md:text-xs text-slate-400 font-inter">Aktif Melayani</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                                            {selectedConversation.context_label}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-grow px-4 md:px-8 py-6 bg-slate-50/30 overflow-y-auto">
                                    <div className="space-y-6">
                                        <div className="flex justify-center">
                                            <div className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                                                Percakapan dimulai pada {new Date(selectedConversation.last_message_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>

                                        {messages.map((msg, i) => {
                                            const isMe = msg.pengirim_id === currentUserId;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                        <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                                                            isMe 
                                                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                                                            : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                                                        }`}>
                                                            {msg.isi}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-inter flex items-center gap-1">
                                                            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            {isMe && <div className={`h-1 w-1 rounded-full ${msg.is_dibaca ? 'bg-blue-600' : 'bg-slate-300'}`} />}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={scrollRef} />
                                    </div>
                                </div>

                                {/* Input */}
                                <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                        <Input 
                                            placeholder="Ketik pesan Anda di sini..." 
                                            className="flex-grow h-12 md:h-14 rounded-2xl border-none bg-slate-50 px-6 focus-visible:ring-blue-600"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                        />
                                        <Button type="submit" className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all p-0">
                                            <Send className="h-5 w-5 md:h-6 md:w-6" />
                                        </Button>
                                    </form>
                                    <p className="mt-4 text-[10px] text-slate-400 font-inter text-center">
                                        Pesan Anda akan dibalas oleh Admin Nagari pada jam kerja.
                                    </p>
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center p-8 bg-slate-50/20">
                                <div className="p-8 bg-white rounded-full shadow-xl shadow-slate-100 relative">
                                    <MessagesSquare className="h-20 w-20 text-blue-600" />
                                    <div className="absolute -top-2 -right-2 p-3 bg-blue-100 text-blue-600 rounded-2xl animate-bounce">
                                        <Send size={24} />
                                    </div>
                                </div>
                                <div className="space-y-2 max-w-sm">
                                    <h2 className="text-2xl font-black text-slate-900 font-outfit">Halo, Ada yang bisa kami bantu?</h2>
                                    <p className="text-slate-400 font-inter text-sm leading-relaxed">
                                        Pilih percakapan yang sudah ada atau mulai diskusi baru mengenai pengaduan dan layanan Anda.
                                    </p>
                                </div>
                                <Button asChild className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-14 px-8 shadow-xl shadow-blue-100 font-bold transition-all hover:scale-105 active:scale-95">
                                    <Link href={warga.pesan.start().url}>
                                        <Plus className="mr-2 h-5 w-5" />
                                        Mulai Diskusi Baru
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

PesanIndex.layout = (page: React.ReactNode) => (
    <AppSidebarLayout breadcrumbs={[
        { title: 'Komunikasi', href: '#' },
        { title: 'Pusat Pesan', href: '#' }
    ]}>{page}</AppSidebarLayout>
);
