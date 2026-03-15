import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2'; 
import { ArrowLeft, Calendar, User, DollarSign, Settings, AlignLeft } from 'lucide-react'; // AlignLeft আইকন যোগ করা হয়েছে

const LoryWork = () => {
    const navigate = useNavigate();
    const loryList = [
        "41-0545", "41-0546", "41-0752", "41-0754",
        "41-0763", "41-0764", "41-0298", "41-0299",
        "41-0639", "44-0640", "44-0783"
    ];

    const workOptions = [
        "ইঞ্জিন ফাংশন টোটাল", "চাকার ফাংশন", "কেবিনের কাজ",
        "ট্যাংকির কাজ", "ওয়ারিং এর কাজ", "পাম্প এর কাজ",
        "মবিল সার্ভিসিং", "এয়ার ফিল্টার"
    ];

    const [formData, setFormData] = useState({
        lorryNo: '',
        date: new Date().toISOString().split('T')[0],
        workDetails: '', 
        additionalInfo: '', // বিস্তারিত বিবরণের জন্য নতুন স্টেট
        cost: '',
        driverName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            cost: parseFloat(formData.cost) || 0 
        };

        try {
            const response = await fetch('https://api.ashrafulenterprise.com/save-lory-work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            const data = await response.json();
            if (data.insertedId || data.acknowledged) {
                Swal.fire({
                    icon: 'success',
                    title: 'সফল!',
                    text: 'লরীর কাজের বিবরণ সেভ হয়েছে',
                    timer: 2000,
                    showConfirmButton: false,
                    borderRadius: '20px'
                });
                
                setFormData({ 
                    lorryNo: '', 
                    date: new Date().toISOString().split('T')[0],
                    workDetails: '', 
                    additionalInfo: '', // রিসেট
                    cost: '', 
                    driverName: '' 
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ভুল!',
                text: 'সার্ভারে কানেক্ট হতে পারছে না।',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                
                {/* --- ব্যাক বাটন --- */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-2 mb-8 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    ফিরে যান
                </button>

                {/* --- মেইন কার্ড --- */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white overflow-hidden">
                    
                    {/* কার্ড হেডার */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
                        <h2 className="text-3xl font-black tracking-tight mb-2">লরী মেইনটেন্যান্স এন্ট্রি</h2>
                        <p className="text-blue-100 opacity-80 font-medium text-sm uppercase tracking-widest">Lory Work & Costing Database</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* লরী সিলেকশন */}
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">লরী নম্বর</label>
                                <div className="relative">
                                    <select 
                                        required
                                        className="select select-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14"
                                        value={formData.lorryNo}
                                        onChange={(e) => setFormData({...formData, lorryNo: e.target.value})}
                                    >
                                        <option value="">সিলেক্ট করুন</option>
                                        {loryList.map(lory => <option key={lory} value={lory}>{lory}</option>)}
                                    </select>
                                    <Settings className="absolute left-4 top-4 text-slate-400" size={20} />
                                </div>
                            </div>

                            {/* তারিখ */}
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">তারিখ</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        className="input input-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14" 
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                    <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ড্রাইভারের নাম */}
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">ড্রাইভারের নাম</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14" 
                                        placeholder="ড্রাইভারের নাম লিখুন"
                                        value={formData.driverName}
                                        onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                                    />
                                    <User className="absolute left-4 top-4 text-slate-400" size={20} />
                                </div>
                            </div>

                            {/* খরচ */}
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">মোট খরচ (টাকা)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        className="input input-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14 font-mono font-bold text-blue-700" 
                                        value={formData.cost}
                                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                    />
                                    <DollarSign className="absolute left-4 top-4 text-slate-400" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* কাজের বিবরণ (সিলেক্ট) */}
                        <div className="form-control">
                            <label className="label text-slate-700 font-bold text-sm">কাজের ধরন</label>
                            <div className="relative">
                                <select 
                                    required
                                    className="select select-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14"
                                    value={formData.workDetails}
                                    onChange={(e) => setFormData({...formData, workDetails: e.target.value})}
                                >
                                    <option value="">কাজের ধরন বেছে নিন</option>
                                    {workOptions.map((work, index) => (
                                        <option key={index} value={work}>{work}</option>
                                    ))}
                                </select>
                                <Settings className="absolute left-4 top-4 text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* বিস্তারিত বিবরণ (টেক্সট এরিয়া) */}
                        <div className="form-control">
                            <label className="label text-slate-700 font-bold text-sm">কাজের বিস্তারিত বিবরণ (ঐচ্ছিক)</label>
                            <div className="relative">
                                <textarea 
                                    className="textarea textarea-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl min-h-[120px] pt-4" 
                                    placeholder="কাজের বিস্তারিত এখানে লিখুন..."
                                    value={formData.additionalInfo}
                                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                                ></textarea>
                                <AlignLeft className="absolute left-4 top-4 text-slate-400" size={20} />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl hover:shadow-blue-200 transition-all duration-300 mt-4 active:scale-[0.98]">
                            ডাটা সেভ করুন
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoryWork;