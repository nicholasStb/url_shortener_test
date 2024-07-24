// src/app/components/urlHistory.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import URLHistory from './urlHistory';
import { Url } from '@/models/Url';
import { ToastContainer } from 'react-toastify';

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    },
    ToastContainer: () => <div />,
}));

describe('URLHistory', () => {
    const mockUrls: Url[] = [
        {
            id: 1,
            originalUrl: 'https://example.com',
            shortenUrl: 'short1',
            createdAt: new Date('2023-07-01T12:00:00Z'),
            updatedAt: new Date('2023-07-01T12:00:00Z'),
        },
        {
            id: 1,
            originalUrl: 'https://example.org',
            shortenUrl: 'short2',
            createdAt: new Date('2023-07-01T12:00:00Z'),
            updatedAt: new Date('2023-07-01T12:00:00Z'),
        },
    ];

    beforeEach(() => {
        render(
            <>
                <URLHistory urls={mockUrls} />
                <ToastContainer />
            </>
        );
    });

    it('renders the URL history table', () => {
        expect(screen.getByText('URL History')).toBeInTheDocument();
        expect(screen.getByText('Original URL')).toBeInTheDocument();
        expect(screen.getByText('Shortened URL')).toBeInTheDocument();
        expect(screen.getByText('Created At')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders URLs in the table', () => {
        mockUrls.forEach(({ originalUrl, shortenUrl }) => {
            expect(screen.getByText(originalUrl)).toBeInTheDocument();
            expect(screen.getByText(`${window.location.origin}/${shortenUrl}`)).toBeInTheDocument();
        });
    });

    it('displays a message when there are no URLs', () => {
        render(<URLHistory urls={[]} />);
        expect(screen.getByText('No URL history available.')).toBeInTheDocument();
    });

    it('copies the shortened URL to clipboard and shows toast notification', () => {
        const copyButton = screen.getAllByText('Copy')[0];
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/short1`);
    });
});
