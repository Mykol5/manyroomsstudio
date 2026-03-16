'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OwnerDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== 'owner') {
      router.push('/login');
    }
  }, [loading, userRole, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <p className="text-slate-400">Welcome back, {user?.name}</p>
      {/* Owner-specific content */}
    </div>
  );
}