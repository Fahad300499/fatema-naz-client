import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';

const UpdateLory = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // ফরমের স্টেটে শুধুমাত্র প্রয়োজনীয় ফিল্ডগুলো রাখা হয়েছে
    const [formData, setFormData] = useState({
        taxToken: '',
        fitness: '',
        routePermit: '',
        registration: '',
        calibration: '',
        exclusive: ''
    });

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const res = await axios.get(`https://fatema-naz-server-6.onrender.com/lory-details/${id}`);
                if (res.data) {
                    // ডাটাবেজ থেকে আসা ডাটা থেকে আইডি এবং লরি নং বাদ দিয়ে স্টেট সেট করা
                    const { _id, ...editableData } = res.data;
                    setFormData(prev => ({ ...prev, ...editableData }));
                }
            } catch (error) {
                console.error("ডাটা আনতে সমস্যা হয়েছে:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchCurrentData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ডাটা আপডেট করার সময় শুধু formData পাঠানো হচ্ছে (যেখানে ID নাই)
            const res = await axios.put(`https://fatema-naz-server-6.onrender.com/edit-lory/${id}`, formData);
            
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                alert("সফলভাবে আপডেট হয়েছে!");
                navigate(-1);
            }
        } catch (error) {
            console.error("আপডেট এরর:", error.response?.data || error.message);
            alert("আপডেট ব্যর্থ হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 bg-[#f8fafc] min-h-screen font-sans">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> ফিরে যান
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    {/* এখানে শুধু টাইটেল হিসেবে লরি নম্বরটি দেখা যাবে, কিন্তু ইনপুট হিসেবে নয় */}
                    <h2 className="text-3xl font-black font-mono tracking-tighter italic">{id}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">ডকুমেন্ট আপডেট ফরম</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {Object.keys(formData).map((key) => (
                            <div key={key} className="flex flex-col gap-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="date"
                                        name={key}
                                        value={formData[key] || ''}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            আপডেট করুন
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                        >
                            বাতিল
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateLory;