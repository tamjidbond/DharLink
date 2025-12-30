import React, { useState } from 'react';
import { FaRedo, FaChevronDown, FaSearch, FaTimes } from 'react-icons/fa';

const CategorySkeleton = () => (
  <div className="flex flex-wrap items-center gap-2 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-10 w-24 bg-slate-200 rounded-[1.2rem]"></div>
    ))}
  </div>
);

const CategoryFilters = ({ categories, selectedCategory, setSelectedCategory, resetFilters, hasActiveFilters, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <CategorySkeleton />;

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic to slice the menu (only if not searching)
  const isSearching = searchTerm.length > 0;
  const visibleCategories = isExpanded || isSearching ? filteredCategories : filteredCategories.slice(0, 5);

  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* SEARCH INPUT: Mac Style */}
      <div className="relative group mr-2">
        <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-indigo-500' : 'text-slate-300'}`} size={12} />
        <input 
          type="text"
          placeholder="Find category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 py-2.5 bg-slate-100/50 border border-slate-200/50 rounded-[1.2rem] text-[11px] font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none w-44 transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {/* FILTER PILLS */}
      {visibleCategories.map(cat => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-5 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-tight transition-all duration-300 ${
            selectedCategory === cat 
            ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" 
            : "bg-white text-slate-500 border border-slate-100 hover:border-indigo-400 hover:text-indigo-600 shadow-sm"
          }`}
        >
          {cat}
        </button>
      ))}

      {/* VIEW ALL TOGGLE (Hide if searching or if filtered results are few) */}
      {!isSearching && filteredCategories.length > 5 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="group px-4 py-2.5 rounded-[1.2rem] bg-slate-100/50 border border-slate-200/50 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        >
          {isExpanded ? 'Collapse' : `+${filteredCategories.length - 5} More`}
          <FaChevronDown className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* NO RESULTS FOUND */}
      {isSearching && filteredCategories.length === 0 && (
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic">No categories found...</span>
      )}
      
      {/* RESET BUTTON */}
      {(hasActiveFilters || isSearching) && (
        <button 
          onClick={() => { resetFilters(); setSearchTerm(""); }} 
          className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-auto px-4 py-2 hover:bg-rose-50 rounded-xl transition-all"
        >
          <FaRedo size={10} /> Reset Grid
        </button>
      )}
    </div>
  );
};

export default CategoryFilters;