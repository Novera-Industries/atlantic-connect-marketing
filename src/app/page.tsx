import { HomeStage } from "@/components/home/HomeStage";
import { Hero } from "@/components/home/Hero";
import { Tension } from "@/components/home/Tension";
import { ClientPreview } from "@/components/home/ClientPreview";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ProofCoverage } from "@/components/home/ProofCoverage";
import { TheFork } from "@/components/home/TheFork";
import { LadderTeaser } from "@/components/home/LadderTeaser";
import { Culture } from "@/components/home/Culture";
import { StickyCall } from "@/components/home/StickyCall";

// Home: one continuous particle "Current" (HomeStage) behind an eight-act
// scroll story — wave (hero) → digital static (the tension) → the human
// channel (the turn) → process thread → four coverage lanes (proof) → the
// fork → the warm climb (talent) → culture, settling into the footer's dual
// CTA. High-intent traffic deep-links straight to /partner or /careers; the
// sticky strategy-call bar keeps the primary conversion one tap away.
export default function HomePage() {
  return (
    <>
      <HomeStage>
        <Hero />
        <Tension />
        <ClientPreview />
        <ProcessTimeline />
        <ProofCoverage />
        <TheFork />
        <LadderTeaser />
        <Culture />
      </HomeStage>
      <StickyCall />
    </>
  );
}
