import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Costant - Transparência de Infraestrutura',
    template: '%s | Costant',
  },
  description: 'A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos',
  keywords: ['Moçambique', 'infraestrutura', 'transparência', 'governo', 'projetos', 'cidadão'],
  authors: [{ name: 'Costant Team' }],
  manifest: '/manifest.json',
  themeColor: '#0066CC', // themeColor can stay in metadata
  icons: {
    icon: '/logo-cost.ico',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Costant',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_MZ',
    url: 'https://costant.mz',
    title: 'Costant - Transparência de Infraestrutura',
    description: 'A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos',
    siteName: 'Costant',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costant - Transparência de Infraestrutura',
    description: 'A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0066CC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ" className="h-full">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Costant" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full bg-background text-foreground antialiased`}>
        {/* Main App Container */}
        <div className="min-h-screen flex flex-col">
          <Header />

          {/* App Content */}
          <main className="flex-1">
            {children}
          </main>

          <Footer />

          {/* Offline Indicator (will be shown when offline) */}
          <div id="offline-indicator" className="hidden fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
            <span className="text-sm font-medium">
              📵 Modo Offline - A usar dados guardados
            </span>
          </div>
        </div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}