import { useState, useEffect, useRef } from 'react';
import { Send, User, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import axios from 'axios';
import admin from '@/routes/admin';

interface Message {
    id: string;
    pengirim_id: string;
    isi: string;
    created_at: string;
    status_pesan: string;
    is_dibaca: boolean;
    pengirim: {
        profil?: {
            nama_lengkap: string;
        }
    }
}

interface Conversation {
    id: string;
    user1: any;
    user2: any;
}

interface Props {
    conversation: Conversation;
    currentUserId: string;
}

export function ChatWindow({ conversation, currentUserId }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const otherUser = conversation.user1.id === currentUserId ? conversation.user2 : conversation.user1;

    const fetchMessages = async () => {
        try {
            const res = await axios.get(admin.pesan.show(conversation.id).url);
            setMessages(res.data.messages);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchMessages();
    }, [conversation.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await axios.post(admin.pesan.store(conversation.id).url, {
                isi: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {otherUser.profil?.nama_lengkap?.charAt(0) || 'W'}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{otherUser.profil?.nama_lengkap || 'Warga'}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] text-slate-500 font-medium">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : messages.map((msg) => {
                    const isMe = msg.pengirim_id === currentUserId;

                    return (
                        <div key={msg.id} className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start"
                        )}>
                            <div className={cn(
                                "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                isMe 
                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                    : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                            )}>
                                <p className="leading-relaxed">{msg.isi}</p>
                                <div className={cn(
                                    "flex items-center gap-1 mt-1 justify-end",
                                    isMe ? "text-blue-100" : "text-slate-400"
                                )}>
                                    <span className="text-[10px] opacity-70">
                                        {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        msg.is_dibaca ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input 
                        placeholder="Ketik pesan Anda..." 
                        className="flex-1 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                    <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={sending || !newMessage.trim()}>
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
