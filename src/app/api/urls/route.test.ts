import { GET, POST } from './route';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@prisma/client', () => {
    const urls = {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
    };
    return {
        PrismaClient: jest.fn(() => ({ urls })),
    };
});

const mockJson = jest.fn().mockImplementation((data) => ({
    status: 200,
    json: () => Promise.resolve(data),
}));

jest.mock('next/server', () => ({
    ...jest.requireActual('next/server'),
    NextResponse: {
        json: (data: any, options?: any) => mockJson(data, options),
    },
}));

let prisma: PrismaClient;

beforeEach(() => {
    prisma = new PrismaClient();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('GET handler', () => {
    it('should fetch all URLs', async () => {
        const mockUrls = [
            { id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1', createdAt: new Date(), updatedAt: new Date() }
        ];

        (prisma.urls.findMany as jest.Mock).mockResolvedValue(mockUrls);

        const req = {
            url: 'http://localhost/api/urls',
        } as Partial<NextRequest> as NextRequest;
        const response = await GET(req);

        expect(mockJson).toHaveBeenCalledWith({ statusCode: 200, data: mockUrls });
    });

    it('should return 500 on internal server error', async () => {
        const req = {
            url: 'http://localhost/api/urls',
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findMany as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const response = await GET(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.'
        }, { status: 500 });
    });
});

describe('POST handler', () => {
    it('should return 400 for invalid URL', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: '' }),
        } as Partial<NextRequest> as NextRequest;

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            errorMessage: 'Invalid URL or URL is too short',
            errorDetail: 'The URL provided is either empty or does not meet the minimum length requirement of 5 characters.'
        }, { status: 400 });
    });

    it('should return 400 for existing custom short name', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://example.com', customShortName: 'short1' }),
        } as Partial<NextRequest> as NextRequest;

        const mockUrl = { id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1' };
        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(mockUrl);

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            errorMessage: 'Custom short name already exists',
            errorDetail: 'The custom short name provided is already in use. Please choose another one or leave it empty to auto-generate a name.'
        }, { status: 400 });
    });

    it('should create a new shortened URL', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://newurl.com' }),
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(null);

        const mockUrl = { id: 1, originalUrl: 'https://newurl.com', shortenUrl: 'randomString' };
        (prisma.urls.create as jest.Mock).mockResolvedValue(mockUrl);

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 200,
            data: mockUrl
        });
    });

    it('should return 500 on internal server error', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://example.com' }),
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findUnique as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.'
        }, { status: 500 });
    });
});
