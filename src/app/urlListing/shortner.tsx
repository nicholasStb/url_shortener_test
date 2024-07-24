"use client";

import React, { useState, useEffect } from 'react';
import InputForm from '../components/inputForm';
import ShortenedUrl from '../components/urlShortner';
import URLHistory from '../components/urlHistory';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Url } from '@/models/Url';

const Shortener: React.FC = () => {
    const [shortUrl, setShortUrl] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [urls, setUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch URLs on component mount
    useEffect(() => {
        fetchAllUrls();
    }, []);

    /**
     * Fetches all URLs from the server and updates the state.
     */
    const fetchAllUrls = async () => {
        try {
            const response = await fetch('/api/urls');
            if (!response.ok) {
                throw new Error('Failed to fetch URLs');
            }
            const data = await response.json();
            // Reverse the order of URLs
            const reversedUrls = (data.data || []).reverse();
            setUrls(reversedUrls);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles form submission, sends the original URL to the server,
     * receives the shortened URL, and updates the state.
     * 
     * @param {string} url - The original URL to be shortened.
     */
    const handleSubmit = async (url: string) => {
        try {
            const response = await fetch('/api/urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl: url }),
            });

            const data = await response.json();

            // Check if URL already exists
            if (data.data === 'Already Exists') {
                const fullShortUrl = `${window.location.origin}/${data.shortenUrl}`;
                setShortUrl(fullShortUrl);
                navigator.clipboard.writeText(fullShortUrl);
                toast.error('URL already exists and copied to clipboard');
                return; // Exit early to prevent further execution
            } else {
                // Set the shortened URL from server response
                const fullShortUrl = `${window.location.origin}/${data.data.shortenUrl}`;
                setShortUrl(fullShortUrl);
            }

            // Refresh URL history after successful submission
            await fetchAllUrls();

        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to shorten URL');
        }
    };

    /**
     * Handles the copy action, sets the copied state to true,
     * and resets it after 3 seconds.
     */
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShortUrl(''); // Hide the shortened URL
        }, 3000);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="shortener-container">
            <h1>URL Shortener</h1>

            <InputForm onSubmit={handleSubmit} />

            {shortUrl && <ShortenedUrl url={shortUrl} onCopy={handleCopy} />}

            {copied && <p className="copy-message">URL copied to clipboard!</p>}

            <URLHistory urls={urls} /> {/* Pass the URL history data as a prop */}

            <ToastContainer />
        </div>
    );
};

export default Shortener;