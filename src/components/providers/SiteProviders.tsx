"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      {children}
    </SmoothScrollProvider>
  );
}
