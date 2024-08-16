import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl, sanitizeInput, generateShortUrl } from '../../../utils/helpers';

const prisma = new PrismaClient();

/**
 * Handles GET requests to retrieve URLs.
 * If `originalUrl` is provided as a query parameter, it fetches the specific shortened URL.
 * If not, it returns all URLs.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the status code and data or error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const urls = await prisma.urls.findMany({
      orderBy: { updatedAt: 'asc' }
    });
    return NextResponse.json({ statusCode: 200, data: urls });
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

/**
 * Handles POST requests to create a new shortened URL.
 * It validates the original URL, checks for an existing shortened version, and creates a new one if needed.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the status code and data or error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { originalUrl, customShortName } = await req.json();

    // Sanitize the input to remove any potential harmful code
    const sanitizedUrl = sanitizeInput(originalUrl);

    // Validate the URL length and format
    if (!sanitizedUrl || sanitizedUrl.length < 5) {
      return NextResponse.json({
        statusCode: 400,
        errorMessage: 'Invalid URL or URL is too short',
        errorDetail: 'The URL provided is either empty or does not meet the minimum length requirement of 5 characters.'
      }, { status: 400 });
    }

    // Validate that the input is a properly formatted URL
    if (!isValidUrl(sanitizedUrl)) {
      return NextResponse.json({
        statusCode: 400,
        errorMessage: 'Invalid URL format',
        errorDetail: 'The URL provided is not in a valid format.'
      }, { status: 400 });
    }

    /// Determine the short URL (use custom or generate a random one)
    let shortenUrl = customShortName?.trim();

    if (!shortenUrl) {
      shortenUrl = generateShortUrl();
    }

    // Check if the custom short name already exists
    const existingCustomShortUrl = await prisma.urls.findUnique({
      where: { shortenUrl }
    });

    if (existingCustomShortUrl) {
      return NextResponse.json({
        statusCode: 400,
        errorMessage: 'Custom short name already exists',
        errorDetail: 'The custom short name provided is already in use. Please choose another one or leave it empty to auto-generate a name.'
      }, { status: 400 });
    }

    // Save the new shortened URL
    const urlModel = await prisma.urls.create({
      data: { originalUrl: sanitizedUrl, shortenUrl },
    });

    return NextResponse.json({ statusCode: 200, data: urlModel });

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({
      statusCode: 500,
      errorMessage: 'Internal Server Error',
      errorDetail: 'An unexpected error occurred while processing the request.'
    }, { status: 500 });
  }
}
