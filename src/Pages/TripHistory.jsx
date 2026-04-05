import React, { useState, } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TripHistory = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDriver, setSearchDriver] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchMonth, setSearchMonth] = useState(""); // মাসের জন্য নতুন স্টেট
    const [hasSearched, setHasSearched] = useState(false); // সার্চ করা হয়েছে কি না ট্র্যাকিং

    const fetchTrips = async () => {
        try {
            setHasSearched(true); // ইউজার সার্চ বাটনে ক্লিক করেছেন
            let url = `https://api.ashrafulenterprise.com/trips`;
            
            // যদি নির্দিষ্ট তারিখ থাকে তবে সেটা পাঠানো হবে
            if (searchDate) {
                url += `?date=${encodeURIComponent(searchDate)}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setTrips([]);
        }
    };

    const allRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    );

    // ফিল্টার লজিক (গাড়ি, ড্রাইভার এবং মাস অনুযায়ী)
    const filteredRows = allRows.filter(row => {
        const matchesLorry = !searchLorry || row.lorryNo?.toLowerCase().includes(searchLorry.toLowerCase());
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        
        // মাস ফিল্টারিং (YYYY-MM-DD ফরম্যাট থেকে MM অংশটি নেওয়া হচ্ছে)
        let matchesMonth = true;
        if (searchMonth && row.date) {
            const rowMonth = row.date.split('-')[1]; // তারিখ থেকে মাস বের করা
            matchesMonth = rowMonth === searchMonth;
        }

        return matchesLorry && matchesDriver && matchesMonth;
    });

    const grandTotalDue = filteredRows.reduce((sum, row) => sum + (Number(row.driverTotalReceive) || 0), 0);

    const downloadPDF = () => {
        try {
            const doc = new jsPDF('l', 'pt', 'a4');
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
                {/* হেডার */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
                    <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-800">ট্রিপ রিপোর্ট (বিস্তারিত)</h1>
                    </div>
                    {hasSearched && (
                        <div className="stats shadow-sm bg-white border border-gray-100">
                            <div className="stat px-6 py-2">
                                <div className="stat-title text-xs font-bold uppercase text-gray-400">ফিল্টারকৃত মোট পাওনা</div>
                                <div className="stat-value text-2xl text-green-600">{grandTotalDue.toLocaleString()} ৳</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ফিল্টার সেকশন */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 no-print">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">মাস সিলেক্ট করুন</label>
                            <select 
                                className="select select-bordered bg-slate-50" 
                                value={searchMonth} 
                                onChange={(e) => setSearchMonth(e.target.value)}
                            >
                                <option value="">সব মাস</option>
                                <option value="01">জানুয়ারি</option>
                                <option value="02">ফেব্রুয়ারি</option>
                                <option value="03">মার্চ</option>
                                <option value="04">এপ্রিল</option>
                                <option value="05">মে</option>
                                <option value="06">জুন</option>
                                <option value="07">জুলাই</option>
                                <option value="08">আগস্ট</option>
                                <option value="09">সেপ্টেম্বর</option>
                                <option value="10">অক্টোবর</option>
                                <option value="11">নভেম্বর</option>
                                <option value="12">ডিসেম্বর</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">নির্দিষ্ট তারিখ</label>
                            <input type="date" onChange={(e) => setSearchDate(e.target.value)} className="input input-bordered bg-slate-50" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">গাড়ি নং</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered bg-slate-50" placeholder="নম্বর..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">ড্রাইভার</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered bg-slate-50" placeholder="নাম..." />
                        </div>
                        <button onClick={fetchTrips} className="btn btn-primary rounded-xl">সার্চ / লোড করুন</button>
                    </div>
                </div>

                {/* টেবিল বা মেসেজ সেকশন */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-300">
                        <p className="text-slate-400 text-lg">ডাটা দেখার জন্য উপরের ফিল্টার ব্যবহার করে "সার্চ" বাটনে ক্লিক করুন।</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table id="trip-table" className="table table-sm w-full text-center">
                                <thead>
                                    <tr className="bg-slate-800 text-white border-none">
                                        <th>তারিখ</th>
                                        <th>গাড়ি নং</th>
                                        <th>ড্রাইভার</th>
                                        <th>মোট ভাড়া</th>
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
                                            <td className="font-medium">{row.driverName || "N/A"}</td>
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
                )}

                {hasSearched && filteredRows.length > 0 && (
                    <div className="mt-6 flex justify-between items-center px-4 no-print">
                        <p className="text-sm text-slate-400 italic">* {filteredRows.length} টি রেকর্ড পাওয়া গেছে</p>
                        <div className="flex gap-3">
                            <button onClick={downloadPDF} className="btn btn-outline btn-secondary rounded-xl">PDF</button>
                            <button onClick={() => window.print()} className="btn btn-primary rounded-xl">প্রিন্ট</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripHistory;