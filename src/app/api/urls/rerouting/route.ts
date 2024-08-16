import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log("Received POST request");

    try {
        const { shortUrl } = await req.json();
        console.log("Short URL:", shortUrl);

        if (shortUrl) {
            // Find the URL model in the database using the shortened URL
            const updatedUrl = await prisma.urls.update({
                where: { shortenUrl: shortUrl },
                data: { usageCount: { increment: 1 }, updatedAt: new Date() },
            });

            console.log("Updated URL:", updatedUrl);

            if (updatedUrl) {
                return NextResponse.json({
                    statusCode: 200,
                    data: updatedUrl.originalUrl
                });
            } else {
                // Return a 404 response if the shortened URL does not exist in the database
                return NextResponse.json({
                    statusCode: 404,
                    errorMessage: 'URL not found',
                    errorDetail: 'The shortened URL provided does not exist in the database.'
                }, { status: 404 });
            }
        } else {
            // Return a 400 response if the shortUrl query parameter is missing
            return NextResponse.json({
                statusCode: 400,
                errorMessage: 'Short URL not provided',
                errorDetail: 'The request is missing the shortUrl in the body.'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in GET request:', error);
        // Return a 500 response if an unexpected error occurs
        return NextResponse.json({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
            errorDetail: 'An unexpected error occurred while processing the request.'
        }, { status: 500 });
    }
}