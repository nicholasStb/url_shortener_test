import { POST } from './route';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@prisma/client', () => {
    const urls = {
        update: jest.fn(),
    };
    return {
        PrismaClient: jest.fn(() => ({ urls })),
    };
});

const mockJson = jest.fn().mockImplementation((data, options) => ({
    status: options?.status || 200,
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

describe('POST handler', () => {
    it('should increment usage count and return original URL for a valid shortUrl', async () => {
        const mockUrl = {
            id: 1,
            originalUrl: 'https://example.com',
            shortenUrl: 'short1',
            usageCount: 1,
            updatedAt: new Date(),
        };

        const req = {
            json: jest.fn().mockResolvedValue({ shortUrl: 'short1' }),
        } as Partial<NextRequest> as NextRequest;

        (prisma.urls.update as jest.Mock).mockResolvedValue(mockUrl);

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 200,
            data: mockUrl.originalUrl,
        });
    });

    it('should return 404 if the shortUrl does not exist', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ shortUrl: 'nonexistent' }),
        } as Partial<NextRequest> as NextRequest;

        (prisma.urls.update as jest.Mock).mockResolvedValue(null);

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 404,
            errorMessage: 'URL not found',
            errorDetail: 'The shortened URL provided does not exist in the database.',
        }, { status: 404 });
    });

    it('should return 400 if shortUrl is not provided', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({}),
        } as Partial<NextRequest> as NextRequest;

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            errorMessage: 'Short URL not provided',
            errorDetail: 'The request is missing the shortUrl in the body.',
        }, { status: 400 });
    });

    it('should return 500 for an internal server error', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ shortUrl: 'short1' }),
        } as Partial<NextRequest> as NextRequest;

        (prisma.urls.update as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const response = await POST(req);

        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.',
        }, { status: 500 });
    });
});
