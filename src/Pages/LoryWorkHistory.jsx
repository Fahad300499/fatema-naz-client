import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // নেভিগেশন এর জন্য
import Swal from 'sweetalert2';
import { ArrowLeft, RefreshCw, Search, Truck, Download } from 'lucide-react'; // আইকন যোগ করা হয়েছে

const LoryWorkHistory = () => {
    const navigate = useNavigate();
    const [allHistory, setAllHistory] = useState([]); 
    const [filteredHistory, setFilteredHistory] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://fatema-naz-server-3.onrender.com/all-lory-works'); 
            const data = await response.json();
            setAllHistory(data);
            setFilteredHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllHistory();
    }, []);

    useEffect(() => {
        const results = allHistory.filter(item =>
            item.lorryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.driverName && item.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredHistory(results);
    }, [searchTerm, allHistory]);

    const totalCost = filteredHistory.reduce((sum, item) => sum + Number(item.cost || 0), 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Top Navigation & Back Button --- */}
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        ড্যাশবোর্ডে ফিরুন
                    </button>
                    
                    <button 
                        onClick={fetchAllHistory} 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                        <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
                        রিফ্রেশ ডাটা
                    </button>
                </div>

                {/* --- Header Section --- */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-xl mb-10 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                                <Truck className="text-blue-400" size={36} />
                                লরীর মেইনটেন্যান্স রিপোর্ট
                            </h2>
                            <p className="text-slate-400 mt-2 font-medium uppercase tracking-widest text-xs">Fatema Naz Petroleum Fleet Records</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center min-w-[200px]">
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">মোট খরচ (ফিল্টার অনুযায়ী)</p>
                            <p className="text-3xl font-black text-white">{totalCost.toLocaleString()} ৳</p>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                </div>

                {/* --- Search & Controls --- */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 mb-8">
                    <div className="relative max-w-md">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">দ্রুত সার্চ করুন</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="লরী নম্বর বা ড্রাইভারের নাম..." 
                                className="input input-bordered w-full pl-12 h-14 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* --- Table Section --- */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <span className="loading loading-infinity loading-lg text-blue-600"></span>
                                <p className="mt-4 text-slate-500 font-bold animate-pulse">ডাটা প্রসেস হচ্ছে...</p>
                            </div>
                        ) : (
                            <table className="table w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                                        <th className="py-6 px-8 text-sm font-black uppercase tracking-wider">তারিখ</th>
                                        <th className="text-sm font-black uppercase tracking-wider">লরী নম্বর</th>
                                        <th className="text-sm font-black uppercase tracking-wider">ড্রাইভার</th>
                                        <th className="text-sm font-black uppercase tracking-wider">কাজের বিবরণ</th>
                                        <th className="text-sm font-black uppercase tracking-wider text-right pr-8">খরচ (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.length > 0 ? (
                                        filteredHistory.map((item, index) => (
                                            <tr key={index} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 group">
                                                <td className="py-5 px-8">
                                                    <span className="text-slate-500 font-mono font-bold text-sm">{item.date}</span>
                                                </td>
                                                <td>
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-black text-sm border border-blue-100">
                                                        {item.lorryNo}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="font-bold text-slate-700">{item.driverName || '—'}</div>
                                                </td>
                                                <td>
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
                                                        {item.workDetails}
                                                    </span>
                                                </td>
                                                <td className="text-right pr-8">
                                                    <span className="text-lg font-black text-slate-900">
                                                        {Number(item.cost).toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-32">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <Search size={64} className="mb-4" />
                                                    <p className="text-xl font-bold italic">কোন তথ্য খুঁজে পাওয়া যায়নি!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoryWorkHistory;