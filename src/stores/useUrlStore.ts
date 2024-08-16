import { create } from "zustand";

interface Url {
    id: number;
    originalUrl: string;
    shortenUrl: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    usageCount: number;
}

interface UrlStore {
    urls: Url[];
    loading: boolean;
    error: string | null;
    setUrls: (urls: Url[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useUrlStore = create<UrlStore>()((set) => ({
    urls: [],
    loading: false,
    error: null,
    setUrls: (urls) => set({ urls }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
