import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortener from './Shortner';
import { toast, ToastContainer } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div />,
}));

// Mock the postShortenUrl function
import { postShortenUrl } from '../../actions/postShortenUrl';

jest.mock('../../actions/postShortenUrl');

beforeEach(() => {
    // Reset the mock between tests
    jest.clearAllMocks();

    // Mocking navigator.clipboard
    Object.assign(navigator, {
        clipboard: {
            writeText: jest.fn(),
        },
    });
});

describe('Shortener', () => {
    it('displays error toast if URL already exists', async () => {
        const mockShortUrl = 'short1';
        (postShortenUrl as jest.Mock).mockResolvedValueOnce({
            shortenedUrl: mockShortUrl,
            errorMessage: 'URL already exists and copied to clipboard',
        });

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
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/${mockShortUrl}`);
    });

    it('displays error toast on URL shortening failure', async () => {
        (postShortenUrl as jest.Mock).mockRejectedValueOnce(new Error('Failed to shorten URL'));

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

    it('handles successful URL shortening', async () => {
        const mockShortUrl = 'short2';
        (postShortenUrl as jest.Mock).mockResolvedValueOnce({ shortenedUrl: mockShortUrl });

        await act(async () => {
            render(<Shortener />);
        });

        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        fireEvent.change(input, { target: { value: 'https://example.org' } });
        fireEvent.click(button);

        await waitFor(() => expect(postShortenUrl).toHaveBeenCalledWith('https://example.org', undefined));
        await waitFor(() => expect(screen.getByText(`${window.location.origin}/${mockShortUrl}`)).toBeInTheDocument());
    });
});
