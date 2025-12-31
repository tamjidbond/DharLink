import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import { Link } from 'react-router';
import {
  FaDirections,
  FaCrosshairs,
  FaSearch,
  FaFilter,
  FaThLarge,
  FaMapMarkedAlt,
  FaLayerGroup,
  FaExpand,
  FaTimes,
  FaStar,
  FaChevronDown,
  FaWalking,
  FaCar,
  FaHeart,
  FaShareAlt,
  FaSync,      // ✅ VALID
  FaArrowRight,
  FaSlidersH
} from 'react-icons/fa';
import L from 'leaflet';

// ============ CUSTOM CSS (Include this in your global styles) ============
const customStyles = `
  /* User Marker Animations */
  @keyframes userPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(2); opacity: 0.3; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes userRipple {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(3); opacity: 0; }
  }

  .user-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,70,229,0.8) 0%, rgba(79,70,229,0.2) 70%, transparent 100%);
    animation: userPulse 2s ease-in-out infinite;
    z-index: 1;
  }
  .user-ripple {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(79,70,229,0.6);
    animation: userRipple 2s ease-out infinite;
    z-index: 0;
  }

  /* Item Tag Marker */
  .item-tag-marker {
    z-index: 999 !important;
  }
  .map-item-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 8px 14px;
    box-shadow: 0 4px 15px rgba(102,126,234,0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 80px;
    transition: all 0.3s ease;
    animation: tagFloat 3s ease-in-out infinite;
  }
  .map-item-tag:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 25px rgba(102,126,234,0.6);
  }
  @keyframes tagFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .tag-price {
    color: white;
    font-weight: 900;
    font-size: 12px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .tag-name {
    color: rgba(255,255,255,0.95);
    font-weight: 700;
    font-size: 9px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Cluster Marker */
  .cluster-marker {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    box-shadow: 0 4px 15px rgba(102,126,234,0.5);
    border: 3px solid white;
    transition: all 0.3s ease;
  }
  .cluster-marker:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 20px rgba(102,126,234,0.7);
  }

  /* Custom Popup */
  .dharlink-popup .leaflet-popup-content-wrapper {
    border-radius: 24px;
    padding: 0;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
  .dharlink-popup .leaflet-popup-tip {
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
  .dharlink-popup .leaflet-popup-content {
    margin: 0;
    width: 280px !important;
  }
  .dharlink-popup .leaflet-popup-close-button {
    display: none;
  }

  /* Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Filter Panel Animation */
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .filter-panel {
    animation: slideIn 0.3s ease-out;
  }

  /* Route Animation */
  .route-line {
    stroke-dasharray: 10, 10;
    animation: dashMove 1s linear infinite;
  }
  @keyframes dashMove {
    to { stroke-dashoffset: -20; }
  }
`;

// ============ MAP STYLES ============
const MAP_STYLES = {
  voyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap, © CartoDB'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap, © CartoDB'
  },
  osm: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  }
};

// ============ UTILITY FUNCTIONS ============
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

