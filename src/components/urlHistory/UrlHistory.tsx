'use client';

import React, { useEffect, useState } from 'react';
import { useUrlStore } from '@/stores/useUrlStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllUrls } from '@/actions/getUrls';
import { formatDate } from '@/utils/helpers';
import { UPDATE_HISTORY_KEY } from '../../constants/broadcastChannelKeys';

const URLHistory: React.FC = () => {
    const { urls, setUrls, setLoading, setError, loading } = useUrlStore(); // Zustand store to manage URLs, loading, and error states
    const channel = new BroadcastChannel(UPDATE_HISTORY_KEY); // Create a BroadcastChannel instance with a specific key

    /**
     * Sets up a listener for the BroadcastChannel to reload URLs when a message is received.
     * This helps keep the URL history in sync across different tabs or components.
     */
    channel.onmessage = () => {
        loadUrls(); // Reload the URLs when a message is received
        channel.close(); // Close the channel after the message is received to prevent further listening
    };

    // Fetch URLs when the component mounts (i.e., on initial render)
    useEffect(() => {
        loadUrls();
    }, []);

    /**
     * Function to fetch all URLs from the server and update the state accordingly.
     * It sets the loading state, handles errors, and updates the URL list.
     */
    const loadUrls = async () => {
        setLoading(true); // Start by setting loading to true
        try {
            const fetchedUrls = await fetchAllUrls(); // Fetch all URLs from the server
            setUrls(fetchedUrls); // Store the fetched URLs in the state
        } catch (error) {
            setError((error as Error).message); // Handle any errors that occur during the fetch
            toast.error(`Error: ${(error as Error).message}`); // Show an error toast notification
        } finally {
            setLoading(false); // Ensure loading is set to false when done, regardless of success or failure
        }
    };

    /**
     * Function to copy a shortened URL to the clipboard and display a success toast notification.
     * 
     * @param {string} text - The shortened URL text to be copied.
     */
    const copyToClipboard = (text: string) => {
        const fullShortUrl = `${window.location.origin}/${text}`; // Construct the full shortened URL with the domain
        navigator.clipboard.writeText(fullShortUrl); // Write the full shortened URL to the clipboard
        toast.success('URL copied to clipboard!'); // Show a success toast notification
    };

    // If the component is still loading data, display a loading message
    if (loading) {
        return <p>Loading...</p>;
    } else if (urls.length === 0) {
        // If there are no URLs, display a message indicating that the history is empty
        return <p>No URL history available.</p>;
    }

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
                            <td>{formatDate(new Date(updatedAt))}</td> {/* Format the update date using the helper function */}
                            <td>{usageCount}</td> {/* Display the usage count for the shortened URL */}
                            <td>
                                <button onClick={() => copyToClipboard(shortenUrl)}>Copy</button> {/* Button to copy the shortened URL */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ToastContainer /> {/* Container for displaying toast notifications */}
        </div>
    );
};

export default URLHistory;
