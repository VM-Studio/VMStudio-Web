"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<{ firstName?: string; email?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/auth/me');
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          setUser(json.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="w-full bg-transparent py-4">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-white">
        <Link href="/" className="font-bold">VM Studio</Link>
        <nav className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="text-sm text-blue-300">Ingresar</Link>
              <Link href="/signup" className="text-sm text-blue-300">Registrarse</Link>
            </>
          )}
          {user && (
            <>
              <span className="text-sm">{user.firstName || user.email}</span>
              {user.role === 'ADMIN' ? <Link href="/admin" className="text-sm text-blue-300">Panel Admin</Link> : <Link href="/" className="text-sm text-blue-300">Mi Panel</Link>}
              <button onClick={async ()=>{
                try{
                  await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
                }catch(e){ console.error(e); }
                setUser(null);
                router.push('/');
              }} className="text-sm text-red-400 ml-3">Cerrar sesión</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
