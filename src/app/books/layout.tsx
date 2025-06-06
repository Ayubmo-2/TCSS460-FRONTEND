import { ReactNode } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';

export default function BooksLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 