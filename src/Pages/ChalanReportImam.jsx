import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router'; // react-router-dom স্ট্যান্ডার্ড অনুযায়ী পরিবর্তিত
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ChalanReportImam = () => {
    const navigate = useNavigate();
    
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDriver, setSearchDriver] = useState("");
    const [searchDepot, setSearchDepot] = useState(""); 
    
    const [allData, setAllData] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // ডাইনামিক হেডিং লজিক
    const getDynamicHeading = () => {
        if (searchDriver) return `Chalan Report - ${searchDriver}`;
        if (searchLorry) return `Chalan Report - ${searchLorry}`;
        if (searchDepot) return `Chalan Report - ${searchDepot}`;
        return "Chalan Report";
    };

    const fetchReport = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get(`https://api.ashrafulenterprise.com/chalans-report-imam`, { params });
            const allDaysData = response.data; 
            
            let flatEntries = [];
            allDaysData.forEach(dayObj => {
                if (dayObj.entries && Array.isArray(dayObj.entries)) {
                    dayObj.entries.forEach(entry => {
                        flatEntries.push({
                            ...entry,
                            displayDepot: entry.depo || entry.depotName || "N/A", 
                            date: dayObj.date || "N/A"
                        });
                    });
                }
            });

            setAllData(flatEntries);
        } catch (error) {
            console.error("রিপোর্ট আনতে সমস্যা হয়েছে", error);
            alert("সার্ভার থেকে রিপোর্ট ডাটা আনা সম্ভব হয়নি।");
        } finally {
            setLoading(false);
        }
    };

    // useEffect এবং অতিরিক্ত স্টেট বাদ দিয়ে useMemo ব্যবহার (পারফরম্যান্স বুস্ট এবং ইনস্ট্যান্ট আপডেট)
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const matchesLorry = !searchLorry || (item.carNo || item.lorryNo)?.toLowerCase().includes(searchLorry.toLowerCase());
            const matchesDriver = !searchDriver || item.driver?.toLowerCase().includes(searchDriver.toLowerCase());
            const matchesDepot = !searchDepot || item.displayDepot?.toLowerCase().includes(searchDepot.toLowerCase());
            
            return matchesLorry && matchesDriver && matchesDepot;
        });
    }, [searchLorry, searchDriver, searchDepot, allData]);

    // ডিলিট হ্যান্ডলার ফাংশন
    const handleDelete = async (item) => {
        const itemId = item._id || item.id; 
        
        if (!itemId) {
            alert("দুঃখিত, এই চালানের কোনো আইডি খুঁজে পাওয়া যায়নি!");
            return;
        }

        const isConfirmed = window.confirm(`আপনি কি নিশ্চিত যে চালান নম্বর ${item.chalanNo || ''} টি ডিলিট করতে চান?`);
        
        if (isConfirmed) {
            try {
                const response = await axios.delete(`https://api.ashrafulenterprise.com/delete-chalan-imam/${itemId}`);
                if (response.status === 200) {
                    alert("চালানটি সফলভাবে মুছে ফেলা হয়েছে।");
                    // অল-ডাটা স্টেট থেকে রিমুভ করলেই useMemo-র কারণে টেবিল ও সামারি একযোগে আপডেট হয়ে যাবে
                    setAllData(prevData => prevData.filter(data => (data._id || data.id) !== itemId));
                }
            } catch (error) {
                console.error("ডিলিট করতে সমস্যা হয়েছে:", error);
                alert(error.response?.data?.error || "চালানটি ডিলিট করা যায়নি। আবার চেষ্টা করুন।");
            }
        }
    };

    // অ্যাডভান্সড সামারি লজিক (ক্র্যাশ প্রোটেকশনসহ)
    const getAdvancedSummary = useMemo(() => {
        const summary = {
            "Parbatipur": { total: 0, products: {} },
            "Baghabari": { total: 0, products: {} },
            "Rangpur": { total: 0, products: {} }
        };

        filteredData.forEach(item => {
            const depotName = (item.displayDepot || "").toLowerCase();
            let matchedKey = null;

            if (depotName.includes("parbatipur")) matchedKey = "Parbatipur";
            else if (depotName.includes("baghabari")) matchedKey = "Baghabari";
            else if (depotName.includes("rangpur")) matchedKey = "Rangpur";

            if (matchedKey) {
                summary[matchedKey].total += 1;
                const prod = (item.product || "N/A").toUpperCase();
                summary[matchedKey].products[prod] = (summary[matchedKey].products[prod] || 0) + 1;
            }
        });
        return summary;
    }, [filteredData]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        const summaryData = getAdvancedSummary;
        const totalTrips = filteredData.length;
        const dynamicHeading = getDynamicHeading();

        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text("M/S Imam Hossain Petrolium", 105, 15, { align: "center" });
        
        doc.setFontSize(15);
        doc.setTextColor(100);
        doc.text(dynamicHeading, 105, 22, { align: "center" });

        const tableColumn = ["Sl.", "Date", "Lorry No", "Driver", "Depot", "Product", "Chalan No"];
        const tableRows = filteredData.map((item, index) => [
            index + 1, 
            item.date, 
            item.carNo || item.lorryNo, 
            item.driver || "N/A", 
            item.displayDepot, 
            item.product || "N/A", 
            item.chalanNo || "N/A"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], halign: 'center' },
            styles: { fontSize: 8, halign: 'center' },
            margin: { top: 30 }
        });

        let finalY = doc.lastAutoTable.finalY + 15;
        if (finalY > 240) { doc.addPage(); finalY = 20; }

        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text("TRIP SUMMARY REPORT", 14, finalY);

        const summaryRows = Object.entries(summaryData)
            .map(([depo, data]) => {
                const prodText = Object.entries(data.products)
                    .map(([p, c]) => `${p}: ${c}`)
                    .join(", ");
                return [depo, data.total, prodText || "No Data"];
            });

        summaryRows.push([
            { content: 'TOTAL TRIPS', styles: { fontStyle: 'bold', fillColor: [230, 230, 230] } },
            { content: totalTrips.toString(), styles: { fontStyle: 'bold', fillColor: [230, 230, 230], halign: 'center' } },
            { content: '', styles: { fillColor: [230, 230, 230] } }
        ]);

        autoTable(doc, {
            head: [["Depot Name", "Total Trips", "Product Breakdown"]],
            body: summaryRows,
            startY: finalY + 5,
            theme: 'grid',
            headStyles: { fillColor: [52, 152, 219] },
            styles: { fontSize: 9, cellPadding: 4 },
            columnStyles: { 1: { halign: 'center' } }
        });

        const timestamp = new Date().toLocaleDateString();
        doc.save(`${dynamicHeading.replace(/\s+/g, '_')}_${timestamp}.pdf`);
    };

    return (
        <div className="p-4 md:p-10 bg-[#f1f5f9] min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            {getDynamicHeading()}
                        </h1>
                    </div>
                    <Link to="/" className="btn btn-sm btn-ghost bg-white shadow-sm border-slate-200">হোম পেজ</Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-400 uppercase">শুরুর তারিখ</label>
                            <input type="date" className="input input-bordered w-full bg-slate-50" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-400 uppercase">শেষ তারিখ</label>
                            <input type="date" className="input input-bordered w-full bg-slate-50" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-400 uppercase">লরী নম্বর</label>
                            <input type="text" placeholder="লরী..." className="input input-bordered w-full bg-slate-50" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-400 uppercase">ড্রাইভার</label>
                            <input type="text" placeholder="নাম..." className="input input-bordered w-full bg-slate-50" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-400 uppercase">ডিপো</label>
                            <input type="text" placeholder="ডিপো..." className="input input-bordered w-full bg-slate-50" value={searchDepot} onChange={(e) => setSearchDepot(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={fetchReport} className={`btn btn-primary w-full mt-6 rounded-xl ${loading ? 'loading' : ''}`}>
                        {loading ? 'লোড হচ্ছে...' : 'রিপোর্ট জেনারেট করুন'}
                    </button>
                </div>

                {/* Content rendering */}
                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-5xl mb-4">📊</div>
                        <h2 className="text-xl font-bold text-slate-500">রিপোর্ট দেখতে ওপরের ফিল্টার ব্যবহার করে বাটন ক্লিক করুন</h2>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-20"><span className="loading loading-bars loading-lg text-primary"></span></div>
                ) : filteredData.length > 0 ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(getAdvancedSummary).map(([depo, data]) => (
                                <div key={depo} className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-lg font-bold text-slate-700 uppercase">{depo}</h2>
                                        <span className="badge badge-primary p-3 font-bold">{data.total} ট্রিপ</span>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(data.products).map(([prod, count]) => (
                                            <div key={prod} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                                                <span className="font-medium text-slate-600">{prod}</span>
                                                <span className="font-bold text-slate-800">{count} টি</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <div className="overflow-x-auto">
                                <table className="table w-full text-center">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th>Sl.</th><th>তারিখ</th><th>লরী নম্বর</th><th>ড্রাইভার</th><th>ডিপো</th><th>প্রোডাক্ট</th><th>চালান</th><th className="no-print">অ্যাকশন</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <tr key={item._id || item.id || index} className="hover:bg-blue-50 transition-colors">
                                                <td className="font-medium text-slate-400">{index + 1}</td>
                                                <td>{item.date}</td>
                                                <td className="font-bold text-slate-700">{item.carNo || item.lorryNo}</td>
                                                <td>{item.driver || "N/A"}</td>
                                                <td><span className="badge badge-ghost">{item.displayDepot}</span></td>
                                                <td className="font-semibold text-blue-600">{item.product || "N/A"}</td>
                                                <td>{item.chalanNo || "N/A"}</td>
                                                <td className="no-print">
                                                    <button 
                                                        onClick={() => handleDelete(item)} 
                                                        className="btn btn-xs btn-error text-white rounded-md px-3 py-1 font-semibold hover:scale-105 transition-transform"
                                                    >
                                                        🗑️ ডিলিট
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 no-print">
                            <div className="text-slate-500 font-bold italic">মোট ডাটা: {filteredData.length} টি</div>
                            <div className="flex gap-4">
                                <button onClick={downloadPDF} className="btn btn-success text-white px-10 rounded-xl hover:scale-105 transition-transform shadow-md">📥 PDF ডাউনলোড</button>
                                <button onClick={() => window.print()} className="btn btn-outline px-10 rounded-xl">🖨️ প্রিন্ট</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-red-200 text-red-400 font-bold">দুঃখিত, কোনো তথ্য খুঁজে পাওয়া যায়নি।</div>
                )}
            </div>
        </div>
    );
};

export default ChalanReportImam;