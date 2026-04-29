import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import { ArrowLeft, RefreshCw, Search, Truck, Info, Calendar } from 'lucide-react'; 

const LoryWorkHistory = () => {
    const navigate = useNavigate();
    const [allHistory, setAllHistory] = useState([]); 
    const [filteredHistory, setFilteredHistory] = useState([]); 
    const [loading, setLoading] = useState(true);

    // --- আলাদা আলাদা সার্চ স্টেট ---
    const [searchLorry, setSearchLorry] = useState('');
    const [searchDriver, setSearchDriver] = useState('');
    const [searchWork, setSearchWork] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchAllHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.ashrafulenterprise.com/all-lory-works'); 
            const data = await response.json();
            setAllHistory(data);
            setFilteredHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (id) => {
        if (!id) {
            alert("এই রেকর্ডের কোনো আইডি পাওয়া যায়নি!");
            return;
        }
        const confirmDelete = window.confirm("আপনি কি এই রেকর্ডটি চিরতরে মুছে ফেলতে চান?");
        if (confirmDelete) {
            try {
                const response = await fetch(`https://api.ashrafulenterprise.com/delete-lory-work/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setAllHistory(prev => prev.filter(item => item._id !== id));
                    alert("রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।");
                } else {
                    alert(data.message || "বাদ দিতে সমস্যা হয়েছে।");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("সার্ভারের সাথে যোগাযোগ করা সম্ভব হচ্ছে না।");
            }
        }
    };

    useEffect(() => {
        fetchAllHistory();
    }, []);

    // --- মাল্টিপল সার্চ ফিল্টারিং লজিক ---
    useEffect(() => {
        const results = allHistory.filter(item => {
            const itemDate = new Date(item.date);
            const sDate = startDate ? new Date(startDate) : null;
            const eDate = endDate ? new Date(endDate) : null;

            const matchesLorry = item.lorryNo.toLowerCase().includes(searchLorry.toLowerCase());
            const matchesDriver = (item.driverName || '').toLowerCase().includes(searchDriver.toLowerCase());
            const matchesWork = (item.workDetails || '').toLowerCase().includes(searchWork.toLowerCase());
            
            // তারিখের রেঞ্জ চেক
            let matchesDate = true;
            if (sDate && eDate) {
                matchesDate = itemDate >= sDate && itemDate <= eDate;
            } else if (sDate) {
                matchesDate = itemDate >= sDate;
            } else if (eDate) {
                matchesDate = itemDate <= eDate;
            }

            return matchesLorry && matchesDriver && matchesWork && matchesDate;
        });
        setFilteredHistory(results);
    }, [searchLorry, searchDriver, searchWork, startDate, endDate, allHistory]);

    const totalCost = filteredHistory.reduce((sum, item) => sum + Number(item.cost || 0), 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Navigation --- */}
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
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-xl mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                                <Truck className="text-blue-400" size={36} />
                                লরীর মেইনটেন্যান্স রিপোর্ট
                            </h2>
                            <p className="text-slate-400 mt-2 font-medium uppercase tracking-widest text-xs">Fatema Naz Petroleum Fleet Records</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center min-w-[200px]">
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">ফিল্টার অনুযায়ী মোট খরচ</p>
                            <p className="text-3xl font-black text-white">{totalCost.toLocaleString()} ৳</p>
                        </div>
                    </div>
                </div>

                {/* --- Multi-Search Section --- */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        
                        {/* তারিখ থেকে */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">শুরু তারিখ</label>
                            <input 
                                type="date" 
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* তারিখ পর্যন্ত */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">শেষ তারিখ</label>
                            <input 
                                type="date" 
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        {/* লরী নম্বর */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">লরী নম্বর</label>
                            <input 
                                type="text" 
                                placeholder="যেমন: ঢাকা-মেট্রো..."
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500"
                                value={searchLorry}
                                onChange={(e) => setSearchLorry(e.target.value)}
                            />
                        </div>

                        {/* ড্রাইভার নাম */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">ড্রাইভার</label>
                            <input 
                                type="text" 
                                placeholder="ড্রাইভারের নাম..."
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500"
                                value={searchDriver}
                                onChange={(e) => setSearchDriver(e.target.value)}
                            />
                        </div>

                        {/* কাজের ধরন */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">কাজের ধরন</label>
                            <input 
                                type="text" 
                                placeholder="যেমন: ইঞ্জিন তেল..."
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500"
                                value={searchWork}
                                onChange={(e) => setSearchWork(e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* --- Table Section (আগের মতই) --- */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <span className="loading loading-infinity loading-lg text-blue-600"></span>
                                <p className="mt-4 text-slate-500 font-bold">ডাটা লোড হচ্ছে...</p>
                            </div>
                        ) : (
                            <table className="table w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 text-left">
                                        <th className="py-6 px-8 text-sm font-black uppercase tracking-wider">তারিখ</th>
                                        <th className="text-sm font-black uppercase tracking-wider">লরী ও ড্রাইভার</th>
                                        <th className="text-sm font-black uppercase tracking-wider">কাজের বিবরণ ও তথ্য</th>
                                        <th className="text-sm font-black uppercase tracking-wider text-right pr-8">খরচ (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.length > 0 ? (
                                        filteredHistory.map((item, index) => (
                                            <tr 
                                                key={item._id || index} 
                                                onClick={() => handleRowClick(item._id)} 
                                                className="cursor-pointer hover:bg-red-50 transition-colors border-b border-slate-50 group"
                                                title="বাদ দিতে ক্লিক করুন"
                                            >
                                                <td className="py-5 px-8 align-top">
                                                    <span className="text-slate-500 font-mono font-bold text-sm block mt-1">{item.date}</span>
                                                </td>
                                                <td className="align-top py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="w-max px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-xs border border-blue-100">
                                                            {item.lorryNo}
                                                        </span>
                                                        <span className="font-bold text-slate-700 text-sm ml-1">{item.driverName || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 max-w-md">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[11px] w-max font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-tighter border border-indigo-100">
                                                            {item.workDetails}
                                                        </span>
                                                        {item.additionalInfo && (
                                                            <div className="flex items-start gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                                                                <Info size={14} className="mt-0.5 text-blue-400 shrink-0" />
                                                                <p className="text-xs font-medium leading-relaxed italic">
                                                                    {item.additionalInfo}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-right pr-8 align-top py-5">
                                                    <span className="text-lg font-black text-slate-900 block mt-1">
                                                        {Number(item.cost).toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-red-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase">ক্লিক করলে বাদ হবে</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-32 opacity-30">
                                                <p className="text-xl font-bold italic">কোন তথ্য খুঁজে পাওয়া যায়নি!</p>
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