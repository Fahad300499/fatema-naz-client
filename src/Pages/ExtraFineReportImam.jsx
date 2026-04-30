import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExtraFineReportImam = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    const mainDepots = ["parbatipur", "baghabari", "rangpur"];

    // Fetch data function
    const fetchExtraFines = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips/trips-imam?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Server response error");
            
            const data = await res.json();
            setTrips(data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
            setTrips([]);
            alert("Failed to load fine records from server.");
        }
    };

    // Filter extra fine rows
    const extraFineRows = (trips || []).flatMap(trip => 
        (trip.rows || []).map(row => ({
            ...row,
            date: trip.date,
            dipoName: trip.dipoName
        }))
    ).filter(row => {
        const hasExtraFine = Number(row.extraFine) > 0;
        const matchesDriver = !searchDriver || row.driverName?.toLowerCase().includes(searchDriver.toLowerCase());
        return hasExtraFine && matchesDriver;
    });

    const totalExtraFineAmount = extraFineRows.reduce((sum, row) => sum + (Number(row.extraFine) || 0), 0);

    // Depot summary calculation
    const depotSummary = extraFineRows.reduce((acc, row) => {
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
        doc.setTextColor(194, 65, 12); // Orange-700
        doc.text("Imam Hossain Petrolium - Extra Fine Report", 40, 45);
        
        // Date Info
        doc.setFontSize(10);
        doc.setTextColor(100);
        

        // Main Table
        autoTable(doc, { 
            html: '#extra-fine-table',
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [194, 65, 12] }, // Orange theme
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
            { content: 'Total Extra Fine Amount', styles: { fontStyle: 'bold', fillColor: [255, 247, 237] } }, 
            { content: `${totalExtraFineAmount.toLocaleString()} BDT`, styles: { fontStyle: 'bold', fillColor: [255, 247, 237] } }
        ]);

        autoTable(doc, {
            head: [['Depot Summary', 'Details']],
            body: summaryBody,
            startY: finalY,
            margin: { left: 40 },
            tableWidth: 300,
            theme: 'grid',
            headStyles: { fillColor: [154, 52, 18] } // Darker Orange
        });

        doc.save(`Extra_Fine_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fffaf5] min-h-screen font-sans text-slate-800">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm border-orange-300 text-orange-600 hover:bg-orange-50 transition-all">❮</button>
                        <h1 className="text-3xl font-extrabold text-orange-700">Extra Fine Report</h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Driver Name</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-orange-100 focus:border-orange-500" placeholder="Search name..." />
                        </div>
                        <button onClick={fetchExtraFines} className="btn bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl border-none shadow-lg shadow-orange-100 transition-all">Fetch Data</button>
                    </div>
                </div>

                <div id="report-content">
                    {!hasSearched ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-orange-200">
                            <p className="text-slate-400 italic">Please select filters and click fetch to view fine records.</p>
                        </div>
                    ) : (
                        <>
                            {/* Data Table */}
                            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-orange-50">
                                <div className="overflow-x-auto">
                                    <table id="extra-fine-table" className="table w-full text-center">
                                        <thead>
                                            <tr className="bg-orange-700 text-white border-none">
                                                <th className="py-4">Date</th>
                                                <th>Depot</th>
                                                <th>Lorry No</th>
                                                <th>Driver</th>
                                                <th>Extra Fine (TK)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {extraFineRows.length > 0 ? extraFineRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-orange-50/50 transition-colors border-b border-orange-50">
                                                    <td className="text-xs font-medium">{row.date}</td>
                                                    <td className="text-slate-500 font-medium">{row.dipoName}</td>
                                                    <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                                    <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                                    <td className="text-orange-700 font-black text-lg">{Number(row.extraFine).toLocaleString()} </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="5" className="py-10 text-slate-400 italic">No records found for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Section */}
                            {extraFineRows.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 p-8 bg-white rounded-[2rem] border border-orange-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-orange-800 mb-4 border-b pb-2">Depot Summary</h3>
                                        <div className="space-y-2">
                                            {mainDepots.map(depot => {
                                                const label = depot.charAt(0).toUpperCase() + depot.slice(1);
                                                const count = depotSummary[label] || 0;
                                                return (
                                                    <div key={depot} className="flex justify-between items-center bg-orange-50/50 p-3 rounded-lg">
                                                        <span className="font-medium text-orange-700">{label}</span>
                                                        <span className="badge badge-secondary bg-orange-200 text-orange-800 border-none font-bold">{count} Records</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-end border-l border-orange-50 pl-6">
                                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Extra Fine</span>
                                        <span className="text-4xl font-black text-orange-700">{totalExtraFineAmount.toLocaleString()} ৳</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                {hasSearched && extraFineRows.length > 0 && (
                    <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-orange-600 text-orange-600 rounded-xl px-6 font-bold hover:bg-orange-50 transition-all">Download PDF</button>
                        <button onClick={() => window.print()} className="btn bg-orange-700 text-white rounded-xl px-8 font-bold border-none hover:bg-orange-800 shadow-lg shadow-orange-200 transition-all">Print Report</button>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #report-content { margin: 0; padding: 0; }
                    .table thead tr { 
                        background-color: #c2410c !important; 
                        color: white !important;
                        -webkit-print-color-adjust: exact; 
                    }
                }
            `}} />
        </div>
    );
};

export default ExtraFineReportImam;