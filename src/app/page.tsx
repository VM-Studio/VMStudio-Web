"use client";
import Splash from "@/components/Splash";
import AuthPanel from "@/components/AuthPanel";
import { useState } from "react";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="w-full min-h-screen bg-black">
      {showSplash ? <Splash onDone={() => setShowSplash(false)} /> : <AuthPanel />}
    </main>
  );
}
