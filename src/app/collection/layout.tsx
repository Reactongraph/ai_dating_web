import type { Metadata } from 'next';
import GlobalLayout from '@/components/layouts/GlobalLayout';

export const metadata: Metadata = {
  title: 'Collection - True Companion',
  description: 'Browse and manage your AI companion collection',
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GlobalLayout>{children}</GlobalLayout>;
}
