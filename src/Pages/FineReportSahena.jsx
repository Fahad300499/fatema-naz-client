import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FineReportSahena = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    // মূল ডিপো কি-ওয়ার্ডস
    const mainDepots = ["parbatipur", "baghabari", "rangpur"];

    // ডাটা ফেচ করার ফাংশন
    const fetchFines = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips-sahena?${params.toString()}`;
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

    // জরিমানাযুক্ত রো ফিল্টার
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

    // ডিপো সামারি লজিক (Partial Match)
    const depotSummary = fineRows.reduce((acc, row) => {
        const rawName = row.dipoName?.toLowerCase() || "";
        const matchedDepot = mainDepots.find(depot => rawName.includes(depot));
        
        if (matchedDepot) {
            const displayName = matchedDepot.charAt(0).toUpperCase() + matchedDepot.slice(1);
            acc[displayName] = (acc[displayName] || 0) + 1;
        }
        return acc;
    }, {});

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.setFontSize(18);
        doc.setTextColor(185, 28, 28);
        doc.text("Fatema Naz Petroleum - Fine Report (Sahena)", 40, 40);
        
        autoTable(doc, { 
            html: '#fine-table',
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [185, 28, 28] },
            margin: { left: 40, right: 40 },
        });

        let finalY = doc.lastAutoTable.finalY + 30;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Summary (Specific Depots)", 40, finalY);
        
        const summaryData = mainDepots.map(depot => {
            const name = depot.charAt(0).toUpperCase() + depot.slice(1);
            return [name, depotSummary[name] || 0];
        });
        
        autoTable(doc, {
            head: [['Depot Name', 'Total Fine Trips']],
            body: summaryData,
            startY: finalY + 10,
            margin: { left: 40 },
            tableWidth: 250,
            theme: 'striped',
            headStyles: { fillColor: [51, 65, 85] }
        });

        doc.save(`Fine_Report_Sahena_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fffcfc] min-h-screen font-sans text-slate-800">
            <div className="max-w-5xl mx-auto">
                
                {/* হেডার */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-3xl font-extrabold text-red-700">জরিমানা রিপোর্ট (সাহেনা)</h1>
                    </div>
                </div>

                {/* সার্চ বক্স */}
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
                        <button onClick={fetchFines} className="btn bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl border-none">সার্চ লোড</button>
                    </div>
                </div>

                {/* রিপোর্ট টেবিল ও সামারি */}
                <div className="print-section">
                    {!hasSearched ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-red-200 no-print">
                            <p className="text-slate-400">জরিমানার ডাটা দেখতে তারিখ ও নাম দিয়ে সার্চ দিন।</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-red-50">
                                <div className="overflow-x-auto">
                                    <table id="fine-table" className="table w-full text-center">
                                        <thead>
                                            <tr className="bg-red-700 text-white border-none">
                                                <th className="py-4">তারিখ</th>
                                                <th>ডিপো</th>
                                                <th>গাড়ি নং</th>
                                                <th>ড্রাইভার</th>
                                                <th>জরিমানা (৳)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fineRows.length > 0 ? fineRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-red-50/30 transition-colors border-b border-red-50">
                                                    <td className="text-xs">{row.date}</td>
                                                    <td className="font-medium text-slate-500">{row.dipoName}</td>
                                                    <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                                    <td className="font-medium text-slate-600">{row.driverName}</td>
                                                    <td className="text-red-600 font-black text-lg">{Number(row.fine).toLocaleString()}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="5" className="py-10">কোন জরিমানার তথ্য পাওয়া যায়নি</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* সামারি বক্স */}
                            {fineRows.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 p-8 bg-white rounded-[2rem] border border-red-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">ডিপো সামারি</h3>
                                        <div className="space-y-2">
                                            {mainDepots.map(depot => {
                                                const label = depot.charAt(0).toUpperCase() + depot.slice(1);
                                                const count = depotSummary[label] || 0;
                                                return (
                                                    <div key={depot} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                                        <span className="font-medium text-slate-600">{label}</span>
                                                        <span className="badge badge-ghost font-bold">{count} ট্রিপ</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-end border-l pl-6">
                                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">সর্বমোট জরিমানা</span>
                                        <span className="text-4xl font-black text-red-700">{totalFineAmount.toLocaleString()} ৳</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* একশন বাটন */}
                {hasSearched && fineRows.length > 0 && (
                    <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-red-600 text-red-600 rounded-xl px-6 font-bold">PDF ডাউনলোড</button>
                        <button onClick={() => window.print()} className="btn bg-red-600 text-white rounded-xl px-8 font-bold border-none">প্রিন্ট করুন</button>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}} />
        </div>
    );
};

export default FineReportSahena;