'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function NavbarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // List of static routes where you want to show the Navbar
    const staticRoutes = ['/home', '/url-history'];

    // Show Navbar only if the current route is not dynamic
    const shouldShowNavbar = staticRoutes.includes(pathname || '');


    return (
        <>
            {shouldShowNavbar && <Navbar />}
            {children}
        </>
    );
}
