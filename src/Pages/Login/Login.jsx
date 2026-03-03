import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router'; 
import Swal from 'sweetalert2';
import { AuthContext } from '../Providers/AuthContext';

const Login = () => {
    const { signInWithGoogle, setUser, setLoading, fetchUserRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            // ১. ফায়ারবেস পপ-আপের মাধ্যমে লগইন
            const result = await signInWithGoogle();
            const loggedUser = result.user;

            // পপ-আপ সফলভাবে বন্ধ না হলেও ইউজার ডাটা আমরা পেয়ে গেছি
            const userData = {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photo: loggedUser.photoURL,
                role: 'user' 
            };

            // ২. সার্ভারে ডাটা পাঠানো এবং রোল ফেচ করা (প্যারালাল প্রসেস)
            // এর ফলে একটির জন্য অন্যটি আটকে থাকবে না
            try {
                await fetch('https://fatema-naz-server-5.onrender.com/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                if (fetchUserRole) {
                    await fetchUserRole(loggedUser.email);
                }
            } catch (serverError) {
                console.error("Server sync error:", serverError);
                // সার্ভারে সমস্যা হলেও আমরা ইউজারকে লগইন করতে দেব যদি সেশন থাকে
            }

            // ৩. স্টেট সেট এবং নেভিগেশন
            setUser(loggedUser);
            
            Swal.fire({
                title: 'সফল লগইন!',
                text: `স্বাগতম, ${loggedUser.displayName}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            // সফল হলে সাথে সাথে সরিয়ে দেওয়া (পপ-আপ এরর কনসোলে থাকলেও ইউজার ড্যাশবোর্ডে চলে যাবে)
            navigate(from, { replace: true });

        } catch (error) {
            console.error("Login Error:", error.message);
            // পপ-আপ বন্ধ হওয়ার এররটি সাধারণত 'auth/popup-closed-by-user' হিসেবে আসে
            if (error.code !== 'auth/popup-closed-by-user') {
                Swal.fire('ভুল হয়েছে!', 'লগইন প্রসেসটি সম্পন্ন করা যায়নি।', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
            <div className="mb-6">
                <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium text-sm group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    লগইন ছাড়া ফিরে যান
                </Link>
            </div>

            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
                <div className="h-2 bg-gradient-to-r from-primary via-blue-400 to-secondary"></div>
                <div className="p-10 text-center">
                    <div className="relative inline-flex mb-8">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">লগইন করুন</h2>
                    <p className="text-gray-400 text-sm">ফাতেমা নাজ পেট্রোলিয়াম ম্যানেজমেন্ট সিস্টেম</p>
                    <div className="divider my-10 text-gray-300 text-[10px] uppercase tracking-[0.3em] font-bold">অ্যাক্সেস গেটওয়ে</div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary/30 hover:shadow-xl transition-all duration-300 group active:scale-95"
                    >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        <span className="text-gray-700 font-bold text-lg group-hover:text-primary transition-colors">
                            Continue with Google
                        </span>
                    </button>

                    <div className="mt-10 pt-6 border-t border-gray-50">
                        <p className="text-xs text-gray-400 mb-4">লগইন করতে সমস্যা হচ্ছে?</p>
                        <button onClick={() => navigate('/')} className="text-primary font-bold text-sm hover:underline">
                            সরাসরি ড্যাশবোর্ড (পাবলিক ভিউ)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;