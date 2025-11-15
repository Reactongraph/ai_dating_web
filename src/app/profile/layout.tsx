'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
