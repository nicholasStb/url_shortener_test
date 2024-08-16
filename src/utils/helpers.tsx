import { randomBytes } from 'crypto';

/**
 * Basic input sanitization to remove potentially harmful SQL injection patterns.
 * 
 * @param {string} input - The input string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
    return input.replace(/('|"|;|--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|DECLARE|ALTER|CREATE)\b)/gi, '');
};


/**
 * Validates the URL format.
 * 
 * @param {string} url - The URL to validate.
 * @returns {boolean} - Whether the URL is valid.
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url); // Using URL constructor to validate the URL format
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Generates a random shortened URL of a specified length.
 * 
 * @param {number} length - The length of the shortened URL to generate.
 * @returns {string} - The generated shortened URL.
 */
export const generateShortUrl = (length = 6): string => {
    return randomBytes(length).toString('base64url').substring(0, length);
};

/**
     * Validates the URL format using regex.
     * 
     * @param {string} url - The URL to validate.
     * @returns {boolean} - Whether the URL is valid.
     */
export const isValidUrlRegex = (url: string): boolean => {
    const urlRegex = /^(https?|ftp):\/\/([^\s$.?#].[^\s]*)$/i;
    return urlRegex.test(url);
};

/**
 * Checks for potential SQL Injection patterns in the URL.
 * 
 * @param {string} input - The URL to check.
 * @returns {boolean} - Whether the input contains suspicious patterns.
 */
export const containsSqlInjection = (input: string): boolean => {
    const sqlInjectionPattern = /('|"|;|--|\/\*|\*\/|DROP|SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|EXEC|UNION|DECLARE)/i;
    return sqlInjectionPattern.test(input);
};

/**
* Formats a date object into a readable string.
* 
* @param {Date} date - The date to format.
* @returns {string} - The formatted date string.
*/
export const formatDate = (date: Date): string => {
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
};