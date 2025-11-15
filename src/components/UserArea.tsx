"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type MeUser = { id: number; email: string; firstName?: string; lastName?: string; role?: string };

const UserPanel = dynamic(() => import('@/components/UserPanel'), { ssr: false });

export default function UserArea(){
  const [me, setMe] = useState<MeUser | null>(null);

  useEffect(()=>{
    let mounted = true;
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{ if(mounted && j.ok) setMe(j.user); }).catch(()=>{});
    return ()=>{ mounted=false };
  }, []);

  if (!me) return null;
  if (me.role === 'ADMIN') return null; // admin uses /admin
  // dynamic imported component typings are loose here; instruct TS to ignore the prop typing
  return <UserPanel user={me} />;
}
