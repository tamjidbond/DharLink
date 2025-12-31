import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [userCoords, setUserCoords] = useState(null);

    const fetchGlobalData = async () => {
        console.log("DharLink: Fetching fresh data from server...");
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
    }, []);

    // This is the function Lend.jsx calls
    const refreshData = () => {
        fetchGlobalData();
    };

    return (
        <DataContext.Provider value={{ items, categories, loading, userCoords, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) return {}; // Prevents "undefined" crashes
    return context;
};