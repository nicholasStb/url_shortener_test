// src/app/components/urlRedirection.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import URLRedirection from './urlRedirection';

// Mock the fetch API globally
global.fetch = jest.fn();

describe('URLRedirection Component', () => {
    let originalLocation: Location;

    beforeAll(() => {
        // Save the original window.location
        originalLocation = global.location;

        // Create a mock location object
        const mockLocation = {
            ...originalLocation,
            replace: jest.fn(),
        };

        // Replace global location with mock location
        Object.defineProperty(global, 'location', {
            value: mockLocation,
            writable: true,
        });
    });

    afterAll(() => {
        // Restore the original window.location
        Object.defineProperty(global, 'location', {
            value: originalLocation,
            writable: true,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display loading state initially', () => {
        render(<URLRedirection shortUrl="shortUrlTest" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to the original URL on successful fetch', async () => {
        // Mock the fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: 'https://example.com' }),
        });

        render(<URLRedirection shortUrl="shortUrlTest" />);

        // Wait for the original URL to be set and check the redirection
        await waitFor(() => expect((global.location as any).replace).toHaveBeenCalledWith('https://example.com'));
    });

    it('should display error message if fetch fails', async () => {
        // Mock the fetch response to simulate an error
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({}),
        });

        render(<URLRedirection shortUrl="shortUrlTest" />);

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('URL not found')).toBeInTheDocument());
    });

    it('should display error message if fetch throws an exception', async () => {
        // Mock the fetch response to throw an error
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<URLRedirection shortUrl="shortUrlTest" />);

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    });
});
