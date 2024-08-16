'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathname = usePathname(); // Get the current pathname

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/home" className={pathname === "/home" ? "active" : ""}>
                        Shortener
                    </Link>
                </li>
                <li>
                    <Link href="/url-history" className={pathname === "/url-history" ? "active" : ""}>
                        URL History
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
