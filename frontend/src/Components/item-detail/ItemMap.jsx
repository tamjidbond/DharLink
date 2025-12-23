import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

const ItemMap = ({ itemLat, itemLng, itemTitle }) => {
    const mapCenter = [itemLat, itemLng];

    // Official Google Maps URL format for directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${itemLat},${itemLng}`;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest">
                    <FaMapMarkerAlt className="text-indigo-600" /> Pickup Area
                </h3>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-100"
                >
                    <FaDirections /> Get Directions
                </a>
            </div>
            <div className="h-80 w-full rounded-3xl overflow-hidden border border-slate-100 z-0">
                <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={mapCenter}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-slate-800">{itemTitle}</p>
                                <p className="text-[10px] text-slate-400">Pickup Location</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default ItemMap;