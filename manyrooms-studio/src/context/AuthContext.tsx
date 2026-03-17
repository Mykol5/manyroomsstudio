'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type to include metadata
interface User extends SupabaseUser {
  user_metadata: {
    name?: string;
    role?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    router.push(getDashboardByRole(data.user.role));
    router.refresh();
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setUser(data.user);
    router.push(getDashboardByRole(data.user.role));
    router.refresh();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const getDashboardByRole = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'owner': return '/owner/dashboard';
      case 'franchisee': return '/franchisee/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, userRole: user?.role || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}







// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string, role: string) => Promise<void>;
//   logout: () => Promise<void>;
//   userRole: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const res = await fetch('/api/auth/me');
//       if (res.ok) {
//         const data = await res.json();
//         setUser(data.user);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || 'Login failed');
//     }

//     setUser(data.user);
//     router.push(getDashboardByRole(data.user.role));
//   };

//   const signup = async (name: string, email: string, password: string, role: string) => {
//     const res = await fetch('/api/auth/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, role }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || 'Signup failed');
//     }

//     setUser(data.user);
//     router.push(getDashboardByRole(data.user.role));
//   };

//   const logout = async () => {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     setUser(null);
//     router.push('/login');
//   };

//   const getDashboardByRole = (role: string) => {
//     switch (role) {
//       case 'admin': return '/admin';
//       case 'owner': return '/owner/dashboard';
//       case 'franchisee': return '/franchisee/dashboard';
//       default: return '/dashboard';
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, signup, logout, userRole: user?.role || null }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }