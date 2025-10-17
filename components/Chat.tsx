import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ChatMessage, ChatConversation } from '../types';
import { SendIcon, SearchIcon, UserIcon, ChatIcon } from './icons';

// --- MOCK DATA ---
const getInitialConversations = (): ChatConversation[] => [
    {
        contactId: 'cust-1',
        contactName: 'Suresh Patel',
        contactPhone: '9876543210',
        messages: [
            { id: 'msg1', text: 'Hello, I have a question about my gold scheme.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), senderId: '9876543210' },
            { id: 'msg2', text: 'Of course, Mr. Patel. How can I help you today?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), senderId: 'provider' },
            { id: 'msg3', text: 'I want to know the current accumulated grams.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), senderId: '9876543210' },
        ],
        lastMessagePreview: 'I want to know the current accumulated grams.',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        unreadCount: 1,
    },
    {
        contactId: 'cust-2',
        contactName: 'Anita Verma',
        contactPhone: '9988776655',
        messages: [
             { id: 'msg4', text: 'Good morning!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), senderId: 'provider' },
        ],
        lastMessagePreview: 'Good morning!',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        unreadCount: 0,
    },
    {
        contactId: 'cust-3',
        contactName: 'Rajesh Singh',
        contactPhone: '9123456789',
        messages: [],
        lastMessagePreview: 'No messages yet...',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        unreadCount: 0,
    }
];

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const Chat: React.FC = () => {
    const { role, user } = useAuth();
    const [conversations, setConversations] = useState<ChatConversation[]>(getInitialConversations);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isCustomer = role === 'customer';

    const customerConversation: ChatConversation | undefined = useMemo(() => {
        if (!isCustomer) return undefined;
        // Find the conversation for this customer, or create a placeholder
        const existingConvo = conversations.find(c => c.contactPhone === user?.identifier);
        return {
            contactId: 'provider',
            contactName: 'FinGold Support',
            messages: existingConvo?.messages || [],
            lastMessagePreview: existingConvo?.lastMessagePreview || 'We are here to help you.',
            lastMessageTimestamp: existingConvo?.lastMessageTimestamp || new Date().toISOString(),
        };
    }, [isCustomer, conversations, user]);
    
    useEffect(() => {
        if (isCustomer) {
            setSelectedContactId('provider');
        } else if (conversations.length > 0 && !selectedContactId) {
            setSelectedContactId(conversations[0].contactId);
        }
    }, [isCustomer, conversations, selectedContactId]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [conversations, selectedContactId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContactId) return;

        const senderId = isCustomer ? user?.identifier || 'customer' : 'provider';
        const contactIdentifier = isCustomer ? user?.identifier : selectedContactId;
        
        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            timestamp: new Date().toISOString(),
            senderId,
        };

        setConversations(prev =>
            prev.map(convo => {
                const isTargetConvo = isCustomer ? convo.contactPhone === contactIdentifier : convo.contactId === contactIdentifier;
                if (isTargetConvo) {
                    return {
                        ...convo,
                        messages: [...convo.messages, message],
                        lastMessagePreview: newMessage,
                        lastMessageTimestamp: message.timestamp,
                    };
                }
                return convo;
            })
        );
        
        setNewMessage('');
        
        // Simulate a reply
        if (senderId !== 'provider') {
            setTimeout(() => {
                 const reply: ChatMessage = {
                    id: `msg-${Date.now()+1}`,
                    text: 'Thank you for your message. We will get back to you shortly.',
                    timestamp: new Date().toISOString(),
                    senderId: 'provider',
                };
                setConversations(prev =>
                    prev.map(convo => {
                        const isTargetConvo = isCustomer ? convo.contactPhone === contactIdentifier : convo.contactId === contactIdentifier;
                        if (isTargetConvo) {
                            return { ...convo, messages: [...convo.messages, reply], lastMessagePreview: reply.text, lastMessageTimestamp: reply.timestamp, unreadCount: (convo.unreadCount || 0) + 1 };
                        }
                        return convo;
                    })
                );
            }, 1500);
        }
    };

    const currentChat = useMemo(() => {
        if (isCustomer) return customerConversation;
        return conversations.find(c => c.contactId === selectedContactId);
    }, [isCustomer, selectedContactId, conversations, customerConversation]);

    // List of contacts to display
    const contactList = useMemo(() => {
        if (isCustomer) return customerConversation ? [customerConversation] : [];
        return conversations
            .filter(c => c.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.lastMessageTimestamp || 0).getTime() - new Date(a.lastMessageTimestamp || 0).getTime());
    }, [isCustomer, conversations, searchTerm, customerConversation]);

    return (
        <div className="flex flex-col h-full">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Chat</h1>
                <p className="text-slate-500 dark:text-slate-400">Communicate with {isCustomer ? 'support' : 'your customers'}.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 mt-6">
                {/* Left Panel: Contact List */}
                {!isCustomer && (
                    <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col">
                        <h2 className="font-semibold mb-4 text-lg">Contacts ({contactList.length})</h2>
                        <div className="relative mb-2">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/>
                            <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 bg-slate-100 dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div className="overflow-y-auto flex-grow -mr-2 pr-2">
                            {contactList.map(convo => (
                                <div 
                                    key={convo.contactId} 
                                    onClick={() => setSelectedContactId(convo.contactId)} 
                                    className={`p-3 rounded-lg cursor-pointer mb-2 flex gap-3 items-center ${selectedContactId === convo.contactId ? 'bg-gold-100 dark:bg-gold-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                                >
                                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0"><UserIcon className="h-6 w-6"/></div>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold truncate">{convo.contactName}</p>
                                            <p className="text-xs text-slate-500 shrink-0">{formatDate(convo.lastMessageTimestamp || '')}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{convo.lastMessagePreview}</p>
                                            {convo.unreadCount && convo.unreadCount > 0 && (
                                                <span className="bg-gold-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">{convo.unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Right Panel: Chat Window */}
                <div className={`w-full ${isCustomer ? 'md:w-full' : 'md:w-2/3'} bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col`}>
                    {currentChat ? (
                        <>
                            <div className="p-4 border-b dark:border-slate-700 flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center"><UserIcon className="h-6 w-6"/></div>
                                <h2 className="font-bold text-lg">{currentChat.contactName}</h2>
                            </div>
                            <div className="overflow-y-auto flex-grow p-4 space-y-4">
                               {currentChat.messages.map(msg => {
                                   const myId = isCustomer ? user?.identifier : 'provider';
                                   const isMe = msg.senderId === myId;
                                   return (
                                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                           <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isMe ? 'bg-gold-500 text-white rounded-br-lg' : 'bg-slate-200 dark:bg-slate-700 rounded-bl-lg'}`}>
                                               <p className="text-sm">{msg.text}</p>
                                               <p className={`text-xs mt-1 text-right ${isMe ? 'text-white/70' : 'text-slate-500'}`}>{formatDate(msg.timestamp)}</p>
                                           </div>
                                       </div>
                                   );
                               })}
                               <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 mt-auto border-t dark:border-slate-700 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                                <input 
                                    type="text" 
                                    value={newMessage} 
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500"
                                    aria-label="Chat message input"
                                />
                                <button type="submit" aria-label="Send message" disabled={!newMessage.trim()} className="p-3 bg-gold-500 text-white rounded-full hover:bg-gold-600 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                                    <SendIcon className="h-6 w-6"/>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col justify-center items-center text-slate-500 p-8 text-center">
                            <ChatIcon className="h-16 w-16 mb-4 text-slate-400"/>
                            <h2 className="text-xl font-semibold">Welcome to Chat</h2>
                            <p>Select a conversation to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
