// Import the URLRedirection component
import URLRedirection from '../components/urlRedirection';

// Define the props interface for the RedirectPage component
interface RedirectPageProps {
    params: { shortUrl: string };
}

// Define the RedirectPage functional component
const RedirectPage: React.FC<RedirectPageProps> = ({ params: { shortUrl } }) => {
    // Render the URLRedirection component, passing the shortUrl as a prop
    return <URLRedirection shortUrl={shortUrl} />;
};

// Export the RedirectPage component as the default export
export default RedirectPage;