import type { Metadata } from 'next';
import LayoutWithoutFooter from '@/components/layouts/LayoutWithoutFooter';

export const metadata: Metadata = {
  title: 'Create AI Character - Daily Love',
  description: 'Create your perfect AI companion with our step-by-step character creator',
};

export default function CreateCharacterLayout({ children }: { children: React.ReactNode }) {
  return <LayoutWithoutFooter>{children}</LayoutWithoutFooter>;
}
