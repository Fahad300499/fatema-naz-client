import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const LoryWorkHistory = () => {
    const [allHistory, setAllHistory] = useState([]); // সব ডাটা রাখার জন্য
    const [filteredHistory, setFilteredHistory] = useState([]); // ফিল্টার করা ডাটা
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ১. ব্যাকএন্ড থেকে সব ডাটা নিয়ে আসার ফাংশন
    const fetchAllHistory = async () => {
        setLoading(true);
        try {
            // আপনার ব্যাকএন্ডের সঠিক URL ব্যবহার করুন
            const response = await fetch('http://localhost:3000/all-lory-works'); 
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

    // ২. সার্চ ফিল্টার লজিক (লরী নম্বর বা ড্রাইভারের নাম দিয়ে)
    useEffect(() => {
        const results = allHistory.filter(item =>
            item.lorryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.driverName && item.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredHistory(results);
    }, [searchTerm, allHistory]);

    // ৩. মোট খরচ হিসাব
    const totalCost = filteredHistory.reduce((sum, item) => sum + Number(item.cost || 0), 0);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-200">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-extrabold text-blue-900 flex items-center gap-2">
                        🚛 লরীর মেইনটেন্যান্স রিপোর্ট
                    </h2>
                    <button 
                        onClick={fetchAllHistory} 
                        className="btn btn-outline btn-primary btn-sm rounded-full"
                    >
                        🔄 ডাটা রিফ্রেশ করুন
                    </button>
                </div>

                {/* সার্চ এবং স্ট্যাটাস কার্ড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label className="label font-bold text-gray-700">লরী নম্বর বা ড্রাইভার লিখে খুঁজুন</label>
                        <input 
                            type="text" 
                            placeholder="যেমন: 41-0545..." 
                            className="input input-bordered w-full shadow-inner focus:ring-2 focus:ring-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-blue-600 text-white p-4 rounded-2xl flex flex-col justify-center items-center shadow-lg">
                        <span className="text-sm opacity-80 uppercase tracking-widest font-bold">মোট খরচ</span>
                        <span className="text-2xl font-black">{totalCost.toLocaleString()} ৳</span>
                    </div>
                </div>

                {/* টেবিল সেকশন */}
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    {loading ? (
                        <div className="text-center py-20">
                            <span className="loading loading-bars loading-lg text-blue-600"></span>
                            <p className="mt-4 text-gray-500 animate-pulse">ডাটা লোড হচ্ছে, অপেক্ষা করুন...</p>
                        </div>
                    ) : (
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gray-100 text-blue-900 text-sm uppercase">
                                    <th className="py-4">তারিখ</th>
                                    <th>লরী নম্বর</th>
                                    <th>ড্রাইভার</th>
                                    <th>কাজের বিবরণ</th>
                                    <th className="text-right">খরচ (৳)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.length > 0 ? (
                                    filteredHistory.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors border-b">
                                            <td className="text-gray-600 font-medium">{item.date}</td>
                                            <td>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">
                                                    {item.lorryNo}
                                                </span>
                                            </td>
                                            <td className="text-gray-700">{item.driverName || 'N/A'}</td>
                                            <td>
                                                <span className="text-sm font-semibold text-gray-500 italic bg-gray-50 px-2 py-1 rounded">
                                                    {item.workDetails}
                                                </span>
                                            </td>
                                            <td className="text-right font-black text-blue-800">
                                                {Number(item.cost).toLocaleString()} ৳
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20 text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <span className="text-5xl mb-2">🔍</span>
                                                <p className="italic">দুঃখিত, এই নামে কোনো রেকর্ড পাওয়া যায়নি!</p>
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
    );
};

export default LoryWorkHistory;