'use client';

import React, { useEffect, useState } from 'react';
import InputForm from '../inputForm/InputForm';
import ShortenedUrl from '../urlShortner/UrlShortner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postShortenUrl } from '../../actions/postShortenUrl';
import { UPDATE_HISTORY_KEY } from '../../constants/broadcastChannelKeys';

/**
 * Shortener component is responsible for handling the URL shortening functionality.
 * It manages the form submission, displays the shortened URL, and handles user interactions
 * such as copying the shortened URL to the clipboard.
 */
const Shortener: React.FC = () => {
    // State to store the shortened URL returned by the server
    const [shortUrl, setShortUrl] = useState<string>('');

    // State to handle the copy action, indicating whether the URL has been copied to the clipboard
    const [copied, setCopied] = useState<boolean>(false);

    // Create a BroadcastChannel instance for communicating updates across components or tabs
    const channel = new BroadcastChannel(UPDATE_HISTORY_KEY);

    /**
     * Handles form submission, sends the original URL and custom short name (if any) to the server,
     * receives the shortened URL, and updates the state.
     * 
     * @param {string} url - The original URL to be shortened.
     * @param {string} customShortName - The custom short name for the URL (optional).
     */
    const handleSubmit = async (url: string, customShortName?: string) => {
        try {
            // Call the action to shorten the URL, passing in the original URL and custom short name if provided
            const { shortenedUrl, errorMessage } = await postShortenUrl(url, customShortName);

            if (errorMessage) {
                // If an error occurs (e.g., custom name already taken), show the error message
                const fullShortUrl = `${window.location.origin}/${shortenedUrl}`;
                setShortUrl(fullShortUrl);

                // Copy the URL to the clipboard
                navigator.clipboard.writeText(fullShortUrl);

                // Show a toast notification with the error message
                toast.error(errorMessage);
                return;
            }

            // If successful, set the shortened URL in the state
            setShortUrl(shortenedUrl || '');

            // Notify other components or tabs of the update using BroadcastChannel
            channel.postMessage({ update: true });
        } catch (error) {
            // Catch any errors during the submission process and show an error toast notification
            console.error('Error:', error);
            toast.error('Failed to shorten URL');
        }
    };

    /**
     * Handles the copy action, sets the copied state to true,
     * and resets it after 3 seconds.
     */
    const handleCopy = () => {
        setCopied(true); // Set the copied state to true when the user clicks the copy button

        // Reset the copied state and clear the shortened URL after 3 seconds
        setTimeout(() => {
            setCopied(false);
            setShortUrl('');
        }, 3000);
    };

    return (
        <div className="shortener-container">
            <h1>URL Shortener</h1>

            {/* The InputForm component is responsible for handling user input and submission.
                It calls handleSubmit with the original URL and an optional custom short name. */}
            <InputForm onSubmit={handleSubmit} />

            {/* If a shortUrl is present, render the ShortenedUrl component,
                which displays the shortened URL and provides a copy button */}
            {shortUrl && <ShortenedUrl url={shortUrl} onCopy={handleCopy} />}

            {/* If the URL has been copied to the clipboard, show a confirmation message */}
            {copied && <p className="copy-message">URL copied to clipboard!</p>}

            {/* ToastContainer handles the display of toast notifications for error or success messages */}
            <ToastContainer />
        </div>
    );
};

export default Shortener;
