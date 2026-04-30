import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SecurityReport = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [searchDriver, setSearchDriver] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");     
    const [hasSearched, setHasSearched] = useState(false);

    const mainDepots = ["parbatipur", "baghabari", "rangpur"];

    const fetchSecurity = async () => {
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
            alert("Failed to load security data from server.");
        }
    };

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

    const totalSecurityAmount = securityRows.reduce((sum, row) => sum + (Number(row.security) || 0), 0);

    const depotSummary = securityRows.reduce((acc, row) => {
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
        doc.setTextColor(126, 34, 206);
        doc.text("Fatema Naz Petroleum - Security Report", 40, 45);
        
        
        // Date Info
        doc.setFontSize(10);
        doc.setTextColor(100);

        // Main Table
        autoTable(doc, { 
            html: '#security-table',
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [126, 34, 206] },
            styles: { fontSize: 9 },
            margin: { left: 40, right: 40 },
        });

        let finalY = doc.lastAutoTable.finalY + 30;

        // Summary Section Header
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Report Summary", 40, finalY);
        
        // Summary Table (Depot wise + Total)
        const summaryBody = mainDepots.map(depot => {
            const name = depot.charAt(0).toUpperCase() + depot.slice(1);
            return [name, `${depotSummary[name] || 0} Trips`];
        });

        // Add Total Row to Summary
        summaryBody.push([{ content: 'Total Security Amount', styles: { fontStyle: 'bold', fillColor: [243, 232, 255] } }, 
                          { content: `${totalSecurityAmount.toLocaleString()} BDT`, styles: { fontStyle: 'bold', fillColor: [243, 232, 255] } }]);

        autoTable(doc, {
            head: [['Description', 'Value']],
            body: summaryBody,
            startY: finalY + 10,
            margin: { left: 40 },
            tableWidth: 300,
            theme: 'grid',
            headStyles: { fillColor: [88, 28, 135] }
        });

        doc.save(`Security_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fdfaff] min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm border-purple-300 text-purple-600">❮</button>
                        <h1 className="text-3xl font-extrabold text-purple-700">Security Report</h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 mb-8 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-400" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-400" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Driver Name</label>
                            <input type="text" value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} className="input input-bordered border-purple-100 focus:border-purple-400" placeholder="Search name..." />
                        </div>
                        <button onClick={fetchSecurity} className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none">Fetch Data</button>
                    </div>
                </div>

                {/* Content Area */}
                <div id="report-content">
                    {!hasSearched ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-purple-200">
                            <p className="text-slate-400 italic">Please select dates and click search to view security records.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-purple-50">
                                <div className="overflow-x-auto">
                                    <table id="security-table" className="table w-full text-center">
                                        <thead>
                                            <tr className="bg-purple-700 text-white border-none">
                                                <th className="py-4">Date</th>
                                                <th>Depot</th>
                                                <th>Lorry No</th>
                                                <th>Driver</th>
                                                <th>Security (TK)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {securityRows.length > 0 ? securityRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-purple-50/50 transition-colors border-b border-purple-50">
                                                    <td className="text-xs">{row.date}</td>
                                                    <td className="text-slate-500 font-medium">{row.dipoName}</td>
                                                    <td className="font-bold text-slate-700">{row.lorryNo}</td>
                                                    <td className="font-medium text-slate-600">{row.driverName || "N/A"}</td>
                                                    <td className="text-purple-700 font-black text-lg">{Number(row.security).toLocaleString()} </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="5" className="py-10 text-slate-400">No security records found for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Card - Visible in UI & Print */}
                            {securityRows.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 p-8 bg-white rounded-[2rem] border border-purple-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-purple-800 mb-4 border-b pb-2">Depot Summary</h3>
                                        <div className="space-y-2">
                                            {mainDepots.map(depot => {
                                                const label = depot.charAt(0).toUpperCase() + depot.slice(1);
                                                const count = depotSummary[label] || 0;
                                                return (
                                                    <div key={depot} className="flex justify-between items-center bg-purple-50/50 p-3 rounded-lg">
                                                        <span className="font-medium text-purple-700">{label}</span>
                                                        <span className="badge badge-secondary bg-purple-200 text-purple-800 border-none font-bold">{count} Trips</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-end border-l border-purple-50 pl-6">
                                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Security Amount</span>
                                        <span className="text-4xl font-black text-purple-700">{totalSecurityAmount.toLocaleString()} ৳</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                {hasSearched && securityRows.length > 0 && (
                    <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-purple-600 text-purple-600 rounded-xl px-6 font-bold hover:bg-purple-50">Download PDF</button>
                        <button onClick={() => window.print()} className="btn bg-purple-700 text-white rounded-xl px-8 font-bold border-none hover:bg-purple-800 shadow-lg shadow-purple-200">Print Report</button>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #report-content { margin: 0; padding: 0; }
                    .table thead tr { background-color: #7e22ce !important; -webkit-print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
};

export default SecurityReport;