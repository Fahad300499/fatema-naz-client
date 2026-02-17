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
            let url = new URL("http://localhost:3000/trips");
            if (searchDate) url.searchParams.append("date", searchDate);
            const res = await fetch(url);
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Error fetching trips:", error);
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

    const totalDue = filteredRows.reduce((sum, row) => sum + (Number(row.payment2) || 0), 0);

    // --- নতুন PDF ডাউনলোড ফাংশন (টেবিল আইডি ব্যবহার করে) ---
    const downloadPDF = () => {
    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // টাইটেল
        doc.setFontSize(20);
        doc.text("Fatema Naz Petroleum", 40, 50);

        // অটো-টেবিল (প্লাগইনটি সরাসরি কল করা হচ্ছে)
        autoTable(doc, { 
            html: '#trip-table',
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59] },
            didParseCell: (data) => {
                // বাংলা চিহ্ন থাকলে সেটা ইংলিশ করে দেওয়া (ইস্যু এড়াতে)
                data.cell.text = String(data.cell.text).replace('৳', 'TK');
            }
        });

        doc.save(`Trip_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error("PDF Error:", error);
        alert("PDF তৈরি করতে সমস্যা হচ্ছে। আপনার প্যাকেজটি ঠিকমতো ইন্সটল আছে কি না নিশ্চিত করুন।");
    }
};

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .max-w-7xl { max-width: 100% !important; padding: 0 !important; }
                    table { border: 1px solid #eee !important; }
                }
            `}} />

            <div className="max-w-7xl mx-auto">
                {/* হেডার সেকশন */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-800">ট্রিপ রিপোর্ট</h1>
                        <p className="text-slate-500 font-medium italic">Fatema Naz Petroleum</p>
                    </div>
                    <div className="stats shadow-sm bg-white border border-gray-100">
                        <div className="stat px-6 py-2">
                            <div className="stat-title text-xs font-bold uppercase text-gray-400">মোট পাওনা</div>
                            <div className="stat-value text-2xl text-blue-600">{totalDue.toLocaleString()} ৳</div>
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
                            <label className="label text-xs font-bold text-slate-500 uppercase">গাড়ি নং</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered bg-slate-50" placeholder="সার্চ করুন..." />
                        </div>
                        <button onClick={fetchTrips} className="btn btn-primary rounded-xl">সার্চ ডাটা আপডেট</button>
                    </div>
                </div>

                {/* টেবিল সেকশন - এখানে আইডি যোগ করা হয়েছে */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table id="trip-table" className="table table-lg w-full">
                            <thead>
                                <tr className="bg-slate-800 text-white border-none">
                                    <th>তারিখ</th>
                                    <th>গাড়ি নম্বর</th>
                                    <th>ড্রাইভার</th>
                                    <th>ডিপো</th>
                                    <th>মোট টাকা</th>
                                    <th>২য় পাওনা</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.length > 0 ? filteredRows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-slate-50">
                                        <td className="font-bold text-slate-500 text-sm">{row.date}</td>
                                        <td className="font-black font-mono">{row.lorryNo}</td>
                                        <td className="font-semibold text-slate-700">{row.driverName}</td>
                                        <td>{row.dipoName}</td>
                                        <td className="font-bold">{row.totalAmount?.toLocaleString()} ৳</td>
                                        <td className="font-black text-blue-700">{row.payment2?.toLocaleString()} ৳</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="text-center py-10 opacity-50">কোন ডাটা পাওয়া যায়নি</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* বাটন সেকশন */}
                <div className="mt-6 flex justify-between items-center px-4 no-print">
                    <p className="text-sm text-slate-400 italic">* মোট {filteredRows.length} রেকর্ড</p>
                    <div className="flex gap-3">
                        <button onClick={downloadPDF} className="btn btn-outline btn-secondary rounded-xl">
                            PDF ডাউনলোড
                        </button>
                        <button onClick={handlePrint} className="btn btn-primary rounded-xl">
                            প্রিন্ট রিপোর্ট
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripHistory;