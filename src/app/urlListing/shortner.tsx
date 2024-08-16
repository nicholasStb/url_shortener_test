'use client';

import React, { useEffect, useState } from 'react';
import InputForm from '../components/inputForm';
import ShortenedUrl from '../components/urlShortner';
import URLHistory from '../components/urlHistory';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUrlStore } from '@/stores/useUrlStore';

const Shortener: React.FC = () => {
    const { urls, setUrls, setLoading, setError } = useUrlStore();
    const [shortUrl, setShortUrl] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    // Create a BroadcastChannel instance
    const channel = new BroadcastChannel('update-history');

    // Listen for messages
    channel.onmessage = () => {
        fetchAllUrls();
        channel.close();
    };
    // Fetch URLs on component mount
    useEffect(() => {
        fetchAllUrls();
    }, []);

    /**
     * Fetches all URLs from the server and updates the state.
     */
    const fetchAllUrls = async () => {
        setLoading(true);
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
     * Handles form submission, sends the original URL and custom short name (if any) to the server,
     * receives the shortened URL, and updates the state.
     * 
     * @param {string} url - The original URL to be shortened.
     * @param {string} customShortName - The custom short name for the URL (optional).
     */
    const handleSubmit = async (url: string, customShortName?: string) => {
        try {
            const response = await fetch('/api/urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl: url, customShortName }), // Pass the customShortName
            });

            const data = await response.json();
            if (data.errorMessage) {
                const fullShortUrl = `${window.location.origin}/${data.shortenUrl}`;
                setShortUrl(fullShortUrl);
                navigator.clipboard.writeText(fullShortUrl);
                toast.error(data.errorMessage);
                return;
            }
            const fullShortUrl = `${window.location.origin}/${data.data.shortenUrl}`;
            setShortUrl(fullShortUrl);
            fetchAllUrls();
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
            setShortUrl('');
        }, 3000);
    };

    return (
        <div className="shortener-container">
            <h1>URL Shortener</h1>

            <InputForm onSubmit={handleSubmit} />  {/* The InputForm will call handleSubmit with customShortName */}

            {shortUrl && <ShortenedUrl url={shortUrl} onCopy={handleCopy} />}

            {copied && <p className="copy-message">URL copied to clipboard!</p>}

            <URLHistory />

            <ToastContainer />
        </div>
    );
};

export default Shortener;
