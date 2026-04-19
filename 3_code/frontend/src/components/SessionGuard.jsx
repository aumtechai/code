import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 Minutes

const SessionGuard = ({ children }) => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload(); // Force refresh to clear app state across tabs
    };

    // 1. CROSS-TAB SYNCHRONIZATION
    useEffect(() => {
        const syncSession = (e) => {
            if (e.key === 'token') {
                if (!e.newValue) {
                    // Token removed in another tab
                    logout();
                } else if (e.newValue && window.location.pathname === '/login') {
                    // Token added in another tab while we are on login page
                    navigate('/dashboard');
                }
            }
        };

        window.addEventListener('storage', syncSession);
        return () => window.removeEventListener('storage', syncSession);
    }, [navigate]);

    // 2. 15-MINUTE INACTIVITY AUTO-LOGOUT
    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        // Only track idle if we are logged in
        if (localStorage.getItem('token')) {
            timeoutRef.current = setTimeout(() => {
                console.log("Session expired due to inactivity.");
                logout();
            }, IDLE_TIMEOUT);
        }
    };

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer(); // Start timer on mount

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return <>{children}</>;
};

export default SessionGuard;
