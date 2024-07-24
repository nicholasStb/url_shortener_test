import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for toBeInTheDocument matcher
import ShortenedUrl from './urlShortner';

// Mocking the clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe('ShortenedUrl Component', () => {
    const url = 'https://short.url/test';
    const onCopy = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display the shortened URL', () => {
        render(<ShortenedUrl url={url} onCopy={onCopy} />);

        expect(screen.getByText('Shortened URL:')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: url })).toHaveAttribute('href', url);
    });

    it('should copy the URL to clipboard and trigger onCopy callback when "Copy" button is clicked', () => {
        render(<ShortenedUrl url={url} onCopy={onCopy} />);

        const copyButton = screen.getByRole('button', { name: /Copy/i });
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(url);
        expect(onCopy).toHaveBeenCalled();
    });
});
