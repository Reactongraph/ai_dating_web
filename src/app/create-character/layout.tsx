import type { Metadata } from 'next';
import CreateCharacterLayoutComponent from '@/components/layouts/CreateCharacterLayoutComponent';

export const metadata: Metadata = {
  title: 'Create AI Character - True Companion',
  description:
    'Create your perfect AI companion with our step-by-step character creator',
};

export default function CreateCharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreateCharacterLayoutComponent>{children}</CreateCharacterLayoutComponent>
  );
}
