import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import URLRedirection from './UrlRedirection';
import { postRedirectionUrl } from '../../actions/postRedirectionUrl';

// Mock the postRedirectionUrl function
jest.mock('../../actions/postRedirectionUrl');

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

    it('should display loading state initially', async () => {
        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to the original URL on successful fetch', async () => {
        // Mock the postRedirectionUrl response
        (postRedirectionUrl as jest.Mock).mockResolvedValueOnce({
            originalUrl: 'https://example.com',
        });

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the original URL to be set and check the redirection
        await waitFor(() => expect(window.location.replace).toHaveBeenCalledWith('https://example.com'));
    });

    it('should display error message if URL not found', async () => {
        // Mock the postRedirectionUrl response to simulate a not found error
        (postRedirectionUrl as jest.Mock).mockResolvedValueOnce({
            originalUrl: null,
            errorMessage: 'URL not found',
        });

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('Error: URL not found')).toBeInTheDocument());
    });

    it('should display error message if fetch throws an exception', async () => {
        // Mock the postRedirectionUrl response to throw an error
        (postRedirectionUrl as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        await act(async () => {
            render(<URLRedirection shortUrl="shortUrlTest" />);
        });

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText('Error: Network error')).toBeInTheDocument());
    });
});