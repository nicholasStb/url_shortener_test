import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InputFormProps {
    onSubmit: (url: string) => void;
}

/**
 * InputForm component for submitting URLs.
 * 
 * @param {InputFormProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered InputForm component.
 */
const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState<string>('');

    /**
     * Handles the change event for the input field.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
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

        // Ensure the URL starts with http://, https://, or ftp://
        let formattedUrl = /^(https?|ftp):\/\//i.test(url.trim()) ? url.trim() : `http://${url.trim()}`;

        try {
            // Use the URL constructor to check the URL format
            new URL(formattedUrl);
        } catch (_) {
            toast.error('Invalid URL format');
            return;
        }
        // Call the onSubmit prop with the formatted URL
        onSubmit(formattedUrl);
        setUrl('');
    };

    return (
        <>
            <form className="input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="url-input"
                    value={url}
                    onChange={handleChange}
                    placeholder="Enter URL"
                />
                <button type="submit" className="submit-button">
                    Shorten
                </button>
            </form>
        </>
    );
};

export default InputForm;