import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExtraFineReport = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    // ডাটা লোড করার ফাংশন
    const fetchExtraFines = async () => {
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
            alert("ডাটা লোড করা সম্ভব হয়নি।");
        }
    };

    // সব ট্রিপ থেকে শুধু এক্সট্রা জরিমানা (Extra Fine) যুক্ত রোগুলো ফিল্টার করা
    const extraFineRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    ).filter(row => {
        const hasExtraFine = Number(row.extraFine) > 0;
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        return hasExtraFine && matchesDriver;
    });

    // মোট এক্সট্রা জরিমানার পরিমাণ হিসাব
    const totalExtraFineAmount = extraFineRows.reduce((sum, row) => sum + (Number(row.extraFine) || 0), 0);

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.text("Fatema Naz Petroleum - Extra Fine Report", 40, 40);
        autoTable(doc, { 
            html: '#extra-fine-table',
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [194, 65, 12] }, // Orange-700 color for Extra Fine
        });
        doc.save(`Extra_Fine_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fffaf5] min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* হেডার ও সামারি কার্ড */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-orange-700">এক্সট্রা জরিমানা রিপোর্ট</h1>
                    </div>
                    {hasSearched && (
                        <div className="stats shadow bg-orange-600 text-white px-6">
                            <div className="stat p-2 text-center">
                                <div className="stat-title text-orange-100 text-xs uppercase font-bold">মোট এক্সট্রা জরিমানা</div>
                                <div className="stat-value text-2xl">{totalExtraFineAmount.toLocaleString()} ৳</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* সার্চ ফিল্টার */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শুরু তারিখ</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শেষ তারিখ</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার নাম</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" placeholder="নাম লিখুন..." />
                        </div>
                        <button onClick={fetchExtraFines} className="btn bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl border-none">সার্চ লোড</button>
                    </div>
                </div>

                {/* ডাটা টেবিল */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-orange-200">
                        <p className="text-slate-400">এক্সট্রা জরিমানার তথ্য দেখতে সার্চ করুন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-orange-50">
                        <div className="overflow-x-auto">
                            <table id="extra-fine-table" className="table w-full text-center">
                                <thead>
                                    <tr className="bg-orange-700 text-white border-none">
                                        <th className="py-4">তারিখ</th>
                                        <th>ডিপো</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th>এক্সট্রা জরিমানা (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extraFineRows.length > 0 ? extraFineRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-orange-50/50 transition-colors border-b border-orange-50">
                                            <td className="text-xs font-medium">{row.date}</td>
                                            <td className="text-slate-500 font-medium">{row.dipoName}</td>
                                            <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                            <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                            <td className="text-orange-700 font-black text-lg">{Number(row.extraFine).toLocaleString()} ৳</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="py-10 text-slate-400 font-medium italic">কোন ডাটা পাওয়া যায়নি</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* একশন বাটন */}
                {hasSearched && extraFineRows.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl px-6 font-bold">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn bg-orange-700 hover:bg-orange-800 text-white rounded-xl px-8 font-bold border-none">প্রিন্ট রিপোর্ট</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExtraFineReport;