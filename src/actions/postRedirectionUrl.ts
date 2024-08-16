
export const postRedirectionUrl = async (shortUrl: string): Promise<{ originalUrl?: string; errorMessage?: string }> => {
    try {
        const response = await fetch('/api/urls/rerouting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shortUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the original URL');
        }

        const data = await response.json();
        if (data.data) {
            return { originalUrl: data.data };
        } else {
            return { errorMessage: 'URL not found' };
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch the original URL');
    }
};