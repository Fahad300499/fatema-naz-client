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

    // মূল ডিপো কি-ওয়ার্ডস
    const mainDepots = ["parbatipur", "baghabari", "rangpur"];

    const fetchSecurity = async () => {
        try {
            setHasSearched(true);
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const url = `https://api.ashrafulenterprise.com/trips?${params.toString()}`;
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

    // ডিপো সামারি লজিক
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
        
        // ১. মূল টাইটেল
        doc.setFontSize(20);
        doc.setTextColor(126, 34, 206); // Purple color
        doc.setFont("helvetica", "bold");
        doc.text("Fatema Naz Petroleum", 40, 40);

        // ২. সাব-টাইটেল (ড্রাইভার বা ডেট থাকলে দেখাবে)
        let infoLine = "";
        if (searchDriver) {
            infoLine += `Driver: ${searchDriver}`;
        }
        if (startDate && endDate) {
            if (infoLine) infoLine += " | ";
            infoLine += `Period: ${startDate} to ${endDate}`;
        }

        if (infoLine) {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text(infoLine, 40, 58);
        }

        // ৩. রিপোর্টের ধরণ
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Security Summary Report", 40, 75);

        // ৪. মূল ডাটা টেবিল
        autoTable(doc, { 
            html: '#security-table',
            startY: infoLine ? 90 : 85,
            theme: 'grid',
            headStyles: { fillColor: [126, 34, 206] }, // Purple
            styles: { fontSize: 9 },
            margin: { left: 40, right: 40 },
        });

        // ৫. ডিপো ভিত্তিক সামারি
        let finalY = doc.lastAutoTable.finalY + 30;
        
        if (finalY > 700) {
            doc.addPage();
            finalY = 40;
        }

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Summary by Depot", 40, finalY);
        
        const summaryData = mainDepots.map(depot => {
            const name = depot.charAt(0).toUpperCase() + depot.slice(1);
            return [name, `${depotSummary[name] || 0} Trips`];
        });
        
        autoTable(doc, {
            head: [['Depot Name', 'Total Security Trips']],
            body: summaryData,
            startY: finalY + 10,
            margin: { left: 40 },
            tableWidth: 250,
            theme: 'striped',
            headStyles: { fillColor: [51, 65, 85] },
            styles: { fontSize: 10 }
        });

        // ৬. গ্র্যান্ড টোটাল
        const totalY = doc.lastAutoTable.finalY + 30;
        doc.setFontSize(14);
        doc.setTextColor(126, 34, 206);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total Security: ${totalSecurityAmount.toLocaleString()} TK`, 40, totalY);

        doc.save(`Security_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#fdfaff] min-h-screen font-sans text-slate-800">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm border-purple-300 text-purple-600">❮</button>
                        <h1 className="text-3xl font-extrabold text-purple-700">Security Report</h1>
                    </div>
                </div>

                {/* Filter Section */}
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
                        <button onClick={fetchSecurity} className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none">Search Report</button>
                    </div>
                </div>

                {/* Report Table */}
                <div className="print-section">
                    {!hasSearched ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-purple-200 no-print">
                            <p className="text-slate-400">Search to view security reports.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-purple-50 mb-8">
                                <div className="overflow-x-auto">
                                    <table id="security-table" className="table w-full text-center">
                                        <thead>
                                            <tr className="bg-purple-700 text-white border-none">
                                                <th className="py-4">Date</th>
                                                <th>Depot</th>
                                                <th>Lorry No</th>
                                                <th>Driver Name</th>
                                                <th>Security Amount (৳)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {securityRows.length > 0 ? securityRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-purple-50/30 transition-colors border-b border-purple-50">
                                                    <td>{row.date}</td>
                                                    <td>{row.dipoName}</td>
                                                    <td>{row.lorryNo}</td>
                                                    <td>{row.driverName}</td>
                                                    <td className="text-purple-600 font-bold">{Number(row.security).toLocaleString()}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="5" className="py-10">No data found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Section */}
                            {securityRows.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 p-8 bg-white rounded-[2rem] border border-purple-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Summary by Depot</h3>
                                        <div className="space-y-2">
                                            {mainDepots.map(depot => {
                                                const label = depot.charAt(0).toUpperCase() + depot.slice(1);
                                                const count = depotSummary[label] || 0;
                                                return (
                                                    <div key={depot} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                                        <span className="font-medium text-slate-600">{label}</span>
                                                        <span className="badge badge-ghost font-bold">{count} Trips</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-end border-l pl-6">
                                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Grand Total Security</span>
                                        <span className="text-4xl font-black text-purple-700">{totalSecurityAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Buttons */}
                {hasSearched && securityRows.length > 0 && (
                    <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={downloadPDF} className="btn btn-outline border-purple-600 text-purple-600 rounded-xl px-6 font-bold">Download PDF</button>
                        <button onClick={() => window.print()} className="btn bg-purple-600 text-white rounded-xl px-8 font-bold border-none">Print Report</button>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .bg-purple-700 { background-color: #7e22ce !important; -webkit-print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
};

export default SecurityReport;