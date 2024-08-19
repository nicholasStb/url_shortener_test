import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidUrlRegex, containsSqlInjection, formatUrl } from '../../utils/helpers';

interface InputFormProps {
    onSubmit: (url: string, customShortName?: string) => void; // Props type definition, onSubmit is a function that accepts a URL and an optional custom short name
}

/**
 * InputForm component is responsible for handling user input for URLs and optional custom short names.
 * It performs validation and then triggers the onSubmit function passed as a prop.
 * 
 * @param {InputFormProps} props - The props for the component, including the onSubmit function.
 * @returns {JSX.Element} - The rendered InputForm component.
 */
const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState<string>(''); // State for managing the URL input field
    const [customShortName, setCustomShortName] = useState<string>(''); // State for managing the custom short name input field

    /**
     * Handles the change event for the URL input field.
     * Updates the state with the current value of the input.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered when the URL input field changes.
     */
    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value); // Update the URL state with the new value from the input field
    };

    /**
     * Handles the change event for the custom short name input field.
     * Updates the state with the current value of the input.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered when the custom short name input field changes.
     */
    const handleShortNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomShortName(e.target.value); // Update the customShortName state with the new value from the input field
    };

    /**
     * Handles the form submission.
     * Validates the input, formats the URL, and triggers the onSubmit function if validation passes.
     * 
     * @param {FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior to handle it manually

        // Check if the URL input is empty
        if (!url) {
            toast.error('Please enter a URL'); // Show an error toast notification
            return;
        }

        // Check if the URL contains any potential SQL injection patterns
        if (containsSqlInjection(url)) {
            toast.error('Invalid input: potential SQL injection detected'); // Show an error toast if SQL injection is detected
            return;
        }

        // Ensure the URL is properly formatted to start with http://, https://, or ftp://
        const formattedUrl = formatUrl(url);

        // Validate the formatted URL using a regex pattern
        if (!isValidUrlRegex(formattedUrl)) {
            toast.error('Invalid URL format'); // Show an error toast if the URL format is invalid
            return;
        }

        // Check if the custom short name contains any potential SQL injection patterns
        if (containsSqlInjection(customShortName)) {
            toast.error('Invalid input: potential SQL injection detected'); // Show an error toast if SQL injection is detected
            return;
        }

        // If all validations pass, call the onSubmit prop with the formatted URL and optional custom short name
        onSubmit(formattedUrl, customShortName.trim() || undefined);

        // Reset the input fields after successful submission
        setUrl(''); // Clear the URL input field
        setCustomShortName(''); // Clear the custom short name input field
    };

    return (
        <>
            <form className="input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="url-input"
                    value={url}
                    onChange={handleUrlChange} // Attach the change event handler for the URL input field
                    placeholder="Enter URL" // Placeholder text for the URL input field
                />
                <input
                    type="text"
                    className="url-input"
                    value={customShortName}
                    onChange={handleShortNameChange} // Attach the change event handler for the custom short name input field
                    placeholder="Enter custom short name (optional)" // Placeholder text for the custom short name input field
                />
                <button type="submit" className="submit-button">
                    Shorten {/* The button text for submitting the form */}
                </button>
            </form>
        </>
    );
};

export default InputForm;
