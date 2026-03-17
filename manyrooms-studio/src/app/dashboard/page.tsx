'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== 'client') {
      router.push('/login');
    }
  }, [loading, userRole, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>
      <p className="text-slate-400">
        Welcome back, {user?.user_metadata?.name ?? user?.email ?? 'Guest'}
      </p>
      {/* Client-specific content */}
    </div>
  );
}
