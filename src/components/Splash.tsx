"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Splash({ onDone }: { onDone: () => void }){
  const duration = 2500; // ms total fill time
  const interval = 25; // ms update interval
  const steps = Math.max(1, Math.round(duration / interval));
  const stepAmount = 100 / steps;

  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const mounted = useRef(true);
  const [fading, setFading] = useState(false);

  useEffect(()=>{
    mounted.current = true;
    let acc = 0;
    const id = setInterval(()=>{
      acc += stepAmount;
      const pct = Math.min(100, Math.round(acc));
      if (!mounted.current) return;
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        // start fade-out
        setFading(true);
        // delay slightly to show 100% then fade
        const fadeMs = 300;
        setTimeout(()=>{ if (mounted.current) onDone(); }, fadeMs + 150);
      }
    }, interval);
    return ()=>{ mounted.current = false; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity ${fading? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-3xl px-6 py-12">
        <div className="flex flex-col items-center gap-4">
          {!imgError ? (
            <Image src="/logo.png" alt="VM Studio" width={120} height={120} className="object-contain" onError={()=>setImgError(true)} priority />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo.png" alt="VM Studio" width={120} height={120} className="object-contain" onError={()=>setImgError(true)} />
          )}

          {/* short centered progress bar beneath the logo */}
          <div className="w-full flex justify-center mt-2">
            <div className="w-48">
              <div className="bg-gray-100 rounded-full h-1 overflow-hidden">
                <div
                  className="rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg,#4EA8FF,#2B6EF6)',
                    boxShadow: '0 0 10px rgba(46,139,255,0.6)',
                    transition: 'width 0.12s linear',
                    height: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="text-gray-700 font-medium text-sm">{progress}% Cargando...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
