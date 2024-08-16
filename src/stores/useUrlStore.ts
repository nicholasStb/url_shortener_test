import { create } from "zustand";
import { Url } from '@/models/Url';

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
