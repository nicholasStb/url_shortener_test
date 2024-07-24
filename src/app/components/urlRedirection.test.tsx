import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import URLRedirection from './urlRedirection';

// Mocking the window.location.replace method
const originalLocationReplace = window.location.replace;
beforeAll(() => {
    Object.defineProperty(window, 'location', {
        writable: true,
        value: { replace: jest.fn() },
    });
});
afterAll(() => {
    window.location.replace = originalLocationReplace;
});

describe('URLRedirection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display loading state initially', () => {
        render(<URLRedirection shortUrl="shortUrlTest" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to the original URL on successful fetch', async () => {
        // Mock the fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: 'https://example.com' }),
            }) as Promise<Response>
        );

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the original URL to be set and check the redirection
        await waitFor(() => expect(window.location.replace).toHaveBeenCalledWith('https://example.com'));
    });

    it('should display error message if fetch fails', async () => {
        // Mock the fetch response to simulate an error
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({}),
            }) as Promise<Response>
        );

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('URL not found')).toBeInTheDocument());
    });

    it('should display error message if fetch throws an exception', async () => {
        // Mock the fetch response to throw an error
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    });
});