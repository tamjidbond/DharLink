import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// Added FaTrashAlt to the imports
import { FaPlus, FaHandHoldingHeart, FaBullhorn, FaClock, FaUser, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router'; 

const RequestBoard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || "Neighbor";

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/requests/all-open');
            setRequests(res.data);
        } catch (err) {
            console.error("Board error");
        }
        setLoading(false);
    };

    // --- NEW: DELETE FUNCTION ---
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Request?',
            text: "Did you find what you were looking for?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, remove it!'
        });

        if (result.isConfirmed) {
            try {
                // We send the userEmail to the backend to verify ownership
                await axios.delete(`http://localhost:8000/api/requests/delete/${id}`, {
                    data: { email: userEmail }
                });
                Swal.fire({ title: 'Removed!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                fetchRequests(); // Refresh the list
            } catch (err) {
                Swal.fire('Error', 'Could not delete request', 'error');
            }
        }
    };

    const handlePostRequest = async () => {
        if (!userEmail) {
            return Swal.fire('Wait!', 'Please login to post a request.', 'warning');
        }

        const { value: formValues } = await Swal.fire({
            title: '<h2 class="font-black text-indigo-600">What do you need?</h2>',
            html:
                '<input id="swal-item" class="swal2-input" style="border-radius:15px; font-family: sans-serif;" placeholder="Item name (e.g. Drill Machine)">' +
                '<textarea id="swal-desc" class="swal2-textarea" style="border-radius:15px; font-family: sans-serif;" placeholder="Details: Why do you need it and for how long?"></textarea>',
            showCancelButton: true,
            confirmButtonText: 'Post to Board',
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#94a3b8',
            preConfirm: () => {
                const title = document.getElementById('swal-item').value;
                const desc = document.getElementById('swal-desc').value;
                if (!title) return Swal.showValidationMessage('Item name is required');
                return { title, desc };
            }
        });

        if (formValues) {
            try {
                await axios.post('http://localhost:8000/api/requests/create', {
                    requesterEmail: userEmail,
                    requesterName: userName,
                    title: formValues.title,
                    description: formValues.desc
                });
                Swal.fire({ title: 'Posted!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                fetchRequests();
            } catch (err) {
                Swal.fire('Error', 'Could not post', 'error');
            }
        }
    };

    const handleIHaveThis = (itemTitle) => {
        Swal.fire({
            title: 'Help a Neighbor?',
            text: `You have a "${itemTitle}"? We'll take you to the listing page to add it!`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, I have it!',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#94a3b8',
            reverseButtons: true 
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/lend?hint=${encodeURIComponent(itemTitle)}`);
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-600 font-bold">Loading Wishlist...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 pb-24 text-sans">

            {/* Dynamic Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-14 text-white mb-10 relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <span className="bg-white/20 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md mb-4 inline-block">
                        DharLink Request Board
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Can't find it?<br />Ask for it!</h1>
                    <p className="text-indigo-100 max-w-sm font-medium text-sm md:text-base opacity-90">
                        Someone in your neighborhood might have exactly what you need sitting in their garage.
                    </p>
                    <button
                        onClick={handlePostRequest}
                        className="mt-8 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
                    >
                        <FaPlus /> Ask the Community
                    </button>
                </div>
                <FaSearch className="absolute -right-10 -bottom-10 text-[18rem] text-white/10 -rotate-12" />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBullhorn className="text-slate-400 text-xl" />
                        </div>
                        <p className="text-slate-400 font-bold italic px-6">The board is empty. What do you need today?</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-amber-50 text-amber-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-amber-100">
                                            Wanted
                                        </div>
                                        
                                        {/* DELETE BUTTON: Only visible to the owner */}
                                        {req.requesterEmail === userEmail && (
                                            <button 
                                                onClick={() => handleDelete(req._id)}
                                                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                                                title="Delete my request"
                                            >
                                                <FaTrashAlt size={12} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                        <FaClock className="text-[8px]" /> {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors capitalize">
                                    {req.title}
                                </h3>
                                <p className="text-slate-500 text-sm italic mb-6 leading-relaxed line-clamp-3">
                                    {req.description || "No specific details provided."}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="bg-indigo-50 text-indigo-500 p-2 rounded-full"><FaUser className="text-[10px]" /></div>
                                    <span className="text-xs font-bold truncate max-w-[80px]">{req.requesterName}</span>
                                </div>
                                
                                {/* If it's my own request, I don't need to "Help" myself */}
                                {req.requesterEmail !== userEmail ? (
                                    <button
                                        onClick={() => handleIHaveThis(req.title)}
                                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-md shadow-slate-200 active:scale-95"
                                    >
                                        <FaHandHoldingHeart /> Help
                                    </button>
                                ) : (
                                    <span className="text-[10px] font-bold text-indigo-400 italic">Your Request</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RequestBoard;