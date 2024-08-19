'use client';

import React, { useEffect, useState } from 'react';
import { postRedirectionUrl } from '../../actions/postRedirectionUrl';
import { UPDATE_HISTORY_KEY } from '../../constants/broadcastChannelKeys';

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
    // State to hold the original URL fetched from the server
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);

    // State to handle the loading state while fetching data
    const [loading, setLoading] = useState(true);

    // State to handle and display errors if the fetch operation fails
    const [error, setError] = useState<string | null>(null);

    // State to manage the countdown timer before redirection
    const [countdown, setCountdown] = useState(5);

    // BroadcastChannel instance used to notify other components or tabs of updates
    const channel = new BroadcastChannel(UPDATE_HISTORY_KEY);

    useEffect(() => {
        /**
         * Function to fetch the original URL from the server based on the provided short URL.
         * It handles setting the appropriate state based on the fetch result.
         */
        const fetchOriginalUrl = async () => {
            try {
                // Call the action to post the redirection URL and get the original URL
                const { originalUrl, errorMessage } = await postRedirectionUrl(shortUrl);

                if (originalUrl) {
                    // If the original URL is fetched successfully, update the state
                    setOriginalUrl(originalUrl);
                } else {
                    // If there's an error message or the URL is not found, set the error state
                    setError(errorMessage || 'URL not found');
                }
            } catch (error) {
                // Catch any errors that occur during the fetch and update the error state
                setError((error as Error).message);
            } finally {
                // Once the fetch is complete, stop the loading state
                setLoading(false);
            }
        };

        // Call the fetch function when the component mounts or when the shortUrl prop changes
        fetchOriginalUrl();

    }, [shortUrl]);

    useEffect(() => {
        if (originalUrl) {
            // Start a countdown when the original URL is available
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        // When countdown reaches 1, clear the interval and perform the redirection
                        clearInterval(countdownInterval);
                        window.location.replace(originalUrl);

                        // Notify other components or tabs about the redirection
                        channel.postMessage({ update: true });
                    }
                    return prev - 1;
                });
            }, 1000); // The interval is set to decrement the countdown every second

            return () => clearInterval(countdownInterval); // Clean up the interval when the component unmounts
        }
    }, [originalUrl]);

    // Render loading state while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error message if an error occurs
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render the countdown timer before redirection occurs
    return (
        <div>
            <p>Redirecting in {countdown} seconds...</p>
        </div>
    );
};

export default URLRedirection;
