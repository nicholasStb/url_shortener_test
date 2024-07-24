import React from 'react';

interface ShortenedUrlProps {
    url: string; // This is expected to be the shortened URL part
    onCopy: () => void; // Callback function to trigger when the URL is copied
}

/**
 * ShortenedUrl component displays the shortened URL and provides a button to copy the URL to the clipboard.
 * 
 * @param {ShortenedUrlProps} props - The props for the component, containing the URL and the onCopy callback.
 * @returns {JSX.Element} - The rendered ShortenedUrl component.
 */
const ShortenedUrl: React.FC<ShortenedUrlProps> = ({ url, onCopy }) => {

    /**
     * Handles the copy action, writes the URL to the clipboard, and triggers the onCopy callback.
     */
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        onCopy(); // Trigger the onCopy callback to update the UI
    };

    return (
        <div className="shortened-url">
            <p>Shortened URL: <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">{url}</a></p>
            <button className="copy-button-shorten" onClick={handleCopy}>
                Copy
            </button>
        </div>
    );
};

export default ShortenedUrl;