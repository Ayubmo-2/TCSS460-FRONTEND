'use client';

import { IntlProvider } from 'react-intl';
import { SessionProvider } from 'next-auth/react';
import enMessages from '@/locales/en.json';
import ThemeCustomization from '@/themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeCustomization>
        <IntlProvider messages={enMessages} locale="en" defaultLocale="en">
          {children}
        </IntlProvider>
      </ThemeCustomization>
    </SessionProvider>
  );
} 