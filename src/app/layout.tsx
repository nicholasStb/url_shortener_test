import RootLayout from './layouts/RootLayout';
import NavbarLayout from './layouts/NavbarLayout';

export default function CombinedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout>
      <NavbarLayout>{children}</NavbarLayout>
    </RootLayout>
  );
}