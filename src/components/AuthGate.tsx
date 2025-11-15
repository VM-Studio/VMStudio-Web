"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "same-origin" });
        if (!mounted) return;
        if (res.ok) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return null;
  return <>{children}</>;
}
