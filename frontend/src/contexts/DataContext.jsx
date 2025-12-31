// DataContext.jsx (or wherever your context is)
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [userCoords, setUserCoords] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this trigger

    const fetchGlobalData = async () => {
        console.log("DharLink: Fetching fresh data from server...");
        setLoading(true); // Reset loading when fetching
        try {
            const [itemsRes, categoriesRes] = await Promise.all([
                axios.get('https://dharnow.onrender.com/api/items/all'),
                axios.get('https://dharnow.onrender.com/api/categories')
            ]);

            setItems(itemsRes.data);
            const dbCategoryNames = categoriesRes.data.map(cat => cat.name);
            setCategories(["All", ...dbCategoryNames]);
        } catch (err) {
            console.error("DharLink Global Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserCoords([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error("Location access denied", err)
            );
        }
        fetchGlobalData();
    }, [refreshTrigger]); // Add refreshTrigger as dependency

    // This is the function Lend.jsx calls
    const refreshData = () => {
        // Force a refresh by incrementing the trigger
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <DataContext.Provider value={{ items, categories, loading, userCoords, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

