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
        json: (data: any) => mockJson(data),
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

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ statusCode: 200, data: mockUrls });
    });

    it('should fetch a specific shortened URL', async () => {
        const req = {
            url: 'http://localhost/api/urls?originalUrl=https://example.com',
        } as Partial<NextRequest> as NextRequest;
        const mockUrl = { id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1', createdAt: new Date(), updatedAt: new Date() };

        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(mockUrl);

        const response = await GET(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ statusCode: 200, data: mockUrl });
    });

    it('should return 404 if URL is not found', async () => {
        const req = {
            url: 'http://localhost/api/urls?originalUrl=https://notfound.com',
        } as Partial<NextRequest> as NextRequest;

        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await GET(req);

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({
            statusCode: 404,
            errorMessage: 'URL not found',
            errorDetail: 'The requested URL was not found in the database.'
        });
    });

    it('should handle internal server errors', async () => {
        const req = {
            url: 'http://localhost/api/urls',
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findMany as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const response = await GET(req);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.'
        });
    });
});

describe('POST handler', () => {
    it('should return 400 for invalid URL', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: '' }),
        } as Partial<NextRequest> as NextRequest;

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            statusCode: 400,
            errorMessage: 'Invalid URL or URL is too short',
            errorDetail: 'The URL provided is either empty or does not meet the minimum length requirement of 5 characters.'
        });
    });

    it('should handle existing shortened URL', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://example.com' }),
        } as Partial<NextRequest> as NextRequest;
        const mockUrl = { id: 1, originalUrl: 'https://example.com', shortenUrl: 'short1' };

        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(mockUrl);

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            statusCode: 200,
            data: 'Already Exists',
            shortenUrl: 'short1'
        });
    });

    it('should create a new shortened URL', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://newurl.com' }),
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findUnique as jest.Mock).mockResolvedValue(null);

        const mockUrl = { id: 1, originalUrl: 'https://newurl.com', shortenUrl: 'randomString' };
        (prisma.urls.create as jest.Mock).mockResolvedValue(mockUrl);

        const response = await POST(req);

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual({
            statusCode: 201,
            data: mockUrl
        });
    });

    it('should handle internal server errors', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ originalUrl: 'https://example.com' }),
        } as Partial<NextRequest> as NextRequest;
        (prisma.urls.findUnique as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const response = await POST(req);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.'
        });
    });
});
