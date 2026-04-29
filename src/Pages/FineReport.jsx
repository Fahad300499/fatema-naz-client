import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FineReport = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    // ডাটা ফেচ করার ফাংশন
    const fetchFines = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Server response error");
            
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
            setTrips([]);
            alert("সার্ভার থেকে ডাটা লোড করা সম্ভব হয়নি।");
        }
    };

    // সব ট্রিপ থেকে শুধু জরিমানাযুক্ত রো গুলো আলাদা করা
    const fineRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    ).filter(row => {
        const hasFine = Number(row.fine) > 0;
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        return hasFine && matchesDriver;
    });

    // মোট জরিমানার হিসাব
    const totalFineAmount = fineRows.reduce((sum, row) => sum + (Number(row.fine) || 0), 0);

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.text("Fatema Naz Petroleum - Fine Report", 40, 40);
        autoTable(doc, { 
            html: '#fine-table',
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [185, 28, 28] }, // Red color for Fine
        });
        doc.save(`Fine_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fffcfc] min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* হেডার */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-red-700">জরিমানা রিপোর্ট</h1>
                    </div>
                    {hasSearched && (
                        <div className="stats shadow bg-red-600 text-white px-6">
                            <div className="stat p-2 text-center">
                                <div className="stat-title text-white/80 text-xs uppercase font-bold">মোট জরিমানা</div>
                                <div className="stat-value text-2xl">{totalFineAmount.toLocaleString()} ৳</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* সার্চ বক্স (জরিমানার জন্য নির্দিষ্ট) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শুরু তারিখ</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-red-100" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শেষ তারিখ</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-red-100" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার নাম</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-red-100" placeholder="ড্রাইভারের নাম..." />
                        </div>
                        <button onClick={fetchFines} className="btn btn-error text-white font-bold rounded-xl">সার্চ লোড</button>
                    </div>
                </div>

                {/* রিপোর্ট টেবিল */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-red-200">
                        <p className="text-slate-400">জরিমানার ডাটা দেখতে তারিখ ও নাম দিয়ে সার্চ দিন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-red-50">
                        <div className="overflow-x-auto">
                            <table id="fine-table" className="table w-full text-center">
                                <thead>
                                    <tr className="bg-red-700 text-white">
                                        <th className="py-4">তারিখ</th>
                                        <th>ডিপো</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th>জরিমানার পরিমাণ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fineRows.length > 0 ? fineRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-red-50/30 transition-colors border-b border-red-50">
                                            <td className="text-xs">{row.date}</td>
                                            <td className="font-medium text-slate-500">{row.dipoName}</td>
                                            <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                            <td className="font-medium text-slate-600">{row.driverName}</td>
                                            <td className="text-red-600 font-black text-lg">{Number(row.fine).toLocaleString()} ৳</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="py-10 text-slate-400">কোন জরিমানার তথ্য পাওয়া যায়নি</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* একশন বাটন */}
                {hasSearched && fineRows.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline btn-error rounded-xl">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn btn-error text-white rounded-xl">প্রিন্ট করুন</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FineReport;