import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from './Providers/AuthContext';

const AdminSecurity = () => {
    const { user, dbUser } = useContext(AuthContext);
    const [newMasterPassword, setNewMasterPassword] = useState("");

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        // নিরাপত্তা চেক: অ্যাডমিন কি না
        if (dbUser?.role !== 'admin') {
            return Swal.fire('নিষিদ্ধ!', 'শুধুমাত্র অ্যাডমিন পাসওয়ার্ড পরিবর্তন করতে পারবে।', 'error');
        }

        try {
            const response = await axios.post('https://fatema-naz-server-7.onrender.com/api/admin/update-master-password', {
                newPassword: newMasterPassword,
                adminEmail: user?.email // আপনার ব্যাকএন্ডে এই ইমেইল দিয়ে চেক করবে
            });

            if (response.data.modifiedCount > 0 || response.data.upsertedCount > 0) {
                Swal.fire('সফল!', 'মাস্টার পাসওয়ার্ড আপডেট করা হয়েছে।', 'success');
                setNewMasterPassword(""); // ইনপুট ফিল্ড খালি করা
            }
        } catch (error) {
            console.error(error);
            Swal.fire('ব্যর্থ!', 'পাসওয়ার্ড আপডেট করা সম্ভব হয়নি।', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-[2rem] shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-slate-800">পাসওয়ার্ড সেটআপ</h2>
                <p className="text-slate-500 text-sm mt-1">স্টাফদের এক্সেস কন্ট্রোল করার জন্য পাসওয়ার্ড দিন</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-bold text-slate-600">নতুন পাসওয়ার্ড</span>
                    </label>
                    <input 
                        type="text" // অথবা password দিতে পারেন
                        placeholder="উদা: FN@2026" 
                        className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20"
                        value={newMasterPassword}
                        onChange={(e) => setNewMasterPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary w-full rounded-xl text-white font-bold shadow-lg shadow-primary/20"
                >
                    পাসওয়ার্ড সেভ করুন
                </button>
            </form>
        </div>
    );
};

export default AdminSecurity;