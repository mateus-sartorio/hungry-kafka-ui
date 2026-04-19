"use client";

import { useEffect, useState } from "react";

function isMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const mobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
      navigator.userAgent,
    );
  const narrowScreen = window.matchMedia("(max-width: 900px)").matches;
  const hasTouch = navigator.maxTouchPoints > 0;

  return mobileUA || (narrowScreen && hasTouch);
}

function DesktopBlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] p-6 text-[#181c1b]">
      <div className="w-full max-w-md border border-[#c3caac]/30 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black italic tracking-tight text-[#4c6700]">Queue-sine</h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[#705a4f]">
          Mobile only
        </p>
        <p className="mt-3 text-sm text-[#434933]">
          This application is available only on mobile devices. Open it on your phone to continue.
        </p>
      </div>
    </main>
  );
}

export function MobileOnlyGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const evaluate = () => setAllowed(isMobileDevice());
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  if (!allowed) {
    return <DesktopBlockedPage />;
  }

  return <>{children}</>;
}
