import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SecurityReportImam = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    // ডাটা লোড করার ফাংশন
    const fetchSecurity = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips-imam?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Server response error");
            
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
            setTrips([]);
            alert("সার্ভার থেকে জামানতের ডাটা লোড করা সম্ভব হয়নি।");
        }
    };

    // সব ট্রিপ থেকে শুধু জামানত (Security) যুক্ত রোগুলো ফিল্টার করা
    const securityRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    ).filter(row => {
        const hasSecurity = Number(row.security) > 0;
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        return hasSecurity && matchesDriver;
    });

    // মোট জামানতের পরিমাণ হিসাব
    const totalSecurityAmount = securityRows.reduce((sum, row) => sum + (Number(row.security) || 0), 0);

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.text("Fatema Naz Petroleum - Security Report", 40, 40);
        autoTable(doc, { 
            html: '#security-table',
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [126, 34, 206] }, // Purple color for Security
        });
        doc.save(`Security_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fdfaff] min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* হেডার ও সামারি কার্ড */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-purple-700">জামানত রিপোর্ট</h1>
                    </div>
                    {hasSearched && (
                        <div className="stats shadow bg-purple-600 text-white px-6">
                            <div className="stat p-2 text-center">
                                <div className="stat-title text-purple-100 text-xs uppercase font-bold">মোট জামানত পরিমাণ</div>
                                <div className="stat-value text-2xl">{totalSecurityAmount.toLocaleString()} ৳</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* সার্চ ফিল্টার */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শুরু তারিখ</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শেষ তারিখ</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার নাম</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-500" placeholder="নাম লিখুন..." />
                        </div>
                        <button onClick={fetchSecurity} className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none">সার্চ লোড</button>
                    </div>
                </div>

                {/* ডাটা টেবিল */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-purple-200">
                        <p className="text-slate-400">জামানতের তথ্য দেখতে উপরের অপশন ব্যবহার করে সার্চ দিন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-purple-50">
                        <div className="overflow-x-auto">
                            <table id="security-table" className="table w-full text-center">
                                <thead>
                                    <tr className="bg-purple-700 text-white border-none">
                                        <th className="py-4">তারিখ</th>
                                        <th>ডিপো</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th>জামানত (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {securityRows.length > 0 ? securityRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-purple-50/50 transition-colors border-b border-purple-50">
                                            <td className="text-xs font-medium">{row.date}</td>
                                            <td className="text-slate-500 font-medium">{row.dipoName}</td>
                                            <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                            <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                            <td className="text-purple-700 font-black text-lg">{Number(row.security).toLocaleString()} ৳</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="py-10 text-slate-400 font-medium italic">কোন জামানতের রেকর্ড পাওয়া যায়নি</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* একশন বাটন */}
                {hasSearched && securityRows.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl px-6 font-bold">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn bg-purple-700 hover:bg-purple-800 text-white rounded-xl px-8 font-bold border-none">প্রিন্ট রিপোর্ট</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityReportImam;