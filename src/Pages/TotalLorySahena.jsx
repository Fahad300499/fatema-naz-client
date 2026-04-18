import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, FileText, ChevronLeft, Clock, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Plus, Truck } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TotalLorySahena = () => {
    const navigate = useNavigate();
    const [selectedLory, setSelectedLory] = useState(null);
    const [recentTrips, setRecentTrips] = useState([]);
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // ১. গাড়ির লিস্টের জন্য স্টেট (শুরুতে খালি থাকবে)
    const [loryList, setLoryList] = useState([]);
    const [newLoryNumber, setNewLoryNumber] = useState('');

    // ২. ডাটাবেজ থেকে সব গাড়ির নাম্বার নিয়ে আসার ফাংশন
    const fetchLories = async () => {
        try {
            const res = await axios.get('https://api.ashrafulenterprise.com/all-lories-sahena');
            setLoryList(res.data.map(item => item.loryNumber)); // ধরে নিচ্ছি ব্যাকএন্ড থেকে অবজেক্ট আসবে
        } catch (error) {
            console.error("গাড়ির লিস্ট আনতে সমস্যা:", error);
            // যদি API না থাকে তবে আগের স্ট্যাটিক লিস্ট ব্যাকআপ হিসেবে রাখতে পারেন
            setLoryList(["41-0577", "41-0015", "41-0629", "41-0630", "41-0334", "44-0564", "44-0582"]);
        }
    };

    useEffect(() => {
        fetchLories();
    }, []);

    // ৩. নতুন গাড়ি অ্যাড করার ফাংশন
    const handleAddLory = async () => {
        if (!newLoryNumber.trim()) return;

        try {
            const res = await axios.post('https://api.ashrafulenterprise.com/add-lory-sahena', { 
                loryNumber: newLoryNumber 
            });
            
            if (res.data.success) {
                Swal.fire('সফল!', 'নতুন গাড়ি যুক্ত হয়েছে', 'success');
                setLoryList([...loryList, newLoryNumber]);
                setNewLoryNumber('');
            }
        } catch (error) {
            Swal.fire('এরর', 'গাড়িটি সেভ করা যায়নি', 'error');
        }
    };


    const handleDeleteLory = async (number) => {
    Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: `${number} গাড়িটি ডিলিট করলে এর সকল ডকুমেন্ট তথ্য মুছে যাবে!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
        cancelButtonText: 'বাতিল'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`https://api.ashrafulenterprise.com/delete-lory-sahena/${number}`);
                if (res.data.success) {
                    Swal.fire('ডিলিট হয়েছে!', 'গাড়িটি তালিকা থেকে মুছে ফেলা হয়েছে।', 'success');
                    // স্টেট আপডেট করে লিস্ট থেকে রিমুভ করা
                    setLoryList(loryList.filter(lory => lory !== number));
                }
            } catch (error) {
                Swal.fire('এরর', 'গাড়িটি ডিলিট করা সম্ভব হয়নি', 'error');
            }
        }
    });
};



    // আগের বাকি ফাংশনগুলো (handleViewDetails, getExpiryStatus) একই থাকবে...
    const getExpiryStatus = (expiryDate) => {
        if (!expiryDate) return { label: "N/A", class: "bg-gray-50 text-gray-400 border-gray-100", icon: <AlertCircle size={14} /> };
        const today = new Date();
        const expire = new Date(expiryDate);
        const diffTime = expire - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { label: "Expired", class: "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100", icon: <AlertCircle size={14} /> };
        if (diffDays <= 30) return { label: "Urgent", class: "bg-orange-50 text-orange-600 border-orange-200 shadow-sm shadow-orange-100", icon: <Clock size={14} /> };
        return { label: "Active", class: "bg-green-50 text-green-600 border-green-200 shadow-sm shadow-green-100", icon: <CheckCircle2 size={14} /> };
    };

    const handleViewDetails = async (number) => {
        setSelectedLory(number);
        setLoading(true);
        try {
            const tripRes = await axios.get(`https://api.ashrafulenterprise.com/trips-diba/${number}`);
            setRecentTrips(tripRes.data);
            const docRes = await axios.get(`https://api.ashrafulenterprise.com/lory-details-diba/${number}`);
            setDocumentData(docRes.data);
        } catch (error) {
            console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error);
            setDocumentData(null);
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
                    <span className="font-mono text-sm font-bold">{date || "No Date Set"}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            {/* ব্যাক বাটন */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                    <ArrowLeft size={18} /> ড্যাশবোর্ডে ফিরুন
                </button>

                {/* --- নতুন গাড়ি যুক্ত করার ইনপুট ফিল্ড --- */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="গাড়ির নাম্বার দিন..." 
                        className="bg-transparent px-4 py-2 outline-none text-sm font-bold text-slate-700 w-full"
                        value={newLoryNumber}
                        onChange={(e) => setNewLoryNumber(e.target.value)}
                    />
                    <button 
                        onClick={handleAddLory}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap text-xs font-bold"
                    >
                        <Plus size={16} /> নতুন গাড়ি অ্যাড
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-[2rem] shadow-2xl mb-10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <Truck className="text-blue-300" size={36} /> গাড়ীর তালিকা
                        </h2>
                        <p className="text-blue-100 mt-2 font-medium opacity-90">দিবা এন্টারপ্রাইজ ম্যানেজমেন্ট সিস্টেম</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[150px]">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">মোট লরী</p>
                        <p className="text-white text-4xl font-black">{loryList.length}</p>
                    </div>
                </div>
            </div>

            {/* লরী কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loryList.map((number, index) => (
                    <div key={index} className="group relative bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tighter mb-1 group-hover:text-blue-700 transition-colors">{number}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-6">MESSERS DIBA - {index + 101}</p>

                            <button
                                onClick={() => handleViewDetails(number)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all duration-200"
                            >
                                View History
                            </button>

                            <button
                                onClick={() => navigate(`/edit-lory/${number}`)}
                                className="w-full mt-2 py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-900 hover:text-white transition-all duration-200"
                            >
                                Edit Documents
                            </button>

                            <button
                    onClick={() => handleDeleteLory(number)}
                    className="w-full mt-4 py-2 text-red-500 border border-transparent hover:border-red-200 hover:bg-red-50 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1"
                >
                    Delete Lory
                </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Section (আগের মতোই থাকবে) */}
            {selectedLory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                        <div className="bg-slate-50 p-6 md:p-8 border-b flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-blue-600 text-white rounded-lg"><FileText size={20} /></div>
                                    <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tighter">{selectedLory}</h3>
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">গাড়ীর বিস্তারিত এবং ইতিহাস</p>
                            </div>
                            <button onClick={() => { setSelectedLory(null); setDocumentData(null); }} className="p-3 text-slate-400 hover:text-red-500 transition-all"><ChevronLeft size={24} className="rotate-180" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="mb-10">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div>ডকুমেন্ট স্ট্যাটাস</h4>
                                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div> : documentData ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DocumentItem title="Tax Token" date={documentData.taxToken} />
                                        <DocumentItem title="Fitness" date={documentData.fitness} />
                                        <DocumentItem title="Route Permit" date={documentData.routePermit} />
                                        <DocumentItem title="Calibration" date={documentData.calibration} />
                                        <DocumentItem title="Exclusive" date={documentData.exclusive} />
                                        <DocumentItem title="Registration" date={documentData.registration} />
                                    </div>
                                ) : <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold">কোন ডকুমেন্ট তথ্য পাওয়া যায়নি</div>}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div>সাম্প্রতিক ট্রিপসমূহ</h4>
                                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div> : recentTrips.length > 0 ? (
                                    <div className="border rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-800 text-white">
                                                    <th className="p-4 text-xs font-bold uppercase">তারিখ</th>
                                                    <th className="p-4 text-xs font-bold uppercase">গন্তব্য</th>
                                                    <th className="p-4 text-xs font-bold uppercase">তেল (L)</th>
                                                    <th className="p-4 text-xs font-bold uppercase">ভাড়া (৳)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 italic font-medium">
                                                {recentTrips.map((trip, idx) => (
                                                    <tr key={idx} className="hover:bg-blue-50/50">
                                                        <td className="p-4 text-slate-600 text-sm">{trip.date || "N/A"}</td>
                                                        <td className="p-4 text-slate-800 font-bold text-sm">{trip.destination || "N/A"}</td>
                                                        <td className="p-4 text-blue-600 font-mono text-sm">{trip.fuelQty || "0"}</td>
                                                        <td className="p-4 text-indigo-600 font-black text-sm">{trip.fare || "0"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <div className="text-center py-12 bg-slate-50 rounded-3xl"><AlertCircle className="mx-auto text-slate-300 mb-3" size={40} /><p className="text-slate-500 font-bold text-sm">কোন ট্রিপ ডাটা পাওয়া যায়নি!</p></div>}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t flex justify-end">
                            <button onClick={() => { setSelectedLory(null); setDocumentData(null); }} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">বন্ধ করুন</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TotalLorySahena;