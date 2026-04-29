import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DieselReportImam = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [searchDriver, setSearchDriver] = useState("");
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDipo, setSearchDipo] = useState(""); 
    const [hasSearched, setHasSearched] = useState(false);

    const fetchDieselData = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips-imam?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Server error");
            
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Error:", error);
            setTrips([]);
            alert("ডিজেলের ডাটা লোড করা সম্ভব হয়নি।");
        }
    };

    // সব ট্রিপ থেকে ডিজেল ফিল্টার করা
    const dieselRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    ).filter(row => {
        const hasDiesel = Number(row.dieselBabodPabe) > 0;
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        const matchesLorry = !searchLorry || row.lorryNo?.toLowerCase().includes(searchLorry.toLowerCase());
        const matchesDipo = !searchDipo || row.dipoName?.toLowerCase().includes(searchDipo.toLowerCase());
        return hasDiesel && matchesDriver && matchesLorry && matchesDipo;
    });

    const totalDieselAmount = dieselRows.reduce((sum, row) => sum + (Number(row.dieselBabodPabe) || 0), 0);

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.text("Fatema Naz Petroleum - Diesel Report", 40, 40);
        autoTable(doc, { 
            html: '#diesel-table',
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }, // Blue color for Diesel
        });
        doc.save(`Diesel_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#f5f9ff] min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* হেডার */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-blue-800">ডিজেল রিপোর্ট</h1>
                    </div>
                    {hasSearched && (
                        <div className="stats shadow bg-blue-600 text-white px-6">
                            <div className="stat p-2 text-center">
                                <div className="stat-title text-blue-100 text-xs uppercase font-bold">মোট ডিজেল (৳)</div>
                                <div className="stat-value text-2xl">{totalDieselAmount.toLocaleString()} ৳</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ৫টি সার্চ অপশন বিশিষ্ট ফিল্টার বক্স */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 mb-8 no-print">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শুরু তারিখ</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-blue-100" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শেষ তারিখ</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-blue-100" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ডিপো</label>
                            <input type="text" value={searchDipo} onChange={(e) => setSearchDipo(e.target.value)} className="input input-bordered border-blue-100" placeholder="ডিপো..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">গাড়ি নং</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered border-blue-100" placeholder="নম্বর..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-blue-100" placeholder="নাম..." />
                        </div>
                    </div>
                    <button onClick={fetchDieselData} className="btn btn-primary w-full mt-4 text-white font-bold rounded-xl">সার্চ লোড</button>
                </div>

                {/* ডাটা টেবিল */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-blue-200">
                        <p className="text-slate-400 font-medium">ডিজেলের ডাটা দেখতে সার্চ অপশনগুলো ব্যবহার করুন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-blue-50">
                        <div className="overflow-x-auto">
                            <table id="diesel-table" className="table w-full text-center">
                                <thead>
                                    <tr className="bg-blue-700 text-white border-none">
                                        <th className="py-4">তারিখ</th>
                                        <th>ডিপো</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th>ডিজেল বাবদ (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dieselRows.length > 0 ? dieselRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors border-b border-blue-50">
                                            <td className="text-xs">{row.date}</td>
                                            <td className="font-medium text-slate-500">{row.dipoName}</td>
                                            <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                            <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                            <td className="text-blue-700 font-black text-lg">{Number(row.dieselBabodPabe).toLocaleString()} ৳</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="py-10 text-slate-400">কোন ডাটা পাওয়া যায়নি</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* একশন বাটন */}
                {hasSearched && dieselRows.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline btn-primary rounded-xl font-bold">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn btn-primary text-white rounded-xl px-8 font-bold">প্রিন্ট রিপোর্ট</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DieselReportImam;