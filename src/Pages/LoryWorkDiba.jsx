import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2'; 
import { ArrowLeft, Calendar, User, DollarSign, Settings, AlignLeft } from 'lucide-react';

const LoryWorkDiba = () => {
    const navigate = useNavigate();
    
    // ইমাম লরী লিস্ট (স্টেট হিসেবে রাখা হয়েছে যাতে নতুন লরী সাময়িকভাবে যুক্ত হতে পারে)
    const [loryList, setLoryList] = useState([
        "41-0577", "41-0015", "41-0629",
        "41-0630", "41-0334", "44-0564", 
        "44-0582",
    ]);

    const workOptions = [
        "ইঞ্জিন ফাংশন টোটাল", "চাকার ফাংশন", "কেবিনের কাজ",
        "ট্যাংকির কাজ", "ওয়ারিং এর কাজ", "পাম্প এর কাজ",
        "মবিল সার্ভিসিং", "এয়ার ফিল্টার"
    ];

    const [formData, setFormData] = useState({
        lorryNo: '',
        customLorryNo: '', // নতুন লরীর জন্য
        isCustomLorry: false, // কাস্টম ইনপুট ফিল্ড দেখানোর জন্য
        date: new Date().toISOString().split('T')[0],
        workDetails: '', 
        additionalInfo: '', 
        cost: '',
        driverName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // কাস্টম নাকি ড্রপডাউন থেকে নম্বর নেওয়া হবে তা নির্ধারণ
        const finalLorryNo = formData.isCustomLorry ? formData.customLorryNo : formData.lorryNo;

        if (!finalLorryNo) {
            Swal.fire('ভুল!', 'দয়া করে লরী নম্বর সিলেক্ট করুন বা লিখুন', 'warning');
            return;
        }

        const finalData = {
            lorryNo: finalLorryNo,
            date: formData.date,
            workDetails: formData.workDetails,
            additionalInfo: formData.additionalInfo,
            cost: parseFloat(formData.cost) || 0,
            driverName: formData.driverName
        };

        try {
            const response = await fetch('https://api.ashrafulenterprise.com/trips/save-lory-work-diba', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            const data = await response.json();
            if (data.insertedId || data.acknowledged) {
                Swal.fire({
                    icon: 'success',
                    title: 'সফল!',
                    text: 'ইমাম লরীর কাজের বিবরণ সেভ হয়েছে',
                    timer: 2000,
                    showConfirmButton: false,
                    borderRadius: '20px'
                });
                
                // নতুন লরী হলে লিস্টে সাময়িকভাবে যোগ করা
                if (formData.isCustomLorry && !loryList.includes(formData.customLorryNo)) {
                    setLoryList([...loryList, formData.customLorryNo]);
                }

                // ফর্ম রিসেট
                setFormData({ 
                    lorryNo: '', 
                    customLorryNo: '',
                    isCustomLorry: false,
                    date: new Date().toISOString().split('T')[0],
                    workDetails: '', 
                    additionalInfo: '', 
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
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-2 mb-8 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    ফিরে যান
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white overflow-hidden">
                    
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
                        <h2 className="text-3xl font-black tracking-tight mb-2">দিবা লরী মেইনটেন্যান্স</h2>
                        <p className="text-blue-100 opacity-80 font-medium text-sm uppercase tracking-widest">Imam Lory Work Database</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* লরী সিলেকশন / ম্যানুয়াল ইনপুট */}
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">
                                    {formData.isCustomLorry ? "নতুন লরী নম্বর লিখুন" : "লরী নম্বর"}
                                </label>
                                <div className="relative">
                                    {!formData.isCustomLorry ? (
                                        <select 
                                            required
                                            className="select select-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14"
                                            value={formData.lorryNo}
                                            onChange={(e) => {
                                                if (e.target.value === "ADD_NEW_IMAM") {
                                                    setFormData({...formData, isCustomLorry: true, lorryNo: ''});
                                                } else {
                                                    setFormData({...formData, lorryNo: e.target.value});
                                                }
                                            }}
                                        >
                                            <option value="">সিলেক্ট করুন</option>
                                            {loryList.map(lory => <option key={lory} value={lory}>{lory}</option>)}
                                            <option value="ADD_NEW_IMAM" className="text-indigo-600 font-bold">+ নতুন লরী এড করুন</option>
                                        </select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                required
                                                placeholder="যেমন: 41-XXXX"
                                                className="input input-bordered w-full pl-11 bg-indigo-50 border-indigo-200 focus:outline-indigo-500 rounded-2xl h-14 font-bold"
                                                value={formData.customLorryNo}
                                                onChange={(e) => setFormData({...formData, customLorryNo: e.target.value})}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, isCustomLorry: false, customLorryNo: ''})}
                                                className="btn btn-ghost text-red-500 text-xs"
                                            >বাতিল</button>
                                        </div>
                                    )}
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
                            <div className="form-control">
                                <label className="label text-slate-700 font-bold text-sm">ড্রাইভারের নাম</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl h-14" 
                                        placeholder="নাম লিখুন"
                                        value={formData.driverName}
                                        onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                                    />
                                    <User className="absolute left-4 top-4 text-slate-400" size={20} />
                                </div>
                            </div>

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

                        <div className="form-control">
                            <label className="label text-slate-700 font-bold text-sm">কাজের বিস্তারিত বিবরণ (ঐচ্ছিক)</label>
                            <div className="relative">
                                <textarea 
                                    className="textarea textarea-bordered w-full pl-11 bg-slate-50 border-slate-200 focus:outline-blue-500 rounded-2xl min-h-[120px] pt-4" 
                                    placeholder="বিস্তারিত এখানে লিখুন..."
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

export default LoryWorkDiba;