import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../Pages/Providers/AuthContext';



const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);

  // ডাটাবেজ থেকে রোল নিয়ে আসা
  useEffect(() => {
    if (user?.email) {
      fetch(`https://fatema-naz-server-3.onrender.com/user/role/${user.email}`)
        .then(res => res.json())
        .then(data => setDbUser(data));
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;
  const isAdmin = dbUser?.role === 'admin';

  return (
    <nav className="max-w-7xl mx-auto px-4 mt-10">
      
      {/* --- ব্যাক বাটন সেকশন --- */}
      <div className="flex justify-start mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 text-gray-700 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ফিরে যান
        </button>
      </div>

      {/* --- কার্ড মেনু সেকশন --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        
        {/* কার্ড ১: Per Trip Costing Amount (সবাই দেখবে) */}
        <Link to="/per-trip-cost" className="w-full">
          <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
            ${isActive('/per-trip-cost') ? 'border-orange-500 bg-orange-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className="absolute -right-4 -bottom-4 h-20 w-20 bg-orange-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/per-trip-cost') ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">Per Trip <br /> Costing Amount</h3>
            </div>
          </div>
        </Link>

        {/* কার্ড ২: Trip History (শুধু অ্যাডমিন) */}
        {isAdmin && (
          <Link to="/trip-history" className="w-full">
            <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
              ${isActive('/trip-history') ? 'border-blue-600 bg-blue-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1'}`}>
               <div className="absolute -right-4 -bottom-4 h-20 w-20 bg-blue-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/trip-history') ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">Trip <br /> History</h3>
               </div>
            </div>
          </Link>
        )}

        {/* কার্ড ৩: Total Lory Of Fatema Naz (শুধু অ্যাডমিন) */}
        {isAdmin && (
          <Link to="/fatema-total-lory" className="w-full">
            <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
              ${isActive('/fatema-total-lory') ? 'border-green-600 bg-green-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-green-200 hover:shadow-2xl hover:-translate-y-1'}`}>
               <div className="absolute -right-4 -bottom-4 h-20 w-20 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/fatema-total-lory') ? 'bg-green-600 text-white shadow-lg' : 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">Total Lory Of <br /> Fatema Naz</h3>
               </div>
            </div>
          </Link>
        )}

        {/* কার্ড ৪: Dip Chalan (সবাই দেখবে) */}
        <Link to="/dip-chalan" className="w-full">
          <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
            ${isActive('/dip-chalan') ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/dip-chalan') ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">Dip <br /> Chalan</h3>
            </div>
          </div>
        </Link>

        {/* কার্ড ৫: Chalan Report (শুধু অ্যাডমিন) */}
        {isAdmin && (
          <Link to="/chalan-report" className="w-full">
            <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
              ${isActive('/chalan-report') ? 'border-rose-500 bg-rose-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-rose-200 hover:shadow-2xl hover:-translate-y-1'}`}>
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/chalan-report') ? 'bg-rose-500 text-white shadow-lg' : 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">Chalan <br /> Report</h3>
               </div>
            </div>
          </Link>
        )}

        {/* কার্ড ৬: Lory Work (সবাই দেখবে) */}
        <Link to="/lory-work" className="w-full">
          <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
            ${isActive('/lory-work') ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/lory-work') ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">Lory <br /> Work</h3>
            </div>
          </div>
        </Link>

        {/* কার্ড ৭: Lory Work History (শুধু অ্যাডমিন) */}
        {isAdmin && (
          <Link to="/lory-work-history" className="w-full">
            <div className={`group relative p-6 rounded-3xl transition-all duration-300 border-2 overflow-hidden h-full
              ${isActive('/lory-work-history') ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-2xl hover:-translate-y-1'}`}>
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`mb-4 p-4 rounded-2xl transition-all ${isActive('/lory-work-history') ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">Lory <br /> Work History</h3>
               </div>
            </div>
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;