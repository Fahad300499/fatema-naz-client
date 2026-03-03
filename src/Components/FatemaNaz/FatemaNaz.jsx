import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Pages/Providers/AuthContext';

const FatemaNaz = () => {
    const navigate = useNavigate();
    
    // loading স্টেটটি অ্যাড করা হয়েছে যাতে ডাটা আসার আগে 'General Staff' না দেখায়
    const { user, dbUser, logOut, loading } = useContext(AuthContext);

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

    const handleNavigation = (path) => {
        if (user) {
            navigate(path);
        } else {
            Swal.fire({
                title: 'লগইন প্রয়োজন',
                text: 'এই সেকশনটি দেখতে প্রথমে লগইন করুন',
                icon: 'warning',
                showCancelButton: true, // ক্যান্সেল বাটন অ্যাড করা হয়েছে
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'লগইন পেজে যান',
                cancelButtonText: 'এখন না'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: { pathname: path } } });
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9]">
            {/* --- প্রিমিয়াম নেভিগেশন বার --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
                            <div className="bg-gradient-to-tr from-primary to-blue-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
                                FN <span className="text-primary font-light">Petroleum</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 pr-5">
                                    <img src={user?.photoURL} alt="user" className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary/10" />
                                    <div className="hidden md:block">
                                        <p className="text-xs font-bold text-slate-800 leading-none">{user?.displayName}</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                                            {/* লোডিং অবস্থায় থাকলে 'Please wait' দেখাবে */}
                                            {loading ? 'Verifying...' : (dbUser?.role === 'admin' ? 'Administrator' : 'General Staff')}
                                        </p>
                                    </div>
                                    <button onClick={handleLogOut} className="ml-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">লগআউট</button>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="btn btn-primary btn-md rounded-2xl px-8 shadow-lg shadow-primary/30 text-white font-bold">লগইন</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- আকর্ষণীয় হিরো সেকশন --- */}
            <div className="relative h-[500px] md:h-[650px] w-full flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] transform scale-110"
                    style={{ backgroundImage: `url('https://passengervoice.net/uploads/media_image/2025/10/oil-5e2d039c2636f.jpg')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f1f5f9] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-start md:items-center text-left md:text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase">Control System Online</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
                            <span className="text-white">ম্যানেজমেন্ট </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient-x italic">ড্যাশবোর্ড</span>
                        </h1>
                        <div className="h-1.5 w-24 md:w-40 bg-primary rounded-full md:mx-auto"></div>
                    </div>

                    <p className="mt-8 text-slate-300 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
                        ফাতেমা নাজ ও ইমাম হোসেন পেট্রোলিয়াম-এর <br /> 
                        সমন্বিত ডিজিটাল লজিস্টিকস ও অপারেশনাল কন্ট্রোল সেন্টার।
                    </p>
                </div>
            </div>

            {/* --- ড্যাশবোর্ড কার্ডস --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* কার্ড ১: ফাতেমা নাজ */}
                    <div
                        onClick={() => handleNavigation('/fatema-naz-details')}
                        className="group relative bg-white rounded-[3rem] p-1.5 shadow-2xl hover:shadow-primary/30 transition-all duration-500 cursor-pointer border border-white"
                    >
                        <div className="bg-slate-50 rounded-[2.8rem] p-10 flex flex-col items-center">
                            <div className="p-7 bg-white rounded-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-4 text-center">ফাতেমা নাজ পেট্রোলিয়াম</h2>
                            <p className="text-slate-500 text-center font-medium mb-8">ট্রিপ ডাটাবেজ, লরী ওয়ার্ক এবং বিস্তারিত কস্টিং এনালিটিক্স</p>
                            <span className="flex items-center gap-2 text-secondary font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                প্রবেশ করুন <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </span>
                        </div>
                    </div>

                    {/* কার্ড ২: ইমাম হোসেন */}
                    <div
                        onClick={() => handleNavigation('/imam-hossain-details')}
                        className="group relative bg-white rounded-[3rem] p-1.5 shadow-2xl hover:shadow-primary/30 transition-all duration-500 cursor-pointer border border-white"
                    >
                        <div className="bg-slate-50 rounded-[2.8rem] p-10 flex flex-col items-center">
                            <div className="p-7 bg-white rounded-3xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-xl shadow-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-4 text-center">ইমাম হোসেন পেট্রোলিয়াম</h2>
                            <p className="text-slate-500 text-center font-medium mb-8">রিয়েল-টাইম তেল সরবরাহ ট্র্যাকিং এবং চালান রিপোর্ট সিস্টেম</p>
                            <span className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                প্রবেশ করুন <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 bg-slate-900 text-slate-500">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase">© 2026 FN Petroleum Group | Integrated Logistics Control</p>
                </div>
            </footer>
        </div>
    );
};

export default FatemaNaz;