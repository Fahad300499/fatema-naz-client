import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ChangeRole = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    // ১. সব ইউজার ডাটা নিয়ে আসার ফাংশন
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/users');

            if (!response.ok) {
                throw new Error('সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে।');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ২. রোল পরিবর্তন (Toggle) করার ফাংশন
    const handleToggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const actionText = newRole === 'admin' ? 'অ্যাডমিন' : 'সাধারণ ইউজার';

        Swal.fire({
            title: 'আপনি কি নিশ্চিত?',
            text: `আপনি এই ইউজারকে ${actionText} বানাতে চাচ্ছেন!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'হ্যাঁ, পরিবর্তন করুন',
            cancelButtonText: 'বাতিল'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:3000/users/role/${user._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ role: newRole })
                    });

                    if (res.ok) {
                        Swal.fire('সফল!', `ইউজার এখন ${actionText}।`, 'success');
                        fetchUsers(); // ডাটা রিফ্রেশ
                    } else {
                        throw new Error('রোল পরিবর্তন করা সম্ভব হয়নি');
                    }
                } catch (error) {
                    Swal.fire('এরর!', error.message, 'error');
                }
            }
        });
    };

    // ৩. ইউজার ডিলিট করার ফাংশন
    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: 'ডিলিট করতে চান?',
            text: "এটি আর ফিরিয়ে আনা যাবে না!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
            cancelButtonText: 'না'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:3000/users/${id}`, {
                        method: 'DELETE'
                    });

                    if (res.ok) {
                        Swal.fire('ডিলিট হয়েছে!', 'ইউজারটি রিমুভ করা হয়েছে।', 'success');
                        fetchUsers();
                    } else {
                        throw new Error("ডিলিট করা সম্ভব হয়নি।");
                    }
                } catch (error) {
                    Swal.fire('এরর!', error.message, 'error');
                }
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-blue-600 italic">লোড হচ্ছে... একটু অপেক্ষা করুন</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800">ইউজার ম্যানেজমেন্ট</h2>
                            <p className="text-gray-400 text-sm">রোল পরিবর্তন এবং ইউজার নিয়ন্ত্রণ করুন</p>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-full">
                            <span className="text-blue-600 font-bold text-sm">মোট ইউজার: {users.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">ইউজার</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">রোল</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={user.photo || 'https://via.placeholder.com/40'} 
                                                    alt="" 
                                                    className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover" 
                                                />
                                                <div>
                                                    <div className="font-bold text-gray-800">{user.name}</div>
                                                    <div className="text-xs text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleToggleRole(user)}
                                                    className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm ${user.role === 'admin' ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                                >
                                                    {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeRole;