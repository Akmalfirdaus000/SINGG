import { usePage, Link } from '@inertiajs/react';
import { Search, User, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Conversation {
    id: string;
    user1: any;
    user2: any;
    pesan: any[];
    unread_count: number;
    last_message_at: string;
}

interface Props {
    conversations: Conversation[];
    activeId?: string;
    onSelect: (id: string) => void;
    currentUserId: string;
}

export function ConversationList({ conversations, activeId, onSelect, currentUserId }: Props) {
    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full md:w-[350px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Pesan Warga</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Cari percakapan..." 
                        className="pl-9 bg-white border-slate-200 h-9 text-sm"
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? conversations.map((chat) => {
                    const otherUser = chat.user1.id === currentUserId ? chat.user2 : chat.user1;
                    const lastMsg = chat.pesan[0];
                    const isActive = activeId === chat.id;

                    return (
                        <button
                            key={chat.id}
                            onClick={() => onSelect(chat.id)}
                            className={cn(
                                "w-full text-left p-4 flex items-start gap-3 transition-all border-b border-slate-50",
                                isActive ? "bg-blue-50/50 relative" : "hover:bg-slate-50 group"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white transition-colors">
                                {otherUser.profil?.nama_lengkap?.charAt(0) || <User className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-semibold text-sm text-slate-900 truncate">
                                        {otherUser.profil?.nama_lengkap || 'Warga'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                        {new Date(chat.last_message_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className={cn(
                                        "text-xs truncate max-w-[180px]",
                                        chat.unread_count > 0 ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
                                    )}>
                                        {lastMsg?.isi || 'No messages yet'}
                                    </p>
                                    {chat.unread_count > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                                            {chat.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                }) : (
                    <div className="p-8 text-center text-slate-400">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Belum ada percakapan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
