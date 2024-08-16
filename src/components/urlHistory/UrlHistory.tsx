'use client';

import React, { useEffect, useState } from 'react';
import { useUrlStore } from '@/stores/useUrlStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllUrls } from '@/actions/getUrls';
import { formatDate } from '@/utils/helpers';

const URLHistory: React.FC = () => {
    const { urls, setUrls, setLoading, setError, loading } = useUrlStore();
    // Create a BroadcastChannel instance
    const channel = new BroadcastChannel('update-history');

    // Listen for messages
    channel.onmessage = () => {
        loadUrls();
        channel.close();
    };
    // Fetch URLs on component mount
    useEffect(() => {
        loadUrls();
    }, []);

    /**
     * Fetches all URLs from the server and updates the state.
     */
    const loadUrls = async () => {
        setLoading(true); // Set loading to true
        try {
            const fetchedUrls = await fetchAllUrls(); // Fetch URLs using the action
            setUrls(fetchedUrls); // Update the state with fetched URLs
        } catch (error) {
            setError((error as Error).message); // Set error if something goes wrong
            toast.error(`Error: ${(error as Error).message}`); // Show error message as a toast
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    /**
     * Copies the given text to the clipboard and displays a success toast notification.
     * 
     * @param {string} text - The text to copy to the clipboard.
     */
    const copyToClipboard = (text: string) => {
        const fullShortUrl = `${window.location.origin}/${text}`;
        navigator.clipboard.writeText(fullShortUrl);
        toast.success('URL copied to clipboard!');
    };

    if (loading) {
        return <p>Loading...</p>;
    } else if (urls.length === 0) {
        return <p>No URL history available.</p>;
    }

    // console.log('from urlHistory', urls)

    return (
        <div className="url-history">
            <h2>URL History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Original URL</th>
                        <th>Shortened URL</th>
                        <th>Updated At</th>
                        <th>Usage Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {urls.map(({ originalUrl, shortenUrl, updatedAt, usageCount }, index) => (
                        <tr key={index}>
                            <td>
                                <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="url-link">
                                    {originalUrl}
                                </a>
                            </td>
                            <td>
                                <a href={`${window.location.origin}/${shortenUrl}`} target="_blank" rel="noopener noreferrer" className="url-link">
                                    {`${window.location.origin}/${shortenUrl}`}
                                </a>
                            </td>
                            <td>{formatDate(new Date(updatedAt))}</td>
                            <td>{usageCount}</td>
                            <td>
                                <button onClick={() => copyToClipboard(shortenUrl)}>Copy</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ToastContainer />
        </div>
    );
};

export default URLHistory;
