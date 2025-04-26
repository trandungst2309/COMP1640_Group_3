import axios from 'axios';
import { useEffect } from 'react';

const TrackPageView = ({ page }) => {
    const token = localStorage.getItem("token");
    useEffect(() => {
        axios.post(
            'http://127.0.0.1:8001/api/track-page-view',
            {
                page,
                browser: navigator.userAgent,
                user_id: JSON.parse(localStorage.getItem('user'))?.id || null,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        ).catch(error => console.error('Error tracking page view:', error));
    }, [page, token]);
    return null;
};

export default TrackPageView;
