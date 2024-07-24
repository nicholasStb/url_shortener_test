'use client';

import React from 'react';
import { Url } from '@/models/Url';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface URLHistoryProps {
    urls: Url[];
}

/**
 * URLHistory component displays a table of original and shortened URLs along with their creation dates.
 * Provides an option to copy the shortened URL to the clipboard.
 * 
 * @param {URLHistoryProps} props - The props for the component, containing an array of URL objects.
 * @returns {JSX.Element} - The rendered URLHistory component.
 */
const URLHistory: React.FC<URLHistoryProps> = ({ urls }) => {

    /**
     * Formats a date object into a readable string.
     * 
     * @param {Date} date - The date to format.
     * @returns {string} - The formatted date string.
     */
    const formatDate = (date: Date): string => {
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
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

    if (urls.length === 0) {
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
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {urls.map(({ originalUrl, shortenUrl, createdAt }, index) => (
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
                            <td>{formatDate(new Date(createdAt))}</td>
                            <td>
                                <button onClick={() => copyToClipboard(shortenUrl)}>Copy</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default URLHistory;