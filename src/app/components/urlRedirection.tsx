'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface URLRedirectionProps {
    shortUrl: string;
}

/**
 * URLRedirection component handles fetching the original URL from the server
 * based on the provided short URL and redirects the user to the original URL.
 * 
 * @param {URLRedirectionProps} props - The props for the component, containing the short URL.
 * @returns {JSX.Element | null} - The rendered URLRedirection component or null if redirected.
 */
const URLRedirection: React.FC<URLRedirectionProps> = ({ shortUrl }) => {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * Fetches the original URL from the server based on the short URL.
         */
        const fetchOriginalUrl = async () => {
            try {
                const response = await fetch(`/api/urls/rerouting?shortUrl=${shortUrl}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch the original URL');
                }
                const data = await response.json();
                if (data.data) {
                    setOriginalUrl(data.data);
                } else {
                    setError('URL not found');
                }
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchOriginalUrl();
    }, [shortUrl]);

    useEffect(() => {
        console.log("originalURL!!!", originalUrl);
        if (originalUrl) {
            window.location.replace(originalUrl);
        }
    }, [originalUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return null;
};

export default URLRedirection;