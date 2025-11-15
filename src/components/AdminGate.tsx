"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "same-origin" });
        if (!mounted) return;
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        if (!mounted) return;
        if (json?.user?.role !== "ADMIN") {
          // Not an admin — redirect to home
          router.push("/");
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  if (loading) return null;
  return <>{children}</>;
}
