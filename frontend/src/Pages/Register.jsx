import React, { useState } from 'react';
import axios from 'axios';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaCircle, FaShieldAlt, FaLock, FaChevronRight } from 'react-icons/fa';

const Register = () => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const res = await axios.post('https://dharnow.onrender.com/api/auth/google-login', {
                email: result.user.email,
                name: result.user.displayName,
                photoURL: result.user.photoURL
            });
            if (res.data.success) {
                localStorage.setItem('userEmail', result.user.email);
                window.location.href = "/";
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
            
            {/* SOFT GRADIENT BLOBS (Background) */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-100 to-blue-50 blur-[100px] rounded-full opacity-60" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-purple-50 to-indigo-100 blur-[100px] rounded-full opacity-60" />

            {/* THE WHITE MAC WINDOW */}
            <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl border border-white rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in zoom-in duration-500">
                
                {/* WINDOW TITLE BAR (Light Mode) */}
                <div className="h-12 bg-white/40 border-b border-gray-200/50 flex items-center px-5 justify-between">
                    <div className="flex gap-2">
                        <FaCircle className="text-[#FF5F57]" size={11} />
                        <FaCircle className="text-[#FEBC2E]" size={11} />
                        <FaCircle className="text-[#28C840]" size={11} />
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                        <FaLock size={9} className="text-gray-600" />
                        <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">DharNow </span>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* WINDOW CONTENT */}
                <div className="p-8 md:p-12 text-center">
                    
                    {/* App Icon with Gradient */}
                    <div className="mb-8 relative inline-block">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[22%] shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center mx-auto transform hover:scale-105 transition-transform duration-300">
                            <FaShieldAlt className="text-white text-3xl" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Join Now</h2>
                    <p className="text-gray-500 text-sm font-medium mb-10 px-4 leading-relaxed">
                        Connect your account to access <br/> the neighborhood network.
                    </p>

                    {/* Google Action Button (The "Gred" Style) */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full group flex items-center justify-between bg-white border border-gray-200 py-4 px-6 rounded-2xl font-bold text-gray-800 hover:border-indigo-400 hover:shadow-md transition-all duration-300 disabled:opacity-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-1 rounded-lg">
                                <FcGoogle size={22} />
                            </div>
                            <span className="text-sm">{loading ? "Synchronizing..." : "Continue with Google"}</span>
                        </div>
                        <FaChevronRight size={12} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </button>

                    {/* FOOTER METRICS */}
                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <div className="flex justify-center gap-3 mb-6">
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                v1.0 Platform
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                Active Community
                            </span>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[240px] mx-auto uppercase tracking-tighter">
                            By continuing, you agree to the community trust protocols and asset-sharing guidelines.
                        </p>
                    </div>
                </div>
            </div>

            {/* Simple Bottom Credit */}
            <div className="absolute bottom-8 text-gray-300 font-bold text-[10px] tracking-widest uppercase pointer-events-none">
                Design Standard © 2025 DharNow
            </div>
        </div>
    );
};

export default Register;