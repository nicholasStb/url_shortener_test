import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * GET request handler for retrieving the original URL based on a shortened URL.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the status code and data or error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const shortUrl = searchParams.get('shortUrl');

    try {
        if (shortUrl) {
            // Find the URL model in the database using the shortened URL
            const urlModel = await prisma.urls.findUnique({
                where: { shortenUrl: shortUrl }
            });

            if (urlModel) {
                // Return the original URL if found
                return NextResponse.json({
                    statusCode: 200,
                    data: urlModel.originalUrl
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
                errorDetail: 'The request is missing the shortUrl query parameter.'
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

export default GET;