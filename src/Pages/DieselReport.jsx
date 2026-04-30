import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DieselReport = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [searchDriver, setSearchDriver] = useState("");
    const [searchLorry, setSearchLorry] = useState("");
    const [searchDipo, setSearchDipo] = useState(""); 
    const [hasSearched, setHasSearched] = useState(false);

    const mainDepots = ["parbatipur", "baghabari", "rangpur"];

    const fetchDieselData = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips?${params.toString()}`;
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

    // Filter diesel rows
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

    // Depot summary calculation
    const depotSummary = dieselRows.reduce((acc, row) => {
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
        
        // Header
        doc.setFontSize(18);
        doc.setTextColor(30, 58, 138); // Blue-900
        doc.text("Fatema Naz Petroleum - Diesel Report", 40, 45);
        
        // Main Table
        autoTable(doc, { 
            html: '#diesel-table',
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [30, 58, 138] }, // Dark Blue theme
            styles: { fontSize: 9 },
            margin: { left: 40, right: 40 },
        });

        let finalY = doc.lastAutoTable.finalY + 30;

        // Summary Table Body
        const summaryBody = mainDepots.map(depot => {
            const name = depot.charAt(0).toUpperCase() + depot.slice(1);
            return [name, `${depotSummary[name] || 0} Records`];
        });

        summaryBody.push([
            { content: 'Total Diesel Amount', styles: { fontStyle: 'bold', fillColor: [239, 246, 255] } }, 
            { content: `${totalDieselAmount.toLocaleString()} BDT`, styles: { fontStyle: 'bold', fillColor: [239, 246, 255] } }
        ]);

        autoTable(doc, {
            head: [['Depot Summary', 'Details']],
            body: summaryBody,
            startY: finalY,
            margin: { left: 40 },
            tableWidth: 300,
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216] } // Medium Blue
        });

        doc.save(`Diesel_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm border-blue-300 text-blue-600 hover:bg-blue-50 transition-all">❮</button>
                        <h1 className="text-3xl font-extrabold text-blue-900">Diesel Report</h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 mb-8 no-print">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-blue-100 focus:border-blue-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-blue-100 focus:border-blue-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Depot</label>
                            <input type="text" value={searchDipo} onChange={(e) => setSearchDipo(e.target.value)} className="input input-bordered border-blue-100 focus:border-blue-500" placeholder="Search depot..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Lorry No</label>
                            <input type="text" value={searchLorry} onChange={(e) => setSearchLorry(e.target.value)} className="input input-bordered border-blue-100 focus:border-blue-500" placeholder="Number..." />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Driver</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-blue-100 focus:border-blue-500" placeholder="Name..." />
                        </div>
                    </div>
                    <button onClick={fetchDieselData} className="btn bg-blue-700 hover:bg-blue-800 text-white w-full mt-6 font-bold rounded-xl border-none shadow-lg shadow-blue-100 transition-all">Fetch Data</button>
                </div>

                <div id="report-content">
                    {!hasSearched ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-blue-200">
                            <p className="text-slate-400 italic">Please select filters and click fetch to view diesel records.</p>
                        </div>
                    ) : (
                        <>
                            {/* Data Table */}
                            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-blue-50">
                                <div className="overflow-x-auto">
                                    <table id="diesel-table" className="table w-full text-center">
                                        <thead>
                                            <tr className="bg-blue-800 text-white border-none">
                                                <th className="py-4">Date</th>
                                                <th>Depo</th>
                                                <th>Lorry No</th>
                                                <th>Driver</th>
                                                <th>Diesel Amount (TK)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dieselRows.length > 0 ? dieselRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-blue-50/50 transition-colors border-b border-blue-50">
                                                    <td className="text-xs font-medium">{row.date}</td>
                                                    <td className="text-slate-500 font-medium">{row.dipoName}</td>
                                                    <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                                    <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                                    <td className="text-blue-700 font-black text-lg">{Number(row.dieselBabodPabe).toLocaleString()} </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="5" className="py-10 text-slate-400 italic">No records found for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Section */}
                            {dieselRows.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 p-8 bg-white rounded-[2rem] border border-blue-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Depot Summary</h3>
                                        <div className="space-y-2">
                                            {mainDepots.map(depot => {
                                                const label = depot.charAt(0).toUpperCase() + depot.slice(1);
                                                const count = depotSummary[label] || 0;
                                                return (
                                                    <div key={depot} className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg">
                                                        <span className="font-medium text-blue-700">{label}</span>
                                                        <span className="badge badge-secondary bg-blue-200 text-blue-800 border-none font-bold">{count} Records</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-end border-l border-blue-50 pl-6">
                                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Diesel Amount</span>
                                        <span className="text-4xl font-black text-blue-700">{totalDieselAmount.toLocaleString()} ৳</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                {hasSearched && dieselRows.length > 0 && (
                    <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-blue-600 text-blue-600 rounded-xl px-6 font-bold hover:bg-blue-50 transition-all">Download PDF</button>
                        <button onClick={() => window.print()} className="btn bg-blue-800 text-white rounded-xl px-8 font-bold border-none hover:bg-blue-900 shadow-lg shadow-blue-200 transition-all">Print Report</button>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #report-content { margin: 0; padding: 0; }
                    .table thead tr { 
                        background-color: #1e3a8a !important; 
                        color: white !important;
                        -webkit-print-color-adjust: exact; 
                    }
                }
            `}} />
        </div>
    );
};

export default DieselReport;