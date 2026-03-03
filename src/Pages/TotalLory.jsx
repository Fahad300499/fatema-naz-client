import React, { useState } from 'react';
import { useNavigate } from 'react-router';
// আইকন লাইব্রেরি থেকে ArrowLeft যোগ করা হয়েছে
import { Calendar, FileText, ChevronLeft, Clock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'; 

const TotalLory = () => {
    const navigate = useNavigate();
    const [selectedLory, setSelectedLory] = useState(null);
    const [recentTrips, setRecentTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    // ... (আপনার লরী লিস্ট এবং ফাংশনগুলো আগের মতোই থাকবে)
    const loryList = [
        "41-0545", "41-0546", "41-0752", "41-0754",
        "41-0763", "41-0764", "41-0298", "41-0299",
        "41-0639", "44-0640", "44-0783"
    ];

    const getExpiryStatus = (expiryDate) => {
        if (!expiryDate) return { label: "N/A", class: "bg-gray-50 text-gray-400 border-gray-100", icon: <AlertCircle size={14}/> };
        const today = new Date();
        const expire = new Date(expiryDate);
        const diffTime = expire - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: "Expired", class: "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100", icon: <AlertCircle size={14}/> };
        if (diffDays <= 30) return { label: "Urgent", class: "bg-orange-50 text-orange-600 border-orange-200 shadow-sm shadow-orange-100", icon: <Clock size={14}/> };
        return { label: "Active", class: "bg-green-50 text-green-600 border-green-200 shadow-sm shadow-green-100", icon: <CheckCircle2 size={14}/> };
    };

    const documentData = {
        "taxToken": "2026-05-20", "fitness": "2026-02-28", "routePermit": "2025-12-15",
        "registration": "2028-10-10", "calibration": "2026-03-05", "exclusive": "2026-01-20"
    };

    const handleViewDetails = async (number) => {
        setSelectedLory(number);
        setLoading(true);
        try {
            const res = await fetch(`https://fatema-naz-server-5.onrender.com/trips/${number}`);
            const data = await res.json();
            setRecentTrips(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const DocumentItem = ({ title, date }) => {
        const status = getExpiryStatus(date);
        return (
            <div className={`flex flex-col gap-1 p-4 border rounded-2xl transition-all hover:scale-[1.02] duration-300 ${status.class}`}>
                <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{title}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 rounded-full border border-current">
                        {status.icon} {status.label}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm font-bold">{date}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            
            {/* --- ব্যাক বাটন সেকশন --- */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)} // এক ধাপ পেছনে যাওয়ার জন্য
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 active:scale-95"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    ড্যাশবোর্ডে ফিরুন
                </button>
            </div>

            {/* --- Header Section --- */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-[2rem] shadow-2xl mb-10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">গাড়ীর তালিকা</h2>
                        <p className="text-blue-100 mt-2 font-medium opacity-90">ফাতেমা নাজ পেট্রোলিয়াম ম্যানেজমেন্ট সিস্টেম</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[150px]">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">মোট লরী</p>
                        <p className="text-white text-4xl font-black">{loryList.length}</p>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* --- বাকি অংশ আগের মতোই থাকবে --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loryList.map((number, index) => (
                    <div key={index} className="group relative bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-bl-[3rem] -z-0 transition-colors group-hover:bg-blue-50"></div>
                        
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tighter mb-1 group-hover:text-blue-700 transition-colors">{number}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-6"> Fatema Naz - {index + 101}</p>
                            
                            <button 
                                onClick={() => handleViewDetails(number)} 
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                            >
                                View History
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal এবং অন্যান্য কোড এখানে বসবে... */}
        </div>
    );
};

export default TotalLory;