"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";

// Optional: configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

export default function LoadingProgress() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // Artificial small delay to make transitions visible
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
