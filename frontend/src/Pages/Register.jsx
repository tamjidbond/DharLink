import React, { useState } from 'react';
import axios from 'axios';
import { auth, googleProvider } from '../firebase'; // Ensure you have firebase.js setup
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';

const Register = () => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // 1. Pop up the Google Login window
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 2. Send user info to your backend
            const res = await axios.post('https://dharnow.onrender.com/api/auth/google-login', {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL
            });

            if (res.data.success) {
                localStorage.setItem('userEmail', user.email);
                Swal.fire({
                    icon: 'success',
                    title: `Welcome, ${user.displayName}!`,
                    showConfirmButton: false,
                    timer: 2000
                });
                window.location.href = "/"; // Go home
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Google Sign-In was cancelled or failed.' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 text-center">
            <h2 className="text-3xl font-black mb-2">DharLink</h2>
            <p className="text-slate-500 mb-8">Borrow and Lend with your Neighbors</p>
            
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
                <FcGoogle size={24} />
                {loading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="mt-6 text-xs text-slate-400">
                By signing in, you agree to our Community Guidelines.
            </p>
        </div>
    );
};

export default Register;