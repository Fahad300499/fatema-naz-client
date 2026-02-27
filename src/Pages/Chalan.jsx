import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const Chalan = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('মেসার্স ফাতেমা নাজ পেট্রোলিয়াম');
    const [chalanDate, setChalanDate] = useState(new Date().toISOString().split('T')[0]);
    const [allChalan, setAllChalan] = useState([]);
    const [formData, setFormData] = useState({ sl: '', carNo: '', driver: '', product: '', depo: '', chalanNo: '' });
    const [loading, setLoading] = useState(false);

    // ব্যাকএন্ড থেকে ডাটা লোড করা
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://fatema-naz-server-2.onrender.com/chalans/${chalanDate}`);
                setAllChalan(response.data.entries || []);
                setCompanyName(response.data.companyName || 'মেসার্স ফাতেমা নাজ পেট্রোলিয়াম');
            } catch (error) {
                console.error("ডাটা লোড করতে সমস্যা:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [chalanDate]);

    // ডাটাবেজে সেভ করার ফাংশন
    const saveToDB = async (updatedEntries) => {
        try {
            await axios.post('https://fatema-naz-server-2.onrender.com/chalans', {
                date: chalanDate,
                companyName,
                entries: updatedEntries
            });
        } catch (error) {
            console.error("সেভ করতে সমস্যা:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedEntries = [...allChalan, formData];
        setAllChalan(updatedEntries);
        saveToDB(updatedEntries); 
        
        // ফর্ম রিসেট এবং পরবর্তী ক্র নং সেট করা
        setFormData({ 
            sl: allChalan.length + 2, // অটোমেটিক পরবর্তী সিরিয়াল
            carNo: '', driver: '', product: '', depo: '', chalanNo: '' 
        });
    };

    // এন্ট্রি ডিলিট করার ফাংশন (প্রয়োজন হলে)
    const handleDelete = (index) => {
        const updated = allChalan.filter((_, i) => i !== index);
        setAllChalan(updated);
        saveToDB(updated);
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
                {/* কন্ট্রোল প্যানেল */}
                <div className="no-print mb-8 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => navigate(-1)} className="btn btn-circle btn-sm">❮</button>
                        <h2 className="text-xl font-bold">চালান এন্ট্রি প্যানেল</h2>
                    </div>

                    <div className="flex flex-wrap gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="form-control grow">
                            <label className="label text-xs font-bold text-blue-600">কোম্পানির নাম</label>
                            <input type="text" className="input input-bordered font-bold" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-blue-600">চালানের তারিখ</label>
                            <input type="date" className="input input-bordered border-primary" value={chalanDate} onChange={(e) => setChalanDate(e.target.value)} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-gray-50 p-4 rounded-lg border">
                        <input type="text" placeholder="ক্র নং" className="input input-sm input-bordered" value={formData.sl} onChange={(e) => setFormData({...formData, sl: e.target.value})} required />
                        <input type="text" placeholder="গাড়ি নং" className="input input-sm input-bordered" value={formData.carNo} onChange={(e) => setFormData({...formData, carNo: e.target.value})} required />
                        <input type="text" placeholder="ড্রাইভার" className="input input-sm input-bordered" value={formData.driver} onChange={(e) => setFormData({...formData, driver: e.target.value})} required />
                        <input type="text" placeholder="পণ্য" className="input input-sm input-bordered" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} required />
                        <input type="text" placeholder="ডিপো" className="input input-sm input-bordered" value={formData.depo} onChange={(e) => setFormData({...formData, depo: e.target.value})} required />
                        <input type="text" placeholder="চালান নং" className="input input-sm input-bordered" value={formData.chalanNo} onChange={(e) => setFormData({...formData, chalanNo: e.target.value})} required />
                        <button type="submit" className="btn btn-sm btn-primary col-span-full">লিস্টে যোগ করুন</button>
                    </form>
                </div>

                {/* প্রিন্ট ভিউ */}
                <div className="text-center relative">
                    {loading && <div className="absolute inset-0 bg-white/50 flex justify-center items-center z-10 no-print">Loading...</div>}
                    
                    <h2 className="text-3xl font-bold uppercase text-black">{companyName}</h2>
                    <p className="underline font-bold mt-1 text-black">চালানের হিসাব</p>
                    
                    <div className="flex justify-between mt-6 px-2">
                        <p className="font-bold text-black text-sm">বিল নং: {chalanDate.replace(/-/g, '')}</p>
                        <p className="font-bold text-black text-sm">তারিখ: {chalanDate}</p>
                    </div>
                    
                    <table className="table w-full mt-4 border-collapse border border-black text-black">
                        <thead>
                            <tr className="bg-gray-100 text-black">
                                <th className="border border-black w-12 text-center">ক্র.</th>
                                <th className="border border-black text-center">গাড়ি নং</th>
                                <th className="border border-black text-center">ড্রাইভার</th>
                                <th className="border border-black text-center">পণ্য</th>
                                <th className="border border-black text-center">ডিপো</th>
                                <th className="border border-black text-center">চালান নং</th>
                                <th className="border border-black text-center no-print">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allChalan.map((item, index) => (
                                <tr key={index} className="text-center border border-black">
                                    <td className="border border-black">{item.sl}</td>
                                    <td className="border border-black font-bold">{item.carNo}</td>
                                    <td className="border border-black">{item.driver}</td>
                                    <td className="border border-black">{item.product}</td>
                                    <td className="border border-black">{item.depo}</td>
                                    <td className="border border-black">{item.chalanNo}</td>
                                    <td className="no-print border border-black">
                                        <button onClick={() => handleDelete(index)} className="text-error btn btn-ghost btn-xs">✕</button>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* ফিলার রো (১৫টি ঘর পূর্ণ করার জন্য) */}
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

                    {/* সিগনেচার এরিয়া (প্রিন্ট এর জন্য) */}
                    <div className="mt-16 flex justify-between px-10 invisible print:visible">
                        <p className="border-t border-black px-4 pt-1">ম্যানেজারের স্বাক্ষর</p>
                        <p className="border-t border-black px-4 pt-1">কর্তৃপক্ষের স্বাক্ষর</p>
                    </div>
                </div>

                {/* নিচের বাটনসমূহ */}
                <div className='flex justify-between items-center mt-10 no-print border-t pt-6'>
                    <Link to="/" className="text-blue-600 font-semibold flex items-center gap-2">
                        ❮ হোমে ফিরে যান
                    </Link>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="btn btn-secondary px-8 shadow-lg">
                            প্রিন্ট রিপোর্ট
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chalan;