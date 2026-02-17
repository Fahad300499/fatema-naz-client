import React, { useState } from 'react';
import Swal from 'sweetalert2'; // মেসেজ দেখানোর জন্য (npm install sweetalert2)

const LoryWork = () => {
    const loryList = [
        "41-0545", "41-0546", "41-0752", "41-0754",
        "41-0763", "41-0764", "41-0298", "41-0299",
        "41-0639", "44-0640", "44-0783"
    ];

    const [formData, setFormData] = useState({
        lorryNo: '',
        date: new Date().toISOString().split('T')[0],
        workDetails: '',
        cost: '',
        driverName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('fatema-naz-server-1knw7t7py.vercel.app/save-lory-work', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.insertedId) {
                Swal.fire("সফল!", "লরীর কাজের বিবরণ সেভ হয়েছে", "success");
                setFormData({ ...formData, workDetails: '', cost: '', driverName: '' });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("ভুল!", "সেভ করা সম্ভব হয়নি", "error");
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
                            placeholder="ড্রাইভারের নাম"
                            className="input input-bordered" 
                            value={formData.driverName}
                            onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                        />
                    </div>
                </div>

                {/* কাজের বিবরণ */}
                <div className="form-control">
                    <label className="label font-semibold">কাজের বিবরণ (কি কি কাজ হয়েছে)</label>
                    <textarea 
                        required
                        placeholder="উদা: ইঞ্জিন অয়েল পরিবর্তন, টায়ার মেরামত ইত্যাদি"
                        className="textarea textarea-bordered h-24"
                        value={formData.workDetails}
                        onChange={(e) => setFormData({...formData, workDetails: e.target.value})}
                    ></textarea>
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