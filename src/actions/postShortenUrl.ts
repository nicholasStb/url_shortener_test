
export const postShortenUrl = async (url: string, customShortName?: string): Promise<{ shortenedUrl?: string; errorMessage?: string }> => {
    try {
        const response = await fetch('/api/urls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: url, customShortName }), // Pass the customShortName
        });

        const data = await response.json();

        if (data.errorMessage) {
            return { errorMessage: data.errorMessage };
        }
        return { shortenedUrl: `${window.location.origin}/${data.data.shortenUrl}` };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to shorten URL');
    }
};