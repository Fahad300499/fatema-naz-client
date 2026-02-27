import React, { useState } from 'react';
import Swal from 'sweetalert2'; 

const LoryWork = () => {
    const loryList = [
        "41-0545", "41-0546", "41-0752", "41-0754",
        "41-0763", "41-0764", "41-0298", "41-0299",
        "41-0639", "44-0640", "44-0783"
    ];

    // কাজের বিবরণের লিস্ট
    const workOptions = [
        "ইঞ্জিন ফাংশন টোটাল",
        "চাকার ফাংশন",
        "কেবিনের কাজ",
        "ট্যাংকির কাজ",
        "ওয়ারিং এর কাজ",
        "পাম্প এর কাজ",
        "মবিল সার্ভিসিং",
        "এয়ার ফিল্টার"
    ];

    const [formData, setFormData] = useState({
        lorryNo: '',
        date: new Date().toISOString().split('T')[0],
        workDetails: '', // এটি এখন ড্রপডাউন থেকে আসবে
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
        // আপনি যদি লোকালহোস্টে টেস্ট করেন তবে নিচের URL টি ব্যবহার করুন
        const response = await fetch('https://fatema-naz-server-1.onrender.com/save-lory-work', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(finalData)
        });

        const data = await response.json();

        // MongoDB এর result এ সাধারণত acknowledged: true থাকে
        if (data.insertedId || data.acknowledged) {
            Swal.fire({
                icon: 'success',
                title: 'সফল!',
                text: 'লরীর কাজের বিবরণ সেভ হয়েছে',
                timer: 2000
            });
            
            // ফর্ম রিসেট
            setFormData({ 
                lorryNo: '', // এটিও রিসেট করা ভালো
                date: new Date().toISOString().split('T')[0],
                workDetails: '', 
                cost: '', 
                driverName: '' 
            });
        } else {
            throw new Error('ডাটা সেভ হয়নি');
        }
    } catch (error) {
        console.error("Error Saving Data:", error);
        Swal.fire({
            icon: 'error',
            title: 'ভুল!',
            text: 'সার্ভারে কানেক্ট হতে পারছে না। URL বা ইন্টারনেট চেক করুন।',
        });
    }
};

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 underline decoration-blue-200">লরীর কাজের বিবরণ এন্ট্রি</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* লরী সিলেকশন */}
                <div className="form-control">
                    <label className="label font-semibold">লরী নম্বর সিলেক্ট করুন</label>
                    <select 
                        required
                        className="select select-bordered w-full focus:outline-blue-500"
                        value={formData.lorryNo}
                        onChange={(e) => setFormData({...formData, lorryNo: e.target.value})}
                    >
                        <option value="">সিলেক্ট করুন</option>
                        {loryList.map(lory => <option key={lory} value={lory}>{lory}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* তারিখ */}
                    <div className="form-control">
                        <label className="label font-semibold">তারিখ</label>
                        <input 
                            type="date" 
                            className="input input-bordered" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    {/* ড্রাইভারের নাম */}
                    <div className="form-control">
                        <label className="label font-semibold">ড্রাইভারের নাম</label>
                        <input 
                            type="text" 
                            className="input input-bordered" 
                            placeholder="ড্রাইভারের নাম"
                            value={formData.driverName}
                            onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                        />
                    </div>
                </div>

                {/* কাজের বিবরণ (সিলেক্ট অপশন) */}
                <div className="form-control">
                    <label className="label font-semibold">কাজের বিবরণ সিলেক্ট করুন</label>
                    <select 
                        required
                        className="select select-bordered w-full focus:outline-blue-500"
                        value={formData.workDetails}
                        onChange={(e) => setFormData({...formData, workDetails: e.target.value})}
                    >
                        <option value="">কাজের ধরন বেছে নিন</option>
                        {workOptions.map((work, index) => (
                            <option key={index} value={work}>{work}</option>
                        ))}
                    </select>
                </div>

                {/* খরচ */}
                <div className="form-control">
                    <label className="label font-semibold">মোট খরচ (টাকা)</label>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        className="input input-bordered" 
                        value={formData.cost}
                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full text-white text-lg rounded-xl mt-4">
                    ডাটা সেভ করুন
                </button>
            </form>
        </div>
    );
};

export default LoryWork;