import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ConversationList } from '../components/conversation-list';
import { ChatWindow } from '../components/chat-window';
import { MessageCircle } from 'lucide-react';

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
    currentUserId: string;
}

export default function PesanIndex({ conversations, currentUserId }: Props) {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(
        conversations.length > 0 ? conversations[0].id : null
    );

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <>
            <Head title="Pusat Pesan" />
            
            <div className="flex h-[calc(100vh-140px)] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <ConversationList 
                    conversations={conversations}
                    activeId={activeConversationId || undefined}
                    onSelect={setActiveConversationId}
                    currentUserId={currentUserId}
                />
                
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                    {activeConversation ? (
                        <ChatWindow 
                            key={activeConversation.id}
                            conversation={activeConversation}
                            currentUserId={currentUserId}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <MessageCircle className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Selamat Datang di Pusat Pesan</h3>
                            <p className="max-w-xs text-sm mt-1">Pilih percakapan dari daftar di sebelah kiri untuk mulai membalas pesan warga.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
