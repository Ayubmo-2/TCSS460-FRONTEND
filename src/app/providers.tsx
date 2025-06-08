'use client';

import { IntlProvider } from 'react-intl';
import enMessages from '@/locales/en.json';
import ThemeCustomization from '@/themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeCustomization>
      <IntlProvider messages={enMessages} locale="en" defaultLocale="en">
        {children}
      </IntlProvider>
    </ThemeCustomization>
  );
}