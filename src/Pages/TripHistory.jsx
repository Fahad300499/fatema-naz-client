import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TripHistory = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const fetchTrips = async () => {
    try {
        // সহজ পদ্ধতি: টেম্পলেট লিটারেল ব্যবহার
        let url = `https://fatema-naz-server-2.onrender.com/trips`;
        
        if (searchDate) {
            url += `?date=${encodeURIComponent(searchDate)}`;
        }

        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        setTrips(data || []);
    } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]); // এরর হলে খালি অ্যারে সেট করা নিরাপদ
    }
};

    useEffect(() => { fetchTrips(); }, []);

    const allRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    );

    const filteredRows = allRows.filter(row => {
        if (!searchLorry) return true;
        return row.lorryNo?.toLowerCase().includes(searchLorry.toLowerCase());
    });

    // মোট গ্র্যান্ড টোটাল পাওনা (ড্রাইভারের ফাইনাল পাওনা অনুযায়ী)
    const grandTotalDue = filteredRows.reduce((sum, row) => sum + (Number(row.driverTotalReceive) || 0), 0);

    const downloadPDF = () => {
        try {
            const doc = new jsPDF('l', 'pt', 'a4'); // ল্যান্ডস্কেপ মোড কারণ কলাম অনেক বেশি
            doc.setFontSize(18);
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
        } catch (error) {
            console.error("PDF Error:", error);
            alert("PDF তৈরি করতে সমস্যা হচ্ছে।");
        }
    };

    const handlePrint = () => { window.print(); };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .max-w-7xl { max-width: 100% !important; padding: 0 !important; }
                    table { font-size: 10px !important; }
                }
            `}} />

            <div className="max-w-7xl mx-auto">
                {/* হেডার সেকশন */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-800">ট্রিপ রিপোর্ট (বিস্তারিত)</h1>
                        <p className="text-slate-500 font-medium italic">ডিজেল ও পেমেন্ট হিস্টোরী</p>
                    </div>
                    <div className="stats shadow-sm bg-white border border-gray-100">
                        <div className="stat px-6 py-2">
                            <div className="stat-title text-xs font-bold uppercase text-gray-400">সর্বমোট পাওনা</div>
                            <div className="stat-value text-2xl text-green-600">{grandTotalDue.toLocaleString()} ৳</div>
                        </div>
                    </div>
                </div>

                {/* ফিল্টার সেকশন */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">তারিখ</label>
                            <input type="date" onChange={(e) => setSearchDate(e.target.value)} className="input input-bordered bg-slate-50" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">গাড়ি নং</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered bg-slate-50" placeholder="গাড়ির নম্বর লিখুন..." />
                        </div>
                        <button onClick={fetchTrips} className="btn btn-primary rounded-xl">ডাটা লোড করুন</button>
                    </div>
                </div>

                {/* টেবিল সেকশন */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table id="trip-table" className="table table-sm w-full text-center">
                            <thead>
                                <tr className="bg-slate-800 text-white border-none">
                                    <th>তারিখ</th>
                                    <th>গাড়ি নং</th>
                                    <th>ড্রাইভার</th>
                                    <th>মোট ভাড়া</th>
                                    <th>২য় পাওনা</th>
                                    <th className="bg-blue-900">ডিজেল বাকি (L)</th>
                                    <th className="bg-blue-900">ডিজেল বাবদ (৳)</th>
                                    <th className="bg-orange-700">ড্রাইভার মোট পাবে</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.length > 0 ? filteredRows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="text-xs">{row.date}</td>
                                        <td className="font-bold">{row.lorryNo}</td>
                                        <td>{row.driverName}</td>
                                        <td>{row.totalAmount?.toLocaleString()}</td>
                                        <td className="font-semibold">{row.payment2?.toLocaleString()} ৳</td>
                                        <td className="text-blue-600 font-bold">{row.dieselBaki} L</td>
                                        <td className="text-blue-600 font-bold">{row.dieselBabodPabe?.toLocaleString()} ৳</td>
                                        <td className="font-black text-primary bg-orange-50">
                                            {row.driverTotalReceive?.toLocaleString()} ৳
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8" className="text-center py-10 opacity-50">কোন ডাটা পাওয়া যায়নি</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* বাটন সেকশন */}
                <div className="mt-6 flex justify-between items-center px-4 no-print">
                    <p className="text-sm text-slate-400 italic">* মোট {filteredRows.length} টি এন্ট্রি পাওয়া গেছে</p>
                    <div className="flex gap-3">
                        <button onClick={downloadPDF} className="btn btn-outline btn-secondary rounded-xl">PDF ডাউনলোড</button>
                        <button onClick={handlePrint} className="btn btn-primary rounded-xl">প্রিন্ট রিপোর্ট</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripHistory;