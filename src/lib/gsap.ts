"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once on the client. SplitText (free since GSAP 3.13) is imported
// locally by the components that need it to keep it out of shared bundles.
// (useGSAP is a hook, not a plugin - it does not need registration.)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger, useGSAP };
