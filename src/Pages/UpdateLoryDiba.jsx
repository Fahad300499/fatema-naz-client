import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, Calendar, Loader2, FileText, Clock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateLoryDiba = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        taxToken: '',
        fitness: '',
        routePermit: '',
        registration: '',
        calibration: '',
        exclusive: '',
        createdAt: new Date().toISOString().split('T')[0] // ডিফল্ট হিসেবে আজকের তারিখ
    });

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const res = await axios.get(`https://api.ashrafulenterprise.com/lory-details-diba/${id}`);
                if (res.data) {
                    const { _id, loryNumber, ...editableData } = res.data;
                    
                    setFormData({
                        taxToken: editableData.taxToken || '',
                        fitness: editableData.fitness || '',
                        routePermit: editableData.routePermit || '',
                        registration: editableData.registration || '',
                        calibration: editableData.calibration || '',
                        exclusive: editableData.exclusive || '',
                        createdAt: editableData.createdAt || new Date().toISOString().split('T')[0]
                    });
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
            const res = await axios.put(`https://api.ashrafulenterprise.com/edit-lory-diba/${id}`, formData);
            
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                Swal.fire({
                    title: 'সফল!',
                    text: 'ডকুমেন্ট আপডেট করা হয়েছে',
                    icon: 'success',
                    confirmButtonText: 'ঠিক আছে'
                }).then(() => {
                    navigate(-1);
                });
            }
        } catch (error) {
            console.error("আপডেট এরর:", error.response?.data || error.message);
            Swal.fire('ভুল!', 'আপডেট ব্যর্থ হয়েছে', 'error');
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
                <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <FileText className="text-blue-400" size={30} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Document Update Form</h2>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Lory: {id}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                    {/* কাস্টম আপডেট ডেট সেকশন */}
                    <div className="mb-10 p-6 bg-blue-50 border border-blue-100 rounded-[2rem]">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-blue-600 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <Clock size={14} /> Update Entry Date (Todays Date)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                                <input 
                                    type="date"
                                    name="createdAt"
                                    value={formData.createdAt}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-2">Documents Expire Dates</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {Object.keys(formData).map((key) => (
                            key !== 'createdAt' && (
                                <div key={key} className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                                        {key.replace(/([A-Z])/g, ' $1')} Expiry Date
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
                            )
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            Update
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateLoryDiba;