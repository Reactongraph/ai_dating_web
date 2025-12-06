import type { Metadata } from 'next';
import LayoutWithoutFooter from '@/components/layouts/LayoutWithoutFooter';

export const metadata: Metadata = {
  title: 'Chats - Daily Love',
  description: 'Chat with your AI companions',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <LayoutWithoutFooter>{children}</LayoutWithoutFooter>;
}
