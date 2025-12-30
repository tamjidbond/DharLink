import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-pulse">
      
      {/* 1. HEADER SKELETON */}
      <div className="w-full bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Squircle */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-200 rounded-[2.5rem]" />
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Badge */}
            <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto md:mx-0" />
            {/* Name */}
            <div className="h-10 w-64 bg-slate-200 rounded-xl mx-auto md:mx-0" />
            {/* Stats */}
            <div className="flex gap-4 justify-center md:justify-start pt-2">
              <div className="h-12 w-24 bg-slate-100 rounded-2xl" />
              <div className="h-12 w-24 bg-slate-100 rounded-2xl" />
            </div>
          </div>
          {/* Edit Button */}
          <div className="h-14 w-40 bg-slate-900/5 rounded-2xl" />
        </div>
      </div>

      {/* 2. TABS SKELETON */}
      <div className="flex gap-2 mb-10 bg-slate-100/50 p-2 rounded-[1.5rem] w-fit">
        <div className="h-12 w-32 bg-white rounded-xl shadow-sm" />
        <div className="h-12 w-32 bg-slate-200/50 rounded-xl" />
        <div className="h-12 w-32 bg-slate-200/50 rounded-xl" />
      </div>

      {/* 3. CONTENT GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-4">
            <div className="w-full h-48 bg-slate-200 rounded-[2rem]" />
            <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
            <div className="flex justify-between items-center pt-4">
              <div className="h-10 w-24 bg-slate-100 rounded-xl" />
              <div className="h-8 w-8 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;