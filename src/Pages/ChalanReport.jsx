import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link, useNavigate } from 'react-router';

const ChalanReport = () => {
    const navigate = useNavigate();
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    // ডাটাবেজ থেকে রিপোর্ট আনা
    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/chalans/${searchDate}`);
            setReportData(response.data);
        } catch (error) {
            console.error("রিপোর্ট আনতে সমস্যা হয়েছে", error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    // PDF জেনারেট করার ফাংশন
    const downloadPDF = () => {
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            
            // হেডার
            doc.setFontSize(22);
            doc.setTextColor(40);
            doc.text(reportData?.companyName || "Fatema Naz Petroleum", 40, 50);
            
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Chalan Report - Date: ${searchDate}`, 40, 70);

            const tableColumn = ["Sl No.", "Car No", "Driver", "Product", "Depo", "Chalan No"];
            const tableRows = reportData.entries.map(item => [
                item.sl, item.carNo, item.driver, item.product, item.depo, item.chalanNo
            ]);

            autoTable(doc, {
                startY: 90,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [30, 41, 59], halign: 'center' }, // Dark Slate color matching your UI
                styles: { fontSize: 10, halign: 'center' },
                margin: { left: 40, right: 40 }
            });

            doc.save(`Chalan_Report_${searchDate}.pdf`);
        } catch (error) {
            console.error("PDF ডাউনলোড করতে সমস্যা হচ্ছে:", error);
            alert("PDF তৈরি করতে সমস্যা হয়েছে।");
        }
    };

    return (
        <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* হেডার সেকশন */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">❮</button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800">পুরানো চালান রিপোর্ট</h1>
                            <p className="text-slate-500 font-medium">আগের সকল চালানের তথ্য এখানে খুঁজুন</p>
                        </div>
                    </div>
                    <Link to="/" className="btn btn-ghost border-slate-200 bg-white shadow-sm rounded-xl">হোমে ফিরে যান</Link>
                </div>

                {/* সার্চ ফিল্টার */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-center">
                        <div className="form-control w-full md:w-64">
                            <label className="label text-xs font-bold text-slate-500 uppercase">চালান তারিখ সিলেক্ট করুন</label>
                            <input 
                                type="date" 
                                className="input input-bordered bg-slate-50 focus:border-primary" 
                                value={searchDate} 
                                onChange={(e) => setSearchDate(e.target.value)} 
                            />
                        </div>
                        <button 
                            onClick={fetchReport} 
                            className={`btn btn-primary px-8 rounded-xl ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'লোড হচ্ছে...' : 'ডাটা খুঁজুন'}
                        </button>
                    </div>
                </div>

                {/* রিপোর্ট টেবিল */}
                {reportData && reportData.entries.length > 0 ? (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 animate-fadeIn">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{reportData.companyName}</h3>
                                <p className="text-sm text-slate-500">তারিখ: <span className="font-bold">{searchDate}</span></p>
                            </div>
                            <button onClick={downloadPDF} className="btn btn-secondary btn-sm md:btn-md rounded-xl shadow-md">
                                📥 PDF ডাউনলোড
                            </button>
                        </div>

                        <div className="overflow-x-auto p-4">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="bg-slate-800 text-white border-none">
                                        <th className="rounded-l-xl">ক্র.</th>
                                        <th>গাড়ী নম্বর</th>
                                        <th>ড্রাইভার</th>
                                        <th>পণ্য</th>
                                        <th>ডিপো</th>
                                        <th className="rounded-r-xl text-center">চালান নং</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.entries.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="font-bold text-slate-400">{item.sl}</td>
                                            <td className="font-black font-mono text-blue-700">{item.carNo}</td>
                                            <td className="font-semibold text-slate-700">{item.driver}</td>
                                            <td><span className="badge badge-ghost font-medium">{item.product}</span></td>
                                            <td>{item.depo}</td>
                                            <td className="text-center font-bold text-slate-600">{item.chalanNo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 bg-slate-50 text-center">
                            <p className="text-xs text-slate-400 italic">মোট {reportData.entries.length} টি এন্ট্রি পাওয়া গেছে</p>
                        </div>
                    </div>
                ) : (
                    !loading && reportData && (
                        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                            <div className="text-5xl mb-4">📂</div>
                            <h3 className="text-xl font-bold text-slate-400">দুঃখিত! এই তারিখে কোনো তথ্য পাওয়া যায়নি।</h3>
                            <p className="text-slate-400">দয়া করে অন্য কোনো তারিখ চেষ্টা করুন।</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ChalanReport;