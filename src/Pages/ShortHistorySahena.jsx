import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ShortHistorySahena = () => {
    const navigate = useNavigate();
    const [sheets, setSheets] = useState([]);
    const [searchDepo, setSearchDepo] = useState("");
    const [searchProduct, setSearchProduct] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    // ডাইনামিক টাইটেল জেনারেট করার লজিক
    const getReportTitle = () => {
        if (searchDepo && searchProduct) return `${searchDepo} - ${searchProduct} Short Report`;
        if (searchDepo) return `${searchDepo} Short Report`;
        if (searchProduct) return `${searchProduct} Short Report`;
        return "Short Report";
    };

    const handleMonthChange = (e) => {
        const selectedMonth = e.target.value;
        if (!selectedMonth) {
            setStartDate("");
            setEndDate("");
            return;
        }
        const [year, month] = selectedMonth.split("-");
        const firstDay = `${year}-${month}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const lastDayFormatted = `${year}-${month}-${lastDay}`;
        setStartDate(firstDay);
        setEndDate(lastDayFormatted);
    };

    const fetchShortData = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            const url = `https://api.ashrafulenterprise.com/short-calculations-sahena?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Server response error");
            const data = await res.json();
            setSheets(data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
            setSheets([]);
            alert("সার্ভার থেকে ডাটা লোড করা সম্ভব হয়নি।");
        }
    };

    const allRows = (sheets || []).flatMap(sheet => 
        (sheet.rows || []).map(row => ({
            ...row,
            createdAt: sheet.createdAt
        }))
    );

    const filteredRows = allRows.filter(row => {
        const matchesDepo = !searchDepo || row.place?.toLowerCase().includes(searchDepo.toLowerCase());
        const matchesProduct = !searchProduct || row.product?.toLowerCase().includes(searchProduct.toLowerCase());
        return matchesDepo && matchesProduct;
    });

    // ক্যালকুলেশনস
    const totalTrips = filteredRows.length;
    const totalLorrySum = filteredRows.reduce((sum, row) => sum + (Number(row.lorryNo) || 0), 0);
    const totalShortQty = filteredRows.reduce((sum, row) => sum + (Number(row.shortQty) || 0), 0);
    const grandTotalTaka = filteredRows.reduce((sum, row) => sum + (Number(row.finalTotal) || 0), 0);
    const totalDifferenceSum = filteredRows.reduce((sum, row) => sum + (Number(row.difference) || 0), 0);

    const productSummary = filteredRows.reduce((acc, row) => {
        const prod = row.product || "Unknown";
        if (!acc[prod]) acc[prod] = { diff: 0, totalTaka: 0, count: 0, lorrySum: 0 };
        acc[prod].diff += (Number(row.difference) || 0);
        acc[prod].totalTaka += (Number(row.finalTotal) || 0);
        acc[prod].count += 1;
        acc[prod].lorrySum += (Number(row.lorryNo) || 0);
        return acc;
    }, {});

    const downloadPDF = () => {
        const doc = new jsPDF('l', 'pt', 'a4');
        doc.setFontSize(16);
        // PDF টাইটেলেও ডাইনামিক নাম ব্যবহার করা হয়েছে
        doc.text(getReportTitle(), 40, 40);
        doc.setFontSize(10);
        doc.text("Sahena Enterprise", 40, 55);

        autoTable(doc, { 
            html: '#short-table',
            startY: 75,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [30, 41, 59] },
        });

        let finalY = doc.lastAutoTable.finalY + 30;
        doc.setFontSize(12);
        doc.text("Financial & Trip Summary", 40, finalY);

        const summaryBody = [
            ["Total Trips ", `${totalTrips}`],
            ["Total Lorry Sum ", `${totalLorrySum}`],
            ["Grand Total Difference", `${totalDifferenceSum.toLocaleString()} Ltr`],
            ["Grand Total Short Qty", `${totalShortQty.toLocaleString()} Ltr`],
            ["Grand Total Amount", `${grandTotalTaka.toLocaleString()} TK`],
        ];

        Object.keys(productSummary).forEach(prod => {
            summaryBody.push([`${prod} Summary`, `Lorry: ${productSummary[prod].lorrySum} | Diff: ${productSummary[prod].diff} Ltr | Total: ${productSummary[prod].totalTaka.toLocaleString()} TK`]);
        });

        autoTable(doc, {
            startY: finalY + 10,
            margin: { left: 40 },
            tableWidth: 500,
            body: summaryBody,
            theme: 'striped',
            styles: { fontSize: 9 },
            columnStyles: { 0: { fontStyle: 'bold', width: 150 } }
        });

        doc.save(`${getReportTitle().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        {/* এখানে ডাইনামিক টাইটেল রেন্ডার হচ্ছে */}
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 uppercase">
                                {getReportTitle()}
                            </h1>
                            {hasSearched && (startDate || endDate) && (
                                <p className="text-sm text-slate-500 font-medium">
                                    Period: {startDate || "Start"} to {endDate || "End"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ফিল্টার সেকশন */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 no-print">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-blue-600 uppercase">Select Month</label>
                            <input type="month" onChange={handleMonthChange} className="input input-bordered input-sm" />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-500 uppercase">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered input-sm" />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-500 uppercase">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered input-sm" />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-500 uppercase">Depo</label>
                            <input type="text" value={searchDepo} onChange={(e) => setSearchDepo(e.target.value)} className="input input-bordered input-sm" placeholder="Search Depo..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-slate-500 uppercase">Product</label>
                            <input type="text" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="input input-bordered input-sm" placeholder="Search Product..." />
                        </div>
                        <button onClick={fetchShortData} className="btn btn-primary btn-sm rounded-xl text-white font-bold h-10">Search</button>
                    </div>
                </div>

                {!hasSearched ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-dashed border-2 border-gray-200">
                        <p className="text-slate-400 font-medium">রিপোর্ট দেখার জন্য সার্চ করুন।</p>
                    </div>
                ) : (
                    <>
                        {/* টেবিল সেকশন */}
                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                            <div className="overflow-x-auto">
                                <table id="short-table" className="table table-sm w-full text-center">
                                    <thead>
                                        <tr className="bg-slate-800 text-white">
                                            <th className="py-4">Deliver Date</th>
                                            <th className="bg-blue-900">Receive Date</th>
                                            <th>Depo</th>
                                            <th>Product</th>
                                            <th>Lorry</th>
                                            <th>Allow.</th>
                                            <th>Total</th>
                                            <th>Short</th>
                                            <th className="bg-orange-800/50">Difference</th>
                                            <th>Rate</th>
                                            <th className="bg-green-700">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRows.map((row, idx) => (
                                            <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="text-[10px]">{row.deliverDate}</td>
                                                <td className="text-[10px] font-bold text-blue-700">{row.receivingDate || "N/A"}</td>
                                                <td className="text-xs">{row.place}</td>
                                                <td className="font-bold text-slate-700">{row.product}</td>
                                                <td>{row.lorryNo}</td>
                                                <td>{row.allowance}</td>
                                                <td className="font-bold text-red-600">{row.totalAllowance}</td>
                                                <td>{row.shortQty}</td>
                                                <td className={`font-bold ${Number(row.difference) < 0 ? 'text-red-500' : 'text-blue-600'}`}>{row.difference}</td>
                                                <td>{row.rate}</td>
                                                <td className="font-black text-green-700">{Number(row.finalTotal || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* সামারি এবং ডাউনলোড বাটন */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl">
                                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-3 flex justify-between uppercase">
                                    <span>📊 {getReportTitle()} Summary</span>
                                    <span className="text-xs text-slate-400 font-normal">Trips: {totalTrips}</span>
                                </h3>
                                
                                <div className="space-y-6">
                                    {Object.keys(productSummary).map(prod => (
                                        <div key={prod} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                                            <p className="text-blue-400 font-bold uppercase text-sm mb-2">{prod} Analysis</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <p className="text-slate-400 text-[10px] uppercase">Total Lorry </p>
                                                    <p className="text-base font-bold">{productSummary[prod].lorrySum}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-[10px] uppercase">Difference</p>
                                                    <p className="text-base font-bold text-orange-300">{productSummary[prod].diff} Ltr</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-[10px] uppercase">Total Tk</p>
                                                    <p className="text-base font-bold text-green-400">{productSummary[prod].totalTaka.toLocaleString()} ৳</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
    
                                    <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-4 rounded-2xl border border-blue-500/30">
                                            <p className="text-slate-400 text-[10px] uppercase">Total Lorry</p>
                                            <p className="text-xl font-black text-blue-400">{totalLorrySum}</p>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-2xl border border-orange-500/30">
                                            <p className="text-slate-400 text-[10px] uppercase">Total Difference (Ltr)</p>
                                            <p className="text-xl font-black text-orange-400">{totalDifferenceSum.toLocaleString()} Ltr</p>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-2xl border border-red-500/30">
                                            <p className="text-slate-400 text-[10px] uppercase">Total Short (Qty)</p>
                                            <p className="text-xl font-black text-red-400">{totalShortQty.toLocaleString()} Ltr</p>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-2xl border border-green-500/30">
                                            <p className="text-slate-400 text-[10px] uppercase">Total TK</p>
                                            <p className="text-xl font-black text-green-500">{grandTotalTaka.toLocaleString()} ৳</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center gap-4 no-print">
                                <button onClick={downloadPDF} className="btn btn-secondary btn-lg rounded-2xl font-bold py-4 shadow-lg active:scale-95 transition-transform">
                                    📥 PDF Download
                                </button>
                                <button onClick={() => window.print()} className="btn btn-outline btn-lg rounded-2xl font-bold py-4 border-2 hover:bg-slate-100 transition-colors">
                                    🖨️ Print Report
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShortHistorySahena;