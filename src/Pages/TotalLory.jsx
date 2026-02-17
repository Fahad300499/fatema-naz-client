import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const TotalLory = () => {
    const navigate = useNavigate();
    const [selectedLory, setSelectedLory] = useState(null); // মডালে ডেটা দেখানোর জন্য স্টেট
    const [recentTrips, setRecentTrips] = useState([]); // নতুন স্টেট
    const [loading, setLoading] = useState(false);
    const [workHistory, setWorkHistory] = useState([]);

    const loryList = [
        "41-0545", "41-0546", "41-0752", "41-0754",
        "41-0763", "41-0764", "41-0298", "41-0299",
        "41-0639", "44-0640", "44-0783"
    ];

    // লরী সিলেক্ট করলে ট্রিপ ডাটা নিয়ে আসার ফাংশন
    const handleViewDetails = async (number) => {
        setSelectedLory(number);
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/trips/${number}`);
            const data = await res.json();
            setRecentTrips(data);


            // ২. কাজের (Work) হিস্টোরি আনা
            const workRes = await fetch(`http://localhost:3000/lory-work/${number}`);
            const workData = await workRes.json();
            setWorkHistory(workData);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-base-100 min-h-screen">

            {/* হেডার সেকশন */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 noto-serif">গাড়ীর তালিকা</h2>
                    <p className="text-gray-500 mt-1">ফাতেমা নাজ পেট্রোলিয়াম - মোট ১১টি লরী</p>
                </div>
                <div className="stats shadow bg-primary text-primary-content mt-4 md:mt-0">
                    <div className="stat px-8">
                        <div className="stat-title text-white/80">মোট লরী</div>
                        <div className="stat-value text-4xl">{loryList.length} টি</div>
                    </div>
                </div>
            </div>

            {/* ব্যাক বাটন */}
            <div className="flex justify-start mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 text-gray-700 font-semibold"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ফিরে যান
                </button>
            </div>

            {/* লরী কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loryList.map((number, index) => (
                    <div key={index} className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
                                </svg>
                            </div>
                            <span className="badge badge-ghost font-mono text-xs">ID: {index + 101}</span>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">লরী নম্বর</p>
                            <h3 className="text-2xl font-black text-red-600 font-mono mt-1">{number}</h3>
                        </div>

                        <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">মালিক</p>
                                <p className="font-bold text-gray-700">ফাতেমা নাজ</p>
                            </div>
                            {/* মডাল ট্রিগার বাটন */}
                            <button
                                onClick={() => handleViewDetails(number)} // এখানে পরিবর্তন
                                className="btn btn-xs btn-outline btn-primary rounded-lg"
                            >
                                View History
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DaisyUI Modal --- */}
            {selectedLory && (
                <div className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-lg bg-white">
                        <h3 className="font-bold text-2xl text-primary border-b pb-2">গাড়ীর বিস্তারিত তথ্য</h3>

                        <div className="py-4 space-y-4">
                            <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="font-semibold text-gray-500">লরী নম্বর:</span>
                                <span className="font-bold text-red-600 text-lg">{selectedLory}</span>
                            </div>

                            <div className="flex justify-between p-3 border-b">
                                <span className="font-semibold text-gray-500">মালিকের নাম:</span>
                                <span className="font-bold text-gray-800">ফাতেমা নাজ পেট্রোলিয়াম</span>
                            </div>

                            <div className="flex justify-between p-3 border-b">
                                <span className="font-semibold text-gray-500">চেসিস নম্বর:</span>
                                <span className="font-mono text-gray-800 uppercase">CH-{selectedLory.replace('-', '')}-XYZ789</span>
                            </div>

                            <div className="flex justify-between p-3 border-b">
                                <span className="font-semibold text-gray-500">ইঞ্জিন নম্বর:</span>
                                <span className="font-mono text-gray-800 uppercase">ENG-9922-{selectedLory.split('-')[1]}</span>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold text-gray-500 mb-2">সাম্প্রতিক ট্রিপ হিস্টোরী:</p>
                                <div className="text-sm bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-800">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : recentTrips.length > 0 ? (
                                        recentTrips.map((trip, idx) => (
                                            <div key={idx} className="mb-2 border-b border-blue-100 pb-1 last:border-0">
                                                • {trip.date}: {trip.dipoName} (ড্রাইভার: {trip.driverName})
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">এই গাড়ির কোন ট্রিপ রেকর্ড পাওয়া যায়নি।</p>
                                    )}
                                </div>
                            </div>
                            {/* --- কাজের বিবরণ (Work History) --- */}
                            <div className="mt-6">
                                <p className="font-semibold text-gray-500 mb-2">গাড়ীর কাজের বিবরণ (Maintenance):</p>
                                <div className="text-sm bg-green-50 p-3 rounded-xl border border-green-100 text-green-800">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : workHistory.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="table table-xs w-full">
                                                <thead>
                                                    <tr className="text-green-900">
                                                        <th>তারিখ</th>
                                                        <th>বিবরণ</th>
                                                        <th>খরচ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {workHistory.map((work, idx) => (
                                                        <tr key={idx} className="hover">
                                                            <td>{work.date}</td>
                                                            <td>{work.workDetails}</td>
                                                            <td className="font-bold">৳{work.cost}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">এই গাড়ির কোনো কাজের রেকর্ড পাওয়া যায়নি।</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => setSelectedLory(null)}
                                className="btn btn-error text-white rounded-full px-8"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    </div>
                    {/* মডালের বাইরে ক্লিক করলে বন্ধ হওয়ার জন্য ব্যাকড্রপ */}
                    <div className="modal-backdrop" onClick={() => setSelectedLory(null)}></div>
                </div>
            )}
        </div>
    );
};

export default TotalLory;