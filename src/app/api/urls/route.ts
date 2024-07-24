import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * Generates a random shortened URL of a specified length.
 * 
 * @param {number} length - The length of the shortened URL to generate.
 * @returns {string} - The generated shortened URL.
 */
const generateShortUrl = (length = 6): string => {
  return randomBytes(length).toString('base64url').substring(0, length);
};

/**
 * Normalizes the given URL by ensuring it has a proper format.
 * 
 * @param {string} url - The original URL to normalize.
 * @returns {string} - The normalized URL.
 */
const normalizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    // Remove www prefix and trailing slash
    return parsedUrl.hostname.replace(/^www\./, '') + parsedUrl.pathname.replace(/\/$/, '');
  } catch {
    // Return the original URL if parsing fails
    return url;
  }
};

/**
 * Handles GET requests to retrieve URLs.
 * If `originalUrl` is provided as a query parameter, it fetches the specific shortened URL.
 * If not, it returns all URLs.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the status code and data or error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const originalUrl = searchParams.get('originalUrl');

  try {
    if (originalUrl) {
      // Fetch a specific shortened URL based on the original URL
      const urlModel = await prisma.urls.findUnique({
        where: { originalUrl }
      });

      if (urlModel) {
        // Return the found URL model
        return NextResponse.json({ statusCode: 200, data: urlModel });
      } else {
        // Return a 404 response if the URL is not found
        return NextResponse.json({
          statusCode: 404,
          errorMessage: 'URL not found',
          errorDetail: 'The requested URL was not found in the database.'
        }, { status: 404 });
      }
    } else {
      // Return all URLs
      const urlsModel = await prisma.urls.findMany();
      return NextResponse.json({ statusCode: 200, data: urlsModel });
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

/**
 * Handles POST requests to create a new shortened URL.
 * It validates the original URL, checks for an existing shortened version, and creates a new one if needed.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the status code and data or error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { originalUrl } = await req.json();

    // Validate the URL length and format
    if (!originalUrl || originalUrl.length < 5) {
      return NextResponse.json({
        statusCode: 400,
        errorMessage: 'Invalid URL or URL is too short',
        errorDetail: 'The URL provided is either empty or does not meet the minimum length requirement of 5 characters.'
      }, { status: 400 });
    }

    // const normalizedUrl = normalizeUrl(originalUrl);

    // Check if the URL already has a shortened version
    const existingUrl = await prisma.urls.findUnique({
      where: { originalUrl: originalUrl }
    });

    if (existingUrl) {
      // Return the existing shortened URL
      return NextResponse.json({
        statusCode: 200,
        data: 'Already Exists',
        shortenUrl: existingUrl.shortenUrl
      });
    } else {
      const shortenUrl = generateShortUrl();

      // Save the new shortened URL
      const urlModel = await prisma.urls.create({
        data: { originalUrl: originalUrl, shortenUrl },
      });

      return NextResponse.json({
        statusCode: 201,
        data: urlModel
      });
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    // Return a 500 response if an unexpected error occurs
    return NextResponse.json({
      statusCode: 500,
      errorMessage: 'Internal Server Error',
      errorDetail: 'An unexpected error occurred while processing the request.'
    }, { status: 500 });
  }
}

export default { GET, POST };