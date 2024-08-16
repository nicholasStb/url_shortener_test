'use client';

import React, { useEffect, useState } from 'react';
import InputForm from '../inputForm/InputForm';
import ShortenedUrl from '../urlShortner/UrlShortner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postShortenUrl } from '../../actions/postShortenUrl';


const Shortener: React.FC = () => {
    const [shortUrl, setShortUrl] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    // Create a BroadcastChannel instance
    const channel = new BroadcastChannel('update-history');

    /**
     * Handles form submission, sends the original URL and custom short name (if any) to the server,
     * receives the shortened URL, and updates the state.
     * 
     * @param {string} url - The original URL to be shortened.
     * @param {string} customShortName - The custom short name for the URL (optional).
     */
    const handleSubmit = async (url: string, customShortName?: string) => {
        try {
            const { shortenedUrl, errorMessage } = await postShortenUrl(url, customShortName);

            if (errorMessage) {
                const fullShortUrl = `${window.location.origin}/${shortenedUrl}`;
                setShortUrl(fullShortUrl);
                navigator.clipboard.writeText(fullShortUrl);
                toast.error(errorMessage);
                return;
            }

            setShortUrl(shortenedUrl || '');
            channel.postMessage({ update: true });
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

            <ToastContainer />
        </div>
    );
};

export default Shortener;
