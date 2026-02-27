import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Pages/providers/AuthContext';
import { useEffect, useState } from 'react'; // useEffect, useState যোগ করুন

const FatemaNaz = () => {
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const [dbUser, setDbUser] = useState(null); // ডাটাবেজের ইউজার ডাটা রাখার জন্য


    useEffect(() => {
        if (user?.email) {
            // ডাটাবেজ থেকে ইউজারের রোল নিয়ে আসা
            fetch(`https://fatema-naz-server-1.onrender.com/user/role/${user.email}`)
                .then(res => res.json())
                .then(data => setDbUser(data));
        }
    }, [user]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    title: 'লগআউট সফল!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(error => console.error(error));
    };

    // কার্ডে ক্লিক করলে লগইন চেক করার ফাংশন
    const handleNavigation = (path) => {
        if (user) {
            navigate(path);
        } else {
            Swal.fire({
                title: 'লগইন প্রয়োজন',
                text: 'এই সেকশনটি দেখতে প্রথমে লগইন করুন',
                icon: 'warning',
                confirmButtonText: 'লগইন পেজে যান'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: { pathname: path } } });
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* --- প্রফেশনাল নেভিগেশন বার --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* লোগো অংশ */}
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-gray-800 tracking-tight hidden sm:block">
                                FN <span className="text-primary text-sm font-normal">Petroleum</span>
                            </span>
                        </div>

                        {/* ইউজার সেকশন */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100">
                                    <img src={user?.photoURL} alt="user" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                                    {/* ইউজার সেভ অংশ পরিবর্তন করুন */}
                                    <div className="hidden md:block text-left">
                                        <p className="text-xs font-bold text-gray-700 leading-none">
                                            {user?.displayName}
                                        </p>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-1">
                                            {/* এখানে পরিবর্তন করা হয়েছে */}
                                            {dbUser?.role === 'admin' ? 'অ্যাডমিন' : 'সাধারণ ইউজার'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogOut}
                                        className="ml-2 btn btn-xs btn-ghost text-red-500 hover:bg-red-50 rounded-full"
                                    >
                                        লগআউট
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn btn-primary btn-sm rounded-full px-6 shadow-lg shadow-primary/20"
                                >
                                    লগইন করুন
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- মেইন ড্যাশবোর্ড কন্টেন্ট --- */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black noto-serif text-gray-900 mb-4">
                        ম্যানেজমেন্ট <span className="text-primary italic">ড্যাশবোর্ড</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
                        ফাতেমা নাজ ও ইমাম হোসেন পেট্রোলিয়াম - রিয়েল-টাইম ট্রিপ এবং সরবরাহ ট্র্যাকিং সিস্টেম
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* কার্ড ১: ফাতেমা নাজ পেট্রোলিয়াম */}
                    <div
                        onClick={() => handleNavigation('/fatema-naz-details')}
                        className="group relative bg-white rounded-[2rem] p-1 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-50"
                    >
                        <div className="p-10 relative z-10 flex flex-col items-center">
                            <div className="p-5 bg-secondary/10 rounded-3xl mb-8 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 mb-4">ফাতেমা নাজ পেট্রোলিয়াম</h2>
                            <p className="text-gray-400 mb-8 max-w-xs text-center font-medium">ট্রিপ হিস্ট্রি, লরী ওয়ার্ক এবং কস্টিং সম্পর্কিত বিস্তারিত ডাটাবেজ</p>
                            <div className="flex items-center gap-2 text-secondary font-bold group-hover:translate-x-2 transition-transform">
                                বিস্তারিত দেখুন
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* কার্ড ২: ইমাম হোসেন পেট্রোলিয়াম */}
                    <div
                        onClick={() => handleNavigation('/imam-hossain-details')}
                        className="group relative bg-white rounded-[2rem] p-1 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-50"
                    >
                        <div className="p-10 relative z-10 flex flex-col items-center">
                            <div className="p-5 bg-primary/10 rounded-3xl mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 mb-4">ইমাম হোসেন পেট্রোলিয়াম</h2>
                            <p className="text-gray-400 mb-8 max-w-xs text-center font-medium">চালান রিপোর্ট এবং তেল সরবরাহ ট্র্যাকিং সিস্টেম</p>
                            <div className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform">
                                বিস্তারিত দেখুন
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ফুটার ডেকোরেশন */}
            <div className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
                © 2026 ফাতেমা নাজ পেট্রোলিয়াম ম্যানেজমেন্ট | ভার্সন ২.০.৪
            </div>
        </div>
    );
};

export default FatemaNaz;