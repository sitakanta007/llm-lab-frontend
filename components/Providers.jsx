'use client';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }){
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </Provider>
  );
}
