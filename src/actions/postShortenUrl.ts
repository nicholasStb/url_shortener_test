/**
 * postShortenUrl function sends a POST request to the server to shorten a given URL.
 * Optionally, a custom short name can be provided to personalize the shortened URL.
 * 
 * @param {string} url - The original URL that needs to be shortened.
 * @param {string} [customShortName] - An optional custom short name for the shortened URL.
 * @returns {Promise<{ shortenedUrl?: string; errorMessage?: string }>} - A promise that resolves to an object containing either the shortened URL or an error message.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export const postShortenUrl = async (url: string, customShortName?: string): Promise<{ shortenedUrl?: string; errorMessage?: string }> => {
    try {
        // Sending a POST request to the '/api/urls' endpoint to create a shortened URL
        const response = await fetch('/api/urls', {
            method: 'POST', // Specify the HTTP method as POST
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            // Pass the original URL and optional custom short name in the request body as a JSON string
            body: JSON.stringify({ originalUrl: url, customShortName }),
        });

        // Parse the JSON response body to get the data
        const data = await response.json();

        // If the server returns an error message, return it to the caller
        if (data.errorMessage) {
            return { errorMessage: data.errorMessage };
        }

        // If successful, return the shortened URL prefixed with the current domain
        return { shortenedUrl: `${window.location.origin}/${data.data.shortenUrl}` };
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error:', error);
        // Rethrow the error to inform the caller that the operation failed
        throw new Error('Failed to shorten URL');
    }
};
