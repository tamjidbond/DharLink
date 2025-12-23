import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ returnTime }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(returnTime).getTime() - new Date().getTime();
            setIsOverdue(diff <= 0);
            
            const absDiff = Math.abs(diff);
            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((absDiff / 1000 / 60) % 60);
            
            setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m`);
        };

        calculate();
        const timer = setInterval(calculate, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [returnTime]);

    return (
        <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border mt-2 ${
            isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOverdue ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
            {isOverdue ? `OVERDUE BY: ${timeLeft}` : `DUE IN: ${timeLeft}`}
        </div>
    );
};

export default CountdownTimer;