import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import NextAuthSessionProvider from '@/components/providers/session-provider';
import ReduxProvider from '@/components/providers/redux-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Discover Indian Temples - Sacred Heritage Directory',
  description: 'Explore India\'s magnificent temples by deity, region, architecture, and spiritual significance. Discover sacred heritage and upcoming festivals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ReduxProvider>
          <NextAuthSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </NextAuthSessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}