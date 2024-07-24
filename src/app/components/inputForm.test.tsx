import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputForm from './inputForm';
import { ToastContainer } from 'react-toastify';

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

    test('renders input and button', () => {
        expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
    });

    test('displays error toast when URL is empty', () => {
        const button = screen.getByRole('button', { name: /shorten/i });
        fireEvent.click(button);

        expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
    });

    test('displays error toast for invalid URL format', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByRole('button', { name: /shorten/i });

        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        expect(screen.getByText('Invalid URL format')).toBeInTheDocument();
    });

    test('calls onSubmit with formatted URL', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByRole('button', { name: /shorten/i });

        fireEvent.change(input, { target: { value: 'example.com' } });
        fireEvent.click(button);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith('http://example.com');
    });

    test('clears input after submit', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByRole('button', { name: /shorten/i });

        fireEvent.change(input, { target: { value: 'http://example.com' } });
        fireEvent.click(button);

        expect(input).toHaveValue('');
    });

    test('does not call onSubmit when URL is empty', () => {
        const button = screen.getByRole('button', { name: /shorten/i });
        fireEvent.click(button);

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('does not call onSubmit for invalid URL format', () => {
        const input = screen.getByPlaceholderText('Enter URL');
        const button = screen.getByRole('button', { name: /shorten/i });

        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
});
