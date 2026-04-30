import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TripHistory = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [searchDipo, setSearchDipo] = useState(""); 
    const [hasSearched, setHasSearched] = useState(false);

    const fetchTrips = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips/trips?${params.toString()}`;
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

    const allRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    );

    const filteredRows = allRows.filter(row => {
        const matchesLorry = !searchLorry || row.lorryNo?.toLowerCase().includes(searchLorry.toLowerCase());
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        const matchesDipo = !searchDipo || row.dipoName?.toLowerCase().includes(searchDipo.toLowerCase());
        return matchesLorry && matchesDriver && matchesDipo;
    });

    // --- ক্যালকুলেশনস ---
    const totalTripsCount = filteredRows.length; 
    const totalPayment2 = filteredRows.reduce((sum, row) => sum + (Number(row.payment2) || 0), 0);
    const totalDiesel = filteredRows.reduce((sum, row) => sum + (Number(row.dieselBabodPabe) || 0), 0);
    const grandTotalDue = filteredRows.reduce((sum, row) => sum + (Number(row.driverTotalReceive) || 0), 0);
    const totalSecurity = filteredRows.reduce((sum, row) => sum + (Number(row.security) || 0), 0);
    const totalNormalFine = filteredRows.reduce((sum, row) => sum + (Number(row.fine) || 0), 0);
    const totalExtraFine = filteredRows.reduce((sum, row) => sum + (Number(row.extraFine) || 0), 0);

    const dipoCounts = filteredRows.reduce((acc, row) => {
        const rawName = row.dipoName || "";
        if (rawName.includes("Baghabari")) acc["Baghabari"] = (acc["Baghabari"] || 0) + 1;
        else if (rawName.includes("Parbatipur")) acc["Parbatipur"] = (acc["Parbatipur"] || 0) + 1;
        else if (rawName.includes("Rangpur")) acc["Rangpur"] = (acc["Rangpur"] || 0) + 1;
        return acc;
    }, {});

    const displayOrder = ["Baghabari", "Parbatipur", "Rangpur"];

    const downloadPDF = () => {
        const doc = new jsPDF('l', 'pt', 'a4');
        doc.text("Fatema Naz Petroleum - Trip Report", 40, 40);
        autoTable(doc, { 
            html: '#trip-table',
            startY: 60,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 41, 59] },
            didParseCell: (data) => {
                data.cell.text = String(data.cell.text).replace('৳', 'TK');
            }
        });
        doc.save(`Trip_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* হেডার ও স্ট্যাটস */}
                <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-slate-800">ট্রিপ রিপোর্ট</h1>
                    </div>

                    {hasSearched && filteredRows.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {/* ছোট কার্ডের স্টাইল আগের মতোই আছে */}
                            <div className="stats shadow-sm bg-blue-600 text-white px-4 py-2">
                                <div className="stat p-0 text-center">
                                    <div className="stat-title text-[10px] font-bold uppercase text-blue-100">মোট ট্রিপ</div>
                                    <div className="stat-value text-lg font-black">{totalTripsCount} টি</div>
                                </div>
                            </div>
                            <div className="stats shadow-sm bg-white border border-blue-100 px-4 py-2">
                                <div className="stat p-0 text-center">
                                    <div className="stat-title text-[10px] font-bold uppercase text-blue-400">মোট ডিজেল</div>
                                    <div className="stat-value text-lg text-blue-600">{totalDiesel.toLocaleString()} ৳</div>
                                </div>
                            </div>
                            <div className="stats shadow-sm bg-white border border-red-100 px-4 py-2">
                                <div className="stat p-0 text-center">
                                    <div className="stat-title text-[10px] font-bold uppercase text-red-400">জরিমানা</div>
                                    <div className="stat-value text-lg text-red-600">{totalNormalFine.toLocaleString()} ৳</div>
                                </div>
                            </div>
                            <div className="stats shadow-sm bg-white border border-green-500/20 ring-2 ring-green-500/10 px-4 py-2">
                                <div className="stat p-0 text-center">
                                    <div className="stat-title text-[10px] font-bold uppercase text-green-500">ড্রাইভার মোট</div>
                                    <div className="stat-value text-lg text-green-600">{grandTotalDue.toLocaleString()} ৳</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ১. মূল সার্চ ফিল্টার বক্স */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 no-print">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শুরু তারিখ</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered bg-slate-50" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">শেষ তারিখ</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered bg-slate-50" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ডিপো নাম</label>
                            <input type="text" value={searchDipo} onChange={(e) => setSearchDipo(e.target.value)} className="input input-bordered bg-slate-50" placeholder="ডিপো..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">গাড়ি নং</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered bg-slate-50" placeholder="নম্বর..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered bg-slate-50" placeholder="নাম..." />
                        </div>
                        <button onClick={fetchTrips} className="btn btn-primary rounded-xl text-white font-bold">সার্চ লোড</button>
                    </div>
                </div>

                {/* ২. নতুন নেভিগেশন বক্স (বাটন অপশনসমূহ) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 no-print">
                    <p className="text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">নির্দিষ্ট ক্যাটাগরি অনুযায়ী রিপোর্ট দেখুন</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: "জরিমানা", path: "/fine-report", color: "hover:bg-red-50 text-red-600 border-red-200" },
                            { name: "জামানত", path: "/security-report", color: "hover:bg-purple-50 text-purple-600 border-purple-200" },
                            { name: "এক্সট্রা জরিমানা", path: "/extra-fine-report", color: "hover:bg-orange-50 text-orange-600 border-orange-200" },
                            { name: "ডিজেল", path: "/diesel-report", color: "hover:bg-blue-50 text-blue-600 border-blue-200" },
                            { name: "Gross Salary", path: "/gross-sallery", color: "hover:bg-purple-50 text-purple-600 border-purple-200" },
                            { name: "Net Salary", path: "/net-sallery", color: "hover:bg-teal-50 text-teal-600 border-teal-200" },
                        ].map((item) => (
                            <button 
                                key={item.name} 
                                onClick={() => navigate(item.path)}
                                className={`btn bg-white border-2 ${item.color} rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-sm`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ডিপো সামারি ও টেবিল (বাকি অংশ একই আছে) */}
                {hasSearched && filteredRows.length > 0 && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm no-print">
                        <div className="text-[11px] font-black text-blue-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            ডিপো ভিত্তিক মোট ট্রিপ
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {displayOrder.map((cat) => (
                                <div key={cat} className="flex items-center bg-white border border-blue-50 rounded-2xl px-6 py-4 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
                                        <span className="text-2xl font-black text-slate-800">
                                            {dipoCounts[cat] || 0} <span className="text-xs font-medium text-slate-400">ট্রিপ</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* টেবিল সেকশন */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-300">
                        <p className="text-slate-400 text-lg font-medium">ডাটা দেখার জন্য "সার্চ লোড" বাটনে ক্লিক করুন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table id="trip-table" className="table table-sm w-full text-center">
                                <thead>
                                    <tr className="bg-slate-800 text-white border-none">
                                        <th className="py-4">তারিখ</th>
                                        <th>ডিপো</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th className="bg-red-900/50">জরিমানা</th>
                                        <th className="bg-orange-800/50">Extra Fine</th>
                                        <th className="bg-purple-900/50">জামানত</th>
                                        <th>২য় পাওনা</th>
                                        <th className="bg-blue-900 text-blue-50">ডিজেল (৳)</th>
                                        <th className="bg-orange-700 text-orange-50">ড্রাইভার মোট</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.length > 0 ? filteredRows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="text-[11px] font-medium">{row.date}</td>
                                            <td className="text-xs font-semibold text-slate-500">{row.dipoName}</td>
                                            <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                            <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                            <td className="text-red-500 font-bold">{Number(row.fine || 0).toLocaleString()}</td>
                                            <td className="text-orange-600 font-bold">{Number(row.extraFine || 0).toLocaleString()}</td>
                                            <td className="text-purple-600 font-bold">{Number(row.security || 0).toLocaleString()}</td>
                                            <td className="font-semibold text-slate-700">{row.payment2?.toLocaleString()} ৳</td>
                                            <td className="text-blue-600 font-bold bg-blue-50/30">{row.dieselBabodPabe?.toLocaleString()} ৳</td>
                                            <td className="font-black text-primary bg-orange-50/50">
                                                {row.driverTotalReceive?.toLocaleString()} ৳
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="10" className="text-center py-10 opacity-50 font-medium">কোন ডাটা পাওয়া যায়নি</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* একশন বাটন */}
                {hasSearched && filteredRows.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline btn-secondary rounded-xl px-8 font-bold">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn btn-primary rounded-xl px-8 text-white font-bold">প্রিন্ট রিপোর্ট</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripHistory;