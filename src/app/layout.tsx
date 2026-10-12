import { FC, ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Weatherify',
  description: 'Playlist creator based on weather and time of the day.',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
