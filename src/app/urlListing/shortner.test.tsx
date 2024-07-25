import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortener from '@/app/urlListing/shortner';
import { toast, ToastContainer } from 'react-toastify';
import fetchMock from 'jest-fetch-mock';

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div />,
}));

beforeEach(() => {
    fetchMock.resetMocks();
    // Mocking navigator.clipboard
    Object.assign(navigator, {
        clipboard: {
            writeText: jest.fn(),
        },
    });
});

describe('Shortener', () => {
    it('fetches and displays URL history on mount', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ data: [{ id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })
        );

        await act(async () => {
            render(<Shortener />);
        });

        await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/urls'));
        expect(screen.getByText('https://example.com')).toBeInTheDocument();
        expect(screen.getByText(`${window.location.origin}/short1`)).toBeInTheDocument();
    });

    it('displays error toast if URL already exists', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({ data: [{ id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }),
                { status: 200 },
            ],
            [JSON.stringify({ data: 'Already Exists', shortenUrl: 'short1' }), { status: 200 }]
        );

        await act(async () => {
            render(
                <>
                    <Shortener />
                    <ToastContainer />
                </>
            );
        });

        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        fireEvent.change(input, { target: { value: 'https://example.com' } });
        fireEvent.click(button);

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('URL already exists and copied to clipboard'));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/short1`);
    });

    it('displays error toast on fetch failure', async () => {
        fetchMock.mockRejectOnce(new Error('Failed to fetch'));

        await act(async () => {
            render(
                <>
                    <Shortener />
                    <ToastContainer />
                </>
            );
        });

        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        fireEvent.change(input, { target: { value: 'https://example.com' } });
        fireEvent.click(button);

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to shorten URL'));
    });

    it('handles successful URL shortening and updates history', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({ data: [{ id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }),
                { status: 200 },
            ],
            [JSON.stringify({ data: { shortenUrl: 'short2' } }), { status: 200 }]
        );

        await act(async () => {
            render(<Shortener />);
        });

        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        fireEvent.change(input, { target: { value: 'https://example.org' } });
        fireEvent.click(button);

        await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/urls', expect.any(Object)));
        await waitFor(() => expect(screen.getByText('https://example.org')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText(`${window.location.origin}/short2`)).toBeInTheDocument());
    });
});