// ============ MAP CONTROLLER ============
const MapController = ({ userCoords, focusCoords, selectedRoute, onClearRoute }) => {
  const map = useMap();

  const handleRecenter = useCallback(() => {
    if (userCoords) {
      map.flyTo(userCoords, 15, { animate: true, duration: 1.5 });
    }
  }, [map, userCoords]);

  const handleFullscreen = useCallback(() => {
    const container = map.getContainer();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [map]);

  useEffect(() => {
    if (focusCoords) {
      map.flyTo(focusCoords, 17, { animate: true, duration: 1.5 });
    }
  }, [focusCoords, map]);

  return (
    <>
      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-24 right-4 z-[1000] bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 group"
        title="Find my location"
      >
        <FaCrosshairs size={18} className="group-hover:animate-spin" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={handleFullscreen}
        className="absolute bottom-24 right-16 z-[1000] bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all active:scale-90"
        title="Fullscreen"
      >
        <FaExpand size={16} />
      </button>

      {/* Clear Route Button */}
      {selectedRoute && (
        <button
          onClick={onClearRoute}
          className="absolute bottom-40 right-4 z-[1000] bg-red-500 p-3.5 rounded-2xl shadow-2xl border border-red-400 text-white hover:bg-red-600 transition-all active:scale-90 flex items-center gap-2"
          title="Clear route"
        >
          <FaTimes size={16} />
          <span className="text-xs font-bold">Clear</span>
        </button>
      )}
    </>
  );
};

// ============ CLUSTER MARKER ============
const ClusterMarker = ({ count, position, onClick }) => {
  const size = Math.min(50 + count * 2, 80);

  const clusterIcon = L.divIcon({
    className: 'cluster-marker',
    html: `<div style="width: ${size}px; height: ${size}px; font-size: ${size / 3}px;">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });

  return (
    <Marker position={position} icon={clusterIcon} eventHandlers={{ click: onClick }} />
  );
};

// ============ MAIN COMPONENT ============
const ItemMapView = ({ filteredItems, userCoords }) => {
  const userProfileImg = localStorage.getItem('userImage');

  // State
  const [mapStyle, setMapStyle] = useState('voyager');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [focusCoords, setFocusCoords] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [sortBy, setSortBy] = useState('distance');
  const [showFavorites, setShowFavorites] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  // Calculate distances for all items
  const itemsWithDistance = useMemo(() => {
    if (!userCoords) return filteredItems;

    return filteredItems.map(item => {
      let lat, lng;
      if (item.location?.coordinates) {
        lng = item.location.coordinates[0];
        lat = item.location.coordinates[1];
      } else if (item.coordinates) {
        lng = item.coordinates[0];
        lat = item.coordinates[1];
      }

      if (typeof lat === 'number' && typeof lng === 'number') {
        const distance = calculateDistance(
          userCoords[0], userCoords[1],
          lat, lng
        );
        return { ...item, distance, lat, lng };
      }
      return item;
    });
  }, [filteredItems, userCoords]);

  // Filter items
  const filteredByCategory = selectedCategory === 'all'
    ? itemsWithDistance
    : itemsWithDistance.filter(item => item.category === selectedCategory);

  const filteredByPrice = filteredByCategory.filter(item =>
    item.price >= priceRange[0] && item.price <= priceRange[1]
  );

  const filteredByDistance = maxDistance === 'all'
    ? filteredByPrice
    : filteredByPrice.filter(item => item.distance && item.distance <= maxDistance);

  const filteredBySearch = searchQuery
    ? filteredByDistance.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : filteredByDistance;

  const filteredByFavorites = showFavorites
    ? filteredBySearch.filter(item => item.isFavorite)
    : filteredBySearch;

  // Sort items
  const sortedItems = useMemo(() => {
    const items = [...filteredByFavorites];
    switch (sortBy) {
      case 'distance':
        return items.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      case 'price-low':
        return items.sort((a, b) => a.price - b.price);
      case 'price-high':
        return items.sort((a, b) => b.price - a.price);
      case 'name':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return items;
    }
  }, [filteredByFavorites, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(filteredItems.map(item => item.category))];
    return ['all', ...cats];
  }, [filteredItems]);

  // User icon
  const userIcon = useMemo(() => L.divIcon({
    className: 'user-marker-container',
    html: `
      <div class="user-ripple"></div>
      <div class="user-pulse"></div>
      <div style="width: 60px; height: 60px; border-radius: 50%; border: 4px solid white; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 0 30px rgba(102,126,234,0.6); position: relative; z-index: 2; display: flex; align-items: center; justify-content: center;">
        ${userProfileImg ? `<img src="${userProfileImg}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="color: white; font-size: 24px;">👤</span>`}
      </div>`,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  }), [userProfileImg]);

  // Get route between user and item
  const getRoute = useCallback(async (itemLat, itemLng) => {
    if (!userCoords) return;

    // Using OSRM for routing (free, no API key needed)
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userCoords[1]},${userCoords[0]};${itemLng},${itemLat}?overview=full&geometries=geojson`
    );
    const data = await response.json();

    if (data.routes && data.routes[0]) {
      const route = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setSelectedRoute(route);
      setFocusCoords([itemLat, itemLng]);
    }
  }, [userCoords]);

  // Handle item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setFocusCoords([item.lat, item.lng]);
  };

  // Toggle favorite
  const toggleFavorite = (item, e) => {
    e.stopPropagation();
    // Here you would typically make an API call
    console.log('Toggle favorite:', item._id);
  };

  // Share item
  const shareItem = async (item, e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} for ৳${item.price}/${item.priceType}`,
          url: window.location.href + `/item/${item._id}`
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  // ============ RENDER ============
  return (
    <div className="relative bg-slate-100 rounded-[3rem] shadow-2xl overflow-hidden">
      {/* Inject Custom Styles */}
      <style>{customStyles}</style>

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="flex items-center">
            <div className="px-4 py-3 text-slate-400">
              <FaSearch size={14} />
            </div>
            <input
              type="text"
              placeholder="Search items or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-4 rounded-2xl shadow-xl border border-white/50 transition-all ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white/95 backdrop-blur-xl text-slate-600 hover:bg-slate-100'}`}
        >
          <FaSlidersH size={16} />
        </button>

        {/* Map Style Toggle */}
        <button
          onClick={() => {
            const styles = Object.keys(MAP_STYLES);
            const currentIndex = styles.indexOf(mapStyle);
            const nextStyle = styles[(currentIndex + 1) % styles.length];
            setMapStyle(nextStyle);
          }}
          className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 text-slate-600 hover:bg-slate-100 transition-all"
          title="Change map style"
        >
          <FaLayerGroup size={16} />
        </button>

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 text-slate-600 hover:bg-slate-100 transition-all"
          title="Toggle view"
        >
          {viewMode === 'map' ? <FaThLarge size={16} /> : <FaMapMarkedAlt size={16} />}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-20 left-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
            {sortedItems.length} Items Found
          </span>
          {locationAccuracy && (
            <span className="text-[9px] font-bold text-slate-400">
              (±{Math.round(locationAccuracy)}m)
            </span>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-32 left-4 right-4 z-[1000] filter-panel bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Filters</h3>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 5000]);
                setMaxDistance(10);
                setSearchQuery('');
              }}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Distance Filter */}
          <div className="mb-5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Max Distance: {maxDistance === 'all' ? 'Any' : `${maxDistance}km`}
            </label>
            <div className="flex gap-2 flex-wrap">
              {['1', '5', '10', '20', 'all'].map(dist => (
                <button
                  key={dist}
                  onClick={() => setMaxDistance(dist === 'all' ? 'all' : parseInt(dist))}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${maxDistance === (dist === 'all' ? 'all' : parseInt(dist))
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {dist === 'all' ? 'Any' : `${dist}km`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="distance">Distance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`w-full py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${showFavorites
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <FaStar /> {showFavorites ? 'Show All' : 'Show Favorites Only'}
          </button>
        </div>
      )}

      {/* List View Overlay */}
      {viewMode === 'list' && (
        <div className="absolute top-40 left-4 right-4 bottom-8 z-[999] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {sortedItems.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item)}
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 hover:scale-[1.02] transition-all cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt={item.title}
                    />
                    <button
                      onClick={(e) => toggleFavorite(item, e)}
                      className="absolute top-1 right-1 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <FaStar size={12} className={item.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-1 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 font-black text-lg">
                        ৳{item.price}<span className="text-[9px] text-slate-400">/{item.priceType}</span>
                      </span>
                      {item.distance && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <FaMapMarkedAlt size={8} />
                          {formatDistance(item.distance)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className={`relative transition-all duration-500 ${viewMode === 'list' ? 'opacity-20 blur-sm pointer-events-none' : ''} h-[750px] bg-slate-50`}>
        <MapContainer
          center={userCoords || [23.8103, 90.4125]}
          zoom={13}
          zoomControl={false}
          style={{ height: '100%', width: '100%', borderRadius: '3rem' }}
        >
          <TileLayer
            url={MAP_STYLES[mapStyle].url}
            attribution={MAP_STYLES[mapStyle].attribution}
          />

          <MapController
            userCoords={userCoords}
            focusCoords={focusCoords}
            selectedRoute={selectedRoute}
            onClearRoute={() => setSelectedRoute(null)}
          />

          {/* User Location */}
          {userCoords && (
            <>
              <Marker position={userCoords} icon={userIcon}>
                <Popup offset={[0, -30]}>
                  <div className="text-center p-2">
                    <p className="font-black text-[11px] uppercase text-slate-800 mb-1">You are here</p>
                    <p className="text-[9px] text-slate-500">
                      {userCoords[0].toFixed(4)}, {userCoords[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
              {/* Accuracy Circle */}
              {locationAccuracy && (
                <Circle
                  center={userCoords}
                  radius={locationAccuracy}
                  pathOptions={{
                    color: 'rgba(102,126,234,0.3)',
                    fillColor: 'rgba(102,126,234,0.1)',
                    fillOpacity: 0.5
                  }}
                />
              )}
            </>
          )}

          {/* Route Line */}
          {selectedRoute && userCoords && (
            <Polyline
              positions={[userCoords, ...selectedRoute]}
              pathOptions={{
                color: '#667eea',
                weight: 5,
                opacity: 0.8,
                className: 'route-line'
              }}
            />
          )}

          {/* Item Markers */}
          {sortedItems.map((item) => {
            if (typeof item.lat === 'number' && typeof item.lng === 'number') {
              const itemTagIcon = L.divIcon({
                className: 'item-tag-marker',
                html: `
                  <div class="map-item-tag" style="animation-delay: ${item.distance ? Math.min(item.distance * 0.1, 2) : 0}s;">
                    <span class="tag-price">৳${item.price}</span>
                    <span class="tag-name">${item.title}</span>
                  </div>
                `,
                iconSize: [100, 40],
                iconAnchor: [50, 20]
              });

              return (
                <Marker
                  key={item._id}
                  position={[item.lat, item.lng]}
                  icon={itemTagIcon}
                  eventHandlers={{ click: () => handleItemClick(item) }}
                >
                  <Popup
                    className="dharlink-popup"
                    closeButton={false}
                    offset={[0, -30]}
                  >
                    <div className="w-72 rounded-3xl overflow-hidden bg-white shadow-2xl">
                      <div className="relative h-36">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={(e) => toggleFavorite(item, e)}
                            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                          >
                            <FaStar size={12} className={item.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'} />
                          </button>
                          <button
                            onClick={(e) => shareItem(item, e)}
                            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                          >
                            <FaShareAlt size={12} className="text-slate-600" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-black text-lg leading-tight mb-1">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-white/80 text-[10px] uppercase tracking-tighter">{item.category}</p>
                            {item.distance && (
                              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                                {formatDistance(item.distance)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-indigo-600 font-black text-xl">
                            ৳{item.price}<span className="text-[11px] text-slate-400">/{item.priceType}</span>
                          </span>
                          {item.address && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase max-w-[150px] truncate">
                              <FaMapMarkedAlt size={9} />
                              {item.address.split(',')[0] || "Area"}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Link
                            to={`/item/${item._id}`}
                            className="bg-indigo-600 text-white text-[11px] font-black uppercase py-3.5 rounded-xl text-center hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                          >
                            <span>Details</span>
                            <FaArrowRight size={10} />
                          </Link>
                          <button
                            onClick={() => getRoute(item.lat, item.lng)}
                            className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase py-3.5 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                          >
                            <FaDirections /> Route
                          </button>
                        </div>

                        {item.distance && item.distance <= 2 && (
                          <button
                            onClick={() => getRoute(item.lat, item.lng)}
                            className="w-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-200 transition-all mb-2"
                          >
                            <FaWalking /> Walk there ({formatDistance(item.distance)})
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default ItemMapView;
