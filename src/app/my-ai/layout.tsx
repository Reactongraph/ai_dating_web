import type { Metadata } from 'next';
import GlobalLayout from '@/components/layouts/GlobalLayout';

export const metadata: Metadata = {
  title: 'My AI - Daily Love',
  description: 'Manage your AI companions',
};

export default function MyAILayout({ children }: { children: React.ReactNode }) {
  return <GlobalLayout>{children}</GlobalLayout>;
}
