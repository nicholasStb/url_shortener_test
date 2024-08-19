/**
 * fetchAllUrls function is responsible for fetching all the shortened URLs from the server.
 * It sends a GET request to the '/api/urls' endpoint and handles the response.
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of URLs fetched from the server.
 * @throws {Error} - Throws an error if the fetch operation fails or the response is not OK.
 */
export const fetchAllUrls = async () => {
    try {
        // Sending a GET request to the '/api/urls' endpoint to retrieve all URLs
        const response = await fetch('/api/urls');

        // Check if the response status is not OK (status code outside the range 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch URLs'); // Throw an error with a descriptive message
        }

        // Parse the JSON response body to get the data
        const data = await response.json();

        // Reverse the order of the URLs in the array (most recent first)
        return (data.data || []).reverse();
    } catch (error) {
        // If an error occurs during the fetch operation or JSON parsing, throw a new error with the message
        throw new Error((error as Error).message);
    }
};
