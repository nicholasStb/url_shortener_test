'use client';

import React, { useEffect, useState } from 'react';

interface URLRedirectionProps {
    shortUrl: string;
}

/**
 * URLRedirection component handles fetching the original URL from the server
 * based on the provided short URL and redirects the user to the original URL.
 * It includes a 5-second countdown before the redirection occurs.
 * 
 * @param {URLRedirectionProps} props - The props for the component, containing the short URL.
 * @returns {JSX.Element | null} - The rendered URLRedirection component or null if redirected.
 */
const URLRedirection: React.FC<URLRedirectionProps> = ({ shortUrl }) => {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(5);
    const channel = new BroadcastChannel('update-history');

    useEffect(() => {
        let didCancel = false;

        /**
         * Fetches the original URL from the server based on the short URL.
         */
        const fetchOriginalUrl = async () => {
            try {
                const response = await fetch('/api/urls/rerouting', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shortUrl }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch the original URL');
                }

                const data = await response.json();
                if (!didCancel) {
                    if (data.data) {
                        setOriginalUrl(data.data);
                    } else {
                        setError('URL not found');
                    }
                }
            } catch (error) {
                if (!didCancel) {
                    setError((error as Error).message);
                }
            } finally {
                if (!didCancel) {
                    setLoading(false);
                }
            }
        };

        fetchOriginalUrl();

        return () => {
            didCancel = true;
        };
    }, [shortUrl]);

    useEffect(() => {
        if (originalUrl) {
            // Start the countdown once the original URL is fetched
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(countdownInterval);
                        window.location.replace(originalUrl);
                        channel.postMessage({ update: true });
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval); // Clean up the interval on unmount
        }
    }, [originalUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <p>Redirecting in {countdown} seconds...</p>
        </div>
    );
};

export default URLRedirection;
