import React, { useState } from 'react';
import { FaPlus, FaTags, FaTrashAlt, FaSearch, FaTimes } from 'react-icons/fa';

const CategoriesTab = ({ categories, newCategoryName, setNewCategoryName, handleAddCategory, handleDeleteCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories based on the search input
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* LEFT PANEL: PROTOCOL INJECTION (ADD CATEGORY) */}
      <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md h-fit shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <FaPlus className="text-indigo-400 text-sm" />
              </div>
              <span className="tracking-tight text-white">Protocol: New Category</span>
          </h3>
          
          <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                    Identity Label
                </label>
                <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="E.g. Electronics..."
                    className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-indigo-500 transition font-bold text-white placeholder:text-slate-600 shadow-inner"
                />
              </div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-indigo-500/20 uppercase tracking-[0.2em] text-[10px] active:scale-95">
                  Inject Category
              </button>
          </form>
      </div>

      {/* RIGHT PANEL: CORE SYSTEM (CATEGORY LIST) */}
      <div className="lg:col-span-2 bg-slate-800/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl flex flex-col">
          
          {/* HEADER & SEARCH BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <FaTags className="text-indigo-400" /> Active Registry
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    System Nodes: <span className="text-indigo-400">{categories.length} Total</span>
                </p>
              </div>

              {/* MAC-STYLE SPOTLIGHT SEARCH */}
              <div className="relative group">
                  <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-indigo-400' : 'text-slate-500'}`} size={14} />
                  <input 
                    type="text"
                    placeholder="Search protocols..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-10 py-3 bg-slate-900/80 border border-white/5 rounded-2xl text-xs font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all w-full md:w-64"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
              </div>
          </div>

          {/* RESULTS GRID - content-start prevents items from stretching vertically */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px] overflow-y-auto no-scrollbar pr-2 content-start">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                    <div 
                      key={cat._id} 
                      className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] hover:border-indigo-500/50 transition duration-300 h-fit"
                    >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                          <span className="font-black uppercase tracking-widest text-[11px] text-slate-300 group-hover:text-white transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteCategory(cat._id)} 
                          className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 p-2.5 rounded-xl transition-all"
                          title="Delete Protocol"
                        >
                            <FaTrashAlt size={14} />
                        </button>
                    </div>
                ))
              ) : (
                /* EMPTY STATE UI */
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem] bg-black/10">
                  <div className="p-5 bg-white/5 rounded-full mb-4">
                    <FaSearch size={30} className="opacity-20 text-indigo-400" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">
                    No matching protocols found
                  </p>
                </div>
              )}
          </div>

          {/* FOOTER SYSTEM STATUS */}
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
             <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500 opacity-50" />
                <div className="w-2 h-2 rounded-full bg-amber-500 opacity-50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-50" />
             </div>
             <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                DharNow_Admin_v1.0 // Secured
             </p>
          </div>
      </div>
    </div>
  );
};

export default CategoriesTab;