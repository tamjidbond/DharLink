import React from 'react';
import { FaUserShield, FaCalendarAlt, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

const OwnerCard = ({ owner, item, handleRequest, requestLoading, formatWhatsAppNumber }) => {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-2xl sticky top-24">
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaUserShield /> Trusted Owner
            </h3>

            <div className="flex items-center gap-5 mb-10">
                {/* --- SMART AVATAR START --- */}
                {owner?.profileImage ? (
                    <img 
                        src={owner.profileImage} 
                        alt={owner.name}
                        className="h-20 w-20 rounded-[2rem] object-cover shadow-xl rotate-3 border-4 border-white"
                    />
                ) : (
                    <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl uppercase shadow-xl rotate-3">
                        {owner?.name?.charAt(0) || "U"}
                    </div>
                )}
                {/* --- SMART AVATAR END --- */}

                <div>
                    <h4 className="font-black text-slate-800 text-2xl">{owner?.name || "Neighbor"}</h4>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <FaCalendarAlt /> Joined {owner?.createdAt ? new Date(owner.createdAt).getFullYear() : "2025"}
                    </p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <button
                    onClick={handleRequest}
                    disabled={requestLoading || item.status === 'booked'}
                    className={`w-full py-5 rounded-3xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                        item.status === 'booked'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-100'
                    }`}
                >
                    {requestLoading ? "Sending Request..." : item.status === 'booked' ? "Already Booked" : "Send Borrow Request"}
                </button>

                {item.phone && (
                    <a
                        href={`https://wa.me/${formatWhatsAppNumber(item.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-3xl font-black text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                    >
                        <FaWhatsapp size={18} /> Chat on WhatsApp
                    </a>
                )}
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaShieldAlt className="text-indigo-400" /> Safety Tips
                </h5>
                <ul className="text-[11px] text-slate-500 font-bold space-y-2 leading-relaxed">
                    <li>• Meet in a bright, public place for pickup.</li>
                    <li>• Check the item condition before leaving.</li>
                    <li>• Be respectful to earn high Karma points!</li>
                </ul>
            </div>
        </div>
    );
};

export default OwnerCard;