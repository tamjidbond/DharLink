import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPaperPlane, FaInbox, FaSearch, FaArrowLeft, FaPlus, FaBoxOpen, FaCircle, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import ChatSkeleton from '../Components/Skeletons/ChatSkeleton';

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const userEmail = localStorage.getItem('userEmail');
    const scrollRef = useRef();
    const navigate = useNavigate();

    // Redesigned Toast for the White Theme
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#ffffff',
        color: '#1e293b',
        customClass: { popup: 'rounded-2xl shadow-xl border border-slate-100' }
    });

    const fetchChats = async () => {
        try {
            const res = await axios.get(`https://dharnow.onrender.com/api/messages/${userEmail}`);
            const uniquePeople = [...new Set(res.data.map(m =>
                m.senderEmail === userEmail ? m.receiverEmail : m.senderEmail
            ))];
            setConversations(uniquePeople);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { if (userEmail) fetchChats(); }, [userEmail]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const res = await axios.get(`https://dharnow.onrender.com/api/users/search?query=${query}`);
                setSearchResults(res.data.filter(u => u.email !== userEmail));
            } catch (err) { console.error("Search failed"); }
        } else { setSearchResults([]); }
    };

    useEffect(() => {
        if (activeChat) {
            const markAsReadAndFetch = async () => {
                try {
                    const res = await axios.get(`https://dharnow.onrender.com/api/messages/thread/${userEmail}/${activeChat}`);
                    setMessages(res.data);
                    if (res.data.some(m => !m.isRead && m.receiverEmail === userEmail)) {
                        await axios.patch(`https://dharnow.onrender.com/api/messages/read-thread/${userEmail}/${activeChat}`);
                        window.dispatchEvent(new Event('messagesRead'));
                    }
                } catch (err) { console.error("Chat sync error", err); }
            };
            markAsReadAndFetch();
            const interval = setInterval(markAsReadAndFetch, 4000);
            return () => clearInterval(interval);
        }
    }, [activeChat, userEmail]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const msgData = { senderEmail: userEmail, receiverEmail: activeChat, text: newMessage, itemTitle: "Chat Message" };
        try {
            await axios.post('https://dharnow.onrender.com/api/messages/send', msgData);
            setMessages([...messages, { ...msgData, createdAt: new Date() }]);
            setNewMessage("");
            if (!conversations.includes(activeChat)) fetchChats();
        } catch (err) { Toast.fire({ icon: 'error', title: 'Uplink Failed' }); }
    };

    if (loading) return <ChatSkeleton />

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex items-center justify-center font-sans">
            {/* MAIN MAC-STYLE CONTAINER */}
            <div className="w-full max-w-7xl h-[65vh] bg-white/80 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex overflow-hidden relative">
                
                {/* SIDEBAR: NEIGHBOR LIST */}
                <aside className={`w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-white/40 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900">Uplink</h2>
                            {/* Mac Style Buttons */}
                            <div className="flex gap-1.5">
                                <FaCircle className="text-rose-400" size={10} />
                                <FaCircle className="text-amber-400" size={10} />
                                <FaCircle className="text-emerald-400" size={10} />
                            </div>
                        </div>

                        <div className="relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search the network..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-11 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 px-4 no-scrollbar">
                        {searchQuery.length > 2 && (
                            <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                                <p className="px-4 py-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Active </p>
                                {searchResults.map(user => (
                                    <button key={user._id} onClick={() => { setActiveChat(user.email); setSearchQuery(''); }} 
                                        className="w-full p-4 flex items-center gap-4 hover:bg-indigo-50 rounded-3xl transition-all mb-2 border border-transparent hover:border-indigo-100">
                                        <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"><FaPlus size={14} /></div>
                                        <div className="text-left overflow-hidden">
                                            <p className="font-black text-slate-800 text-sm truncate">{user.name}</p>
                                            <p className="text-[10px] text-indigo-400 font-bold">New Connection</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Conversations</p>
                        <div className="space-y-1">
                            {conversations.map((person) => (
                                <button
                                    key={person}
                                    onClick={() => setActiveChat(person)}
                                    className={`w-full p-4 flex items-center gap-4 rounded-[1.8rem] transition-all relative ${activeChat === person ? 'bg-white shadow-xl shadow-indigo-100/50 scale-[1.02] border border-slate-100' : 'hover:bg-slate-50'}`}
                                >
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white shadow-inner ${activeChat === person ? 'bg-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {person.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left overflow-hidden flex-1">
                                        <p className="font-black text-slate-800 text-sm truncate">{person.split('@')[0]}</p>
                                        <p className={`text-[10px] font-bold ${activeChat === person ? 'text-indigo-500' : 'text-slate-400'}`}>Neighbor </p>
                                    </div>
                                    {activeChat === person && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* CHAT WINDOW */}
                <main className={`flex-1 flex flex-col bg-slate-50/30 ${!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            {/* CHAT HEADER */}
                            <header className="p-6 md:p-8 bg-white/60 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shadow-sm relative z-10">
                                <div className="flex items-center gap-5">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-400"><FaArrowLeft /></button>
                                    <div className="relative">
                                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                                            {activeChat.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg leading-none mb-1">{activeChat.split('@')[0]}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active </p>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-3 text-slate-300 hover:text-slate-600 transition-colors"><FaEllipsisV /></button>
                            </header>

                            {/* MESSAGE AREA */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-white/40">
                                {messages.map((m, index) => (
                                    <div key={index} className={`flex flex-col ${m.senderEmail === userEmail ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className={`max-w-[70%] p-5 rounded-[2rem] text-sm font-bold shadow-sm transition-all ${m.senderEmail === userEmail
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100'
                                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                                            }`}>
                                            {m.text}
                                            {m.itemId && (
                                                <button onClick={() => navigate(`/item/${m.itemId}`)} 
                                                    className={`mt-4 w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${m.senderEmail === userEmail ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                                    <FaBoxOpen className={m.senderEmail === userEmail ? 'text-white' : 'text-indigo-600'} />
                                                    <span className="truncate text-[11px] uppercase tracking-tighter">{m.itemTitle}</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-black text-slate-300 mt-2 uppercase px-2">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            {/* INPUT BAR */}
                            <footer className="p-8 bg-transparent relative z-10">
                                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={`Message ${activeChat.split('@')[0]}...`}
                                            className="w-full bg-white border border-slate-100 rounded-3xl py-5 px-8 font-bold text-slate-700 shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="bg-slate-900 text-white p-5 rounded-3xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center active:scale-95">
                                        <FaPaperPlane size={18} />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="text-center p-12 max-w-sm">
                            <div className="h-32 w-32 bg-indigo-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                <FaInbox size={48} className="text-indigo-200" />
                            </div>
                            <h3 className="font-black text-slate-900 text-2xl tracking-tighter mb-4">Select a Connection</h3>
                            <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-widest text-[10px]">
                                Your encrypted neighborhood network is ready. Pick a neighbor to begin the uplink.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Chat;