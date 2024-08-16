
export const fetchAllUrls = async () => {
    try {
        const response = await fetch('/api/urls');
        if (!response.ok) {
            throw new Error('Failed to fetch URLs');
        }
        const data = await response.json();
        return (data.data || []).reverse(); // Reverse the order of URLs
    } catch (error) {
        throw new Error((error as Error).message);
    }
};