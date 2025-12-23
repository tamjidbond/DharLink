import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUserEdit, FaTimes } from 'react-icons/fa';

// COMPONENTS
import ProfileHeader from '../Components/profile-components/ProfileHeader';
import IncomingRequests from '../Components/profile-components/IncomingRequests';
import MyListings from '../Components/profile-components/MyListings';
import MyBorrowing from '../Components/profile-components/MyBorrowing';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('lending');
  const [myItems, setMyItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myBorrowRequests, setMyBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', address: '', phone: '', createdAt: '', karma: 0, totalDeals: 0 });

  // Badge Logic based on Karma
  const getBadge = (karma) => {
    if (karma >= 500) return { name: "DharLink Legend", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "👑" };
    if (karma >= 201) return { name: "Community Pillar", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "🏛️" };
    if (karma >= 51) return { name: "Reliable Lender", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🤝" };
    return { name: "New Neighbor", color: "bg-slate-100 text-slate-600 border-slate-200", icon: "🌱" };
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) { 
      setUserEmail(savedEmail); 
      fetchProfileData(savedEmail); 
    } else { 
      setLoading(false); 
    }
  }, []);

  // Main Data Fetcher
  const fetchProfileData = async (email) => {
    try {
      const [itemsRes, incomingRes, outgoingRes, userRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/items/user/${email}`),
        axios.get(`http://localhost:8000/api/requests/owner/${email}`),
        axios.get(`http://localhost:8000/api/requests/borrower/${email}`),
        axios.get(`http://localhost:8000/api/users/profile-by-email/${email}`)
      ]);
      setMyItems(itemsRes.data);
      setIncomingRequests(incomingRes.data);
      setMyBorrowRequests(outgoingRes.data);
      if (userRes.data) setUserData({ ...userRes.data, email });
    } catch (err) { 
      console.error("Error fetching profile:", err); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const res = await Swal.fire({ 
        title: 'Delete Listing?', 
        text: "This item will be removed from the map.",
        icon: 'warning', 
        showCancelButton: true,
        confirmButtonColor: '#ef4444'
    });
    if (res.isConfirmed) { 
      await axios.delete(`http://localhost:8000/api/items/delete/${id}`); 
      fetchProfileData(userEmail); 
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:8000/api/users/update/${userEmail}`, userData);
        setIsEditModalOpen(false); 
        fetchProfileData(userEmail);
        Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire('Error', 'Could not update profile', 'error');
    }
  };

  // --- REQUEST ACTIONS ---

  const handleApprove = async (id) => { 
    try {
        const res = await axios.patch(`http://localhost:8000/api/requests/approve/${id}`); 
        Swal.fire({ 
            icon: 'success', 
            title: 'Approved!', 
            text: `Return time is set.`,
            timer: 2000, 
            showConfirmButton: false 
        });
        fetchProfileData(userEmail); 
    } catch (err) {
        Swal.fire('Error', 'Approval failed', 'error');
    }
  };

  const handleReject = async (id) => { 
    const res = await Swal.fire({ title: 'Reject Request?', icon: 'question', showCancelButton: true });
    if (res.isConfirmed) {
        await axios.patch(`http://localhost:8000/api/requests/reject/${id}`); 
        fetchProfileData(userEmail); 
    }
  };

  const handleComplete = async (requestId, borrowerEmail, rating) => {
    try {
      // Show a small loading state while backend calculates excessTime/Karma
      Swal.showLoading();
      
      const res = await axios.patch(`http://localhost:8000/api/requests/complete/${requestId}`, { rating });

      Swal.fire({
        icon: 'success',
        title: 'Transaction Complete!',
        html: `
          <div class="text-center p-2">
            <p class="font-bold text-indigo-600 text-lg">${res.data.message}</p>
            <div class="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p class="text-[10px] text-slate-400 uppercase tracking-widest font-black">Community Impact</p>
                <p class="text-sm font-bold text-slate-700">Karma Points adjusted based on return time.</p>
            </div>
          </div>
        `,
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-[2rem]' }
      });

      fetchProfileData(userEmail); 
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not complete return', 'error');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing DharLink...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 pb-20">
      {/* 1. Header with Badge & Stats */}
      <ProfileHeader 
        userData={userData} 
        currentBadge={getBadge(userData.karma)} 
        setIsEditModalOpen={setIsEditModalOpen} 
      />

      {/* 2. Navigation Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto md:mx-0">
        {[
          { id: 'lending', label: 'Requests Received' },
          { id: 'listings', label: 'My Listings' },
          { id: 'borrowing', label: 'My Borrowing' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-[11px] md:text-sm transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Content */}
      <div className="transition-all duration-500">
        {activeTab === 'lending' && (
            <IncomingRequests 
                requests={incomingRequests} 
                handleApprove={handleApprove} 
                handleReject={handleReject} 
                handleComplete={handleComplete} 
            />
        )}
        {activeTab === 'listings' && (
            <MyListings 
                items={myItems} 
                handleDeleteItem={handleDeleteItem} 
            />
        )}
        {activeTab === 'borrowing' && (
            <MyBorrowing 
                requests={myBorrowRequests} 
            />
        )}
      </div>

      {/* 4. Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FaUserEdit className="text-indigo-600" /> Edit Profile
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Full Name</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Phone Number</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Home Address</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition" value={userData.address} onChange={(e) => setUserData({ ...userData, address: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-colors mt-4 shadow-lg shadow-slate-200">
                Update DharLink Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;