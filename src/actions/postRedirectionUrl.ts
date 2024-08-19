/**
 * postRedirectionUrl function is responsible for sending a POST request to retrieve the original URL
 * associated with a given short URL. It interacts with the server to find the matching original URL.
 * 
 * @param {string} shortUrl - The shortened URL that needs to be resolved to the original URL.
 * @returns {Promise<{ originalUrl?: string; errorMessage?: string }>} - A promise that resolves to an object containing either the original URL or an error message.
 * @throws {Error} - Throws an error if the fetch operation fails or the server responds with a failure.
 */
export const postRedirectionUrl = async (shortUrl: string): Promise<{ originalUrl?: string; errorMessage?: string }> => {
    try {
        // Sending a POST request to the '/api/urls/rerouting' endpoint to retrieve the original URL
        const response = await fetch('/api/urls/rerouting', {
            method: 'POST', // Specify the HTTP method as POST
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            // Pass the short URL in the request body as a JSON string
            body: JSON.stringify({ shortUrl }),
        });

        // Check if the response status is not OK (status code outside the range 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch the original URL'); // Throw an error with a descriptive message
        }

        // Parse the JSON response body to get the data
        const data = await response.json();

        // If the response contains data, return the original URL
        if (data.data) {
            return { originalUrl: data.data };
        } else {
            // If the data is not found, return an error message
            return { errorMessage: 'URL not found' };
        }
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error:', error);
        // Rethrow the error to inform the caller that the operation failed
        throw new Error('Failed to fetch the original URL');
    }
};
