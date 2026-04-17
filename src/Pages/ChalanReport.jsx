import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const ChalanReport = () => {
    const navigate = useNavigate();
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/chalans/${searchDate}`);
            setReportData(response.data);
        } catch (error) {
            console.error("রিপোর্ট আনতে সমস্যা হয়েছে", error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
            {/* প্রিন্ট করার জন্য CSS */}
            <style>
                {`@media print { 
                    .no-print { display: none !important; } 
                    body { background: white; padding: 0; }
                    .printable-area { box-shadow: none !important; border: none !important; padding: 0 !important; width: 100% !important; } 
                    table { border-collapse: collapse !important; width: 100% !important; } 
                    th, td { border: 1px solid black !important; padding: 8px !important; font-size: 14px !important; color: black !important; } 
                    .print-header { display: block !important; text-align: center; margin-bottom: 20px; }
                }`}
            </style>

            <div className="max-w-5xl mx-auto">
                {/* হেডার সেকশন - যা প্রিন্টে আসবে না */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-slate-800">পুরানো চালান রিপোর্ট</h1>
                    </div>
                    <Link to="/" className="btn btn-ghost border-slate-200 bg-white shadow-sm rounded-xl">হোমে ফিরে যান</Link>
                </div>

                {/* সার্চ ফিল্টার - যা প্রিন্টে আসবে না */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 no-print">
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-center">
                        <div className="form-control w-full md:w-64">
                            <label className="label text-xs font-bold text-slate-500 uppercase">চালান তারিখ সিলেক্ট করুন</label>
                            <input 
                                type="date" 
                                className="input input-bordered bg-slate-50 focus:border-primary" 
                                value={searchDate} 
                                onChange={(e) => setSearchDate(e.target.value)} 
                            />
                        </div>
                        <button 
                            onClick={fetchReport} 
                            className={`btn btn-primary px-8 rounded-xl ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'লোড হচ্ছে...' : 'ডাটা খুঁজুন'}
                        </button>
                    </div>
                </div>

                {/* রিপোর্ট ডাটা - যা প্রিন্টে আসবে */}
                {reportData && (
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 printable-area">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-black uppercase">
                                {reportData.companyName || "মেসার্স ফাতেমা নাজ পেট্রোলিয়াম"}
                            </h2>
                            <p className="font-bold underline text-black text-lg">চালানের হিসাব</p>
                            
                            <div className="flex justify-between mt-6 px-2 text-black font-bold">
                                <p>তারিখ: {searchDate}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table w-full border-collapse border border-black text-black">
                                <thead>
                                    <tr className="text-black">
                                        <th className="border border-black bg-transparent text-center">Sl.</th>
                                        <th className="border border-black bg-transparent text-center">Lory No</th>
                                        <th className="border border-black bg-transparent text-center">Driver</th>
                                        <th className="border border-black bg-transparent text-center">Product</th>
                                        <th className="border border-black bg-transparent text-center">Dipo</th>
                                        <th className="border border-black bg-transparent text-center">Chalan No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.entries.map((item, index) => (
                                        <tr key={index} className="text-center border-black">
                                            <td className="border border-black">{item.sl}</td>
                                            <td className="border border-black font-bold">{item.carNo}</td>
                                            <td className="border border-black">{item.driver}</td>
                                            <td className="border border-black">{item.product}</td>
                                            <td className="border border-black">{item.depo}</td>
                                            <td className="border border-black">{item.chalanNo}</td>
                                        </tr>
                                    ))}
                                    {/* ফিলার রো (যদি ১৫টি থেকে কম ডাটা থাকে) */}
                                    {reportData.entries.length < 10 && [...Array(10 - reportData.entries.length)].map((_, i) => (
                                        <tr key={`empty-${i}`} className="h-10 border-black">
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* প্রিন্ট বাটন - যা প্রিন্টে আসবে না */}
                        <div className="mt-8 flex justify-end no-print pt-6 border-t">
                            <button 
                                onClick={() => window.print()} 
                                className="btn btn-secondary px-10 shadow-lg text-white font-bold"
                            >
                                🖨️ প্রিন্ট রিপোর্ট
                            </button>
                        </div>
                    </div>
                )}

                {!reportData && !loading && (
                     <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 no-print">
                        <p className="text-slate-400 font-medium">কোনো ডাটা পাওয়া যায়নি। তারিখ সিলেক্ট করে খুঁজুন।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChalanReport;