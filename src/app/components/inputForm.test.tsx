// src/app/components/inputForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputForm from './inputForm';
import { toast, ToastContainer } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
    ToastContainer: () => <div />,
}));

describe('InputForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        render(
            <>
                <InputForm onSubmit={mockOnSubmit} />
                <ToastContainer />
            </>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('displays error toast for invalid URL format', async () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        // Enter an invalid URL
        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        // Wait for the toast notification to appear
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid URL format'));
    });

    test('does not call onSubmit for invalid URL format', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        // Enter an invalid URL
        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        // onSubmit should not be called
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('calls onSubmit with formatted URL', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByText('Shorten');

        // Enter a valid URL
        fireEvent.change(input, { target: { value: 'http://example.com' } });
        fireEvent.click(button);

        // onSubmit should be called with the formatted URL
        expect(mockOnSubmit).toHaveBeenCalledWith('http://example.com');
    });
});
