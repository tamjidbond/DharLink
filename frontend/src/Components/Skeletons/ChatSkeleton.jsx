const ChatSkeleton = () => (
    <div className="max-w-6xl mx-auto h-[65vh] bg-white mt-6 rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-96 border-r border-slate-50 flex flex-col">
            <div className="p-6 space-y-4">
                <div className="h-8 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
            </div>
            <div className="flex-1 px-6 space-y-6 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-slate-100 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                            <div className="h-2 bg-slate-50 rounded-full w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Window Skeleton */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50">
            <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-32"></div>
                    <div className="h-2 bg-slate-50 rounded-full w-20"></div>
                </div>
            </div>
            <div className="flex-1 p-6 space-y-6">
                <div className="flex justify-start"><div className="h-16 bg-white rounded-[1.8rem] w-2/3"></div></div>
                <div className="flex justify-end"><div className="h-12 bg-indigo-50 rounded-[1.8rem] w-1/2"></div></div>
                <div className="flex justify-start"><div className="h-20 bg-white rounded-[1.8rem] w-3/4"></div></div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                <div className="flex-1 h-12 bg-slate-50 rounded-2xl"></div>
                <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
            </div>
        </div>
    </div>
);

export default ChatSkeleton;