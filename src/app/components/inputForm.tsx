import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InputFormProps {
    onSubmit: (url: string, customShortName?: string) => void;
}

/**
 * InputForm component for submitting URLs.
 * 
 * @param {InputFormProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered InputForm component.
 */
const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState<string>('');
    const [customShortName, setCustomShortName] = useState<string>('');

    /**
     * Handles the change event for the URL input field.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    /**
     * Handles the change event for the custom short name input field.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleShortNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomShortName(e.target.value);
    };

    /**
     * Validates the URL format using regex.
     * 
     * @param {string} url - The URL to validate.
     * @returns {boolean} - Whether the URL is valid.
     */
    const isValidUrl = (url: string): boolean => {
        const urlRegex = /^(https?|ftp):\/\/([^\s$.?#].[^\s]*)$/i;
        return urlRegex.test(url);
    };

    /**
     * Checks for potential SQL Injection patterns in the URL.
     * 
     * @param {string} input - The URL to check.
     * @returns {boolean} - Whether the input contains suspicious patterns.
     */
    const containsSqlInjection = (input: string): boolean => {
        const sqlInjectionPattern = /('|"|;|--|\/\*|\*\/|DROP|SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|EXEC|UNION|DECLARE)/i;
        return sqlInjectionPattern.test(input);
    };

    /**
     * Handles the form submission.
     * 
     * @param {FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!url) {
            toast.error('Please enter a URL');
            return;
        }

        if (containsSqlInjection(url)) {
            toast.error('Invalid input: potential SQL injection detected');
            return;
        }

        // Ensure the URL starts with http://, https://, or ftp://
        const formattedUrl = /^(https?|ftp):\/\//i.test(url.trim()) ? url.trim() : `http://${url.trim()}`;

        if (!isValidUrl(formattedUrl)) {
            toast.error('Invalid URL format');
            return;
        }

        if (containsSqlInjection(customShortName)) {
            toast.error('Invalid input: potential SQL injection detected');
            return;
        }

        // Call the onSubmit prop with the formatted URL and optional custom short name
        onSubmit(formattedUrl, customShortName.trim() || undefined);
        setUrl('');
        setCustomShortName('');
    };

    return (
        <>
            <form className="input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="url-input"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter URL"
                />
                <input
                    type="text"
                    className="url-input"
                    value={customShortName}
                    onChange={handleShortNameChange}
                    placeholder="Enter custom short name (optional)"
                />
                <button type="submit" className="submit-button">
                    Shorten
                </button>
            </form>
        </>
    );
};

export default InputForm;
