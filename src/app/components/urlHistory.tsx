'use client';

import React from 'react';
import { useUrlStore } from '@/stores/useUrlStore';
import { toast } from 'react-toastify';

const URLHistory: React.FC = () => {
    const { urls } = useUrlStore();

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
        </div>
    );
};

export default URLHistory;
