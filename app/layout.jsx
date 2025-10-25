import '../styles/globals.css';
import ThemeToggle from '@utils/ThemeToggle';
import NavTabs from '@utils/NavTabs';
import Providers from '@components/Providers';
import CompareFloatingBar from '@components/Compare/CompareFloatingBar';

export const metadata = { title: 'LLM Lab — Final Rebuild' };

export default function RootLayout({ children }){
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="font-semibold">LLM Lab</div>
              <div className="flex items-center gap-8">
                <NavTabs />
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
          <CompareFloatingBar />
        </Providers>
      </body>
    </html>
  );
}
