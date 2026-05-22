import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const ChalanImam = () => {
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState('Imam Hossain Petroleum');
    const [chalanDate, setChalanDate] = useState(new Date().toISOString().split('T')[0]);
    const [allChalan, setAllChalan] = useState([]);
    const [formData, setFormData] = useState({ carNo: '', driver: '', product: '', depo: '', chalanNo: '' });
    const [loading, setLoading] = useState(false);

    // তারিখ পরিবর্তন হলে অথবা প্রথমবার পেজ লোড হলে ডাটা ব্যাকএন্ড থেকে আসবে
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.ashrafulenterprise.com/chalans-imam/${chalanDate}`);
                // যদি ওই তারিখে ডাটা থাকে তবে সেট হবে, না থাকলে খালি অ্যারে হবে
                setAllChalan(response.data.entries || []);
                setCompanyName(response.data.companyName || 'Imam Hossain Petroleum');
            } catch (error) {
                console.error("ডাটা লোড করতে সমস্যা:", error);
                setAllChalan([]); 
            } finally {
                setLoading(false);
            }
        };
        
        if (chalanDate) {
            loadData();
        }
    }, [chalanDate]);

    // ডাটাবেজে সেভ করার ফাংশন (সর্বশেষ companyName সহ সেভ হবে)
    const saveToDB = async (updatedEntries) => {
        try {
            await axios.post('https://api.ashrafulenterprise.com/chalans-imam', {
                date: chalanDate,
                companyName, // কারেন্ট কোম্পানি নেম স্টেট থেকে যাবে
                entries: updatedEntries
            });
        } catch (error) {
            console.error("সেভ করতে সমস্যা:", error);
            alert("ডাটাবেজে সেভ হতে সমস্যা হয়েছে!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ১. একই গাড়ির নম্বর চেক করার লজিক
        const isDuplicate = allChalan.some(
            (item) => item.carNo.trim().toLowerCase() === formData.carNo.trim().toLowerCase()
        );

        if (isDuplicate) {
            alert(`দুঃখিত! ${formData.carNo} নম্বর গাড়িটি এই তারিখের জন্য অলরেডি এন্ট্রি করা হয়েছে।`);
            return; 
        }

        // ইউনিক আইডি জেনারেশন লজিক (crypto.randomUUID অথবা ইউনিক টাইমস্ট্যাম্প আইডি হিসেবে কাজ করবে)
        const uniqueId = typeof crypto.randomUUID === 'function' 
            ? crypto.randomUUID() 
            : `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // ২. SL No অটো জেনারেট এবং ইউনিক আইডি অবজেক্টে যুক্ত করা
        const newEntry = {
            ...formData,
            _id: uniqueId, // ফ্রন্টএন্ড থেকে ডাটাবেজ ফ্রেন্ডলি আইডি সেট করা হলো
            id: uniqueId,  // ব্যাকআপ আইডি
            sl: allChalan.length + 1 // অটোমেটিক সিরিয়াল বসে যাবে
        };

        const updatedEntries = [...allChalan, newEntry];
        setAllChalan(updatedEntries);
        saveToDB(updatedEntries); 
        
        // ফর্ম রিসেট
        setFormData({ carNo: '', driver: '', product: '', depo: '', chalanNo: '' });
    };

    const handleDelete = (index) => {
        if(window.confirm("আপনি কি নিশ্চিতভাবে এই চালানিটি ডিলিট করতে চান?")) {
            const filteredChalan = allChalan.filter((_, i) => i !== index);
            
            // ডিলিট করার পর সিরিয়াল নম্বর (SL) পুনরায় সাজানো
            const updated = filteredChalan.map((item, i) => ({
                ...item,
                sl: i + 1
            }));

            setAllChalan(updated);
            saveToDB(updated);
        }
    };

    return (
        <div className="p-4 md:p-10 bg-base-200 min-h-screen font-sans">
            <style>
                {`@media print { 
                    .no-print { display: none !important; } 
                    body { background: white; }
                    .printable-card { box-shadow: none !important; border: none !important; padding: 0 !important; } 
                    table { border-collapse: collapse !important; width: 100% !important; } 
                    th, td { border: 1px solid black !important; padding: 5px !important; font-size: 14px !important; color: black !important; } 
                }`}
            </style>

            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg printable-card">
                <div className="no-print mb-8 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-sm">❮</button>
                        <h2 className="text-xl font-bold">Chalan Entry Panel</h2>
                    </div>

                    <div className="flex flex-wrap gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="form-control grow">
                            <label className="label text-xs font-bold text-blue-600">Company Name </label>
                            <input type="text" className="input input-bordered font-bold" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-blue-600">Chalan Date</label>
                            <input type="date" className="input input-bordered border-primary" value={chalanDate} onChange={(e) => setChalanDate(e.target.value)} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-gray-50 p-4 rounded-lg border">
                        <input type="text" placeholder="Lorry No" className="input input-sm input-bordered" value={formData.carNo} onChange={(e) => setFormData({...formData, carNo: e.target.value})} required />
                        <input type="text" placeholder="Driver" className="input input-sm input-bordered" value={formData.driver} onChange={(e) => setFormData({...formData, driver: e.target.value})} required />
                        <input type="text" placeholder="Product" className="input input-sm input-bordered" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} required />
                        <input type="text" placeholder="Dipo" className="input input-sm input-bordered" value={formData.depo} onChange={(e) => setFormData({...formData, depo: e.target.value})} required />
                        <input type="text" placeholder="Chalan No" className="input input-sm input-bordered" value={formData.chalanNo} onChange={(e) => setFormData({...formData, chalanNo: e.target.value})} required />
                        <button type="submit" className="btn btn-sm btn-primary col-span-full">Add List</button>
                    </form>
                </div>

                <div className="text-center relative">
                    {loading && <div className="absolute inset-0 bg-white/50 flex justify-center items-center z-10 no-print">Loading...</div>}
                    
                    <h2 className="text-3xl font-bold uppercase text-black">{companyName}</h2>
                    <p className="underline font-bold mt-1 text-black">Chalans Calculation</p>
                    
                    <div className="flex justify-between mt-6 px-2">
                        <p className="font-bold text-black text-sm">Date: {chalanDate}</p>
                    </div>
                    
                    <table className="table w-full mt-4 border-collapse border border-black text-black">
                        <thead>
                            <tr className="bg-gray-100 text-black">
                                <th className="border border-black w-12 text-center">Sl.</th>
                                <th className="border border-black text-center">Lory No</th>
                                <th className="border border-black text-center">Driver</th>
                                <th className="border border-black text-center">Product</th>
                                <th className="border border-black text-center">Dipo</th>
                                <th className="border border-black text-center">Chalan No</th>
                                <th className="border border-black text-center no-print">Reject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allChalan.length > 0 && (
                                allChalan.map((item, index) => (
                                    // ইউনিক আইডিকে রিয়্যাক্টের 'key' হিসেবে ব্যবহার করা হলো প্রোপার রেন্ডারিং এর জন্য
                                    <tr key={item._id || item.id || index} className="text-center border border-black">
                                        <td className="border border-black">{item.sl || index + 1}</td>
                                        <td className="border border-black font-bold">{item.carNo}</td>
                                        <td className="border border-black">{item.driver}</td>
                                        <td className="border border-black">{item.product}</td>
                                        <td className="border border-black">{item.depo}</td>
                                        <td className="border border-black">{item.chalanNo}</td>
                                        <td className="no-print border border-black">
                                            <button onClick={() => handleDelete(index)} className="text-error btn btn-ghost btn-xs">✕</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            
                            {/* ফিলার রো */}
                            {allChalan.length < 15 && [...Array(15 - allChalan.length)].map((_, i) => (
                                <tr key={`empty-${i}`} className="h-9">
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black no-print"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-10 no-print border-t pt-6'>
                    <Link to="/" className="text-blue-600 font-semibold flex items-center gap-2">
                        ❮ Home
                    </Link>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="btn btn-secondary px-8 shadow-lg">
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChalanImam;