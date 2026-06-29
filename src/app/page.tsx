import { HomeStage } from "@/components/home/HomeStage";
import { Hero } from "@/components/home/Hero";
import { TheFork } from "@/components/home/TheFork";
import { ClientPreview } from "@/components/home/ClientPreview";
import { TalentPreview } from "@/components/home/TalentPreview";
import { TrustBand } from "@/components/home/TrustBand";

// Home: one continuous particle "Current" (HomeStage) behind a brand-narrative
// scroll — bloom → wave → split (into the Partner/Careers cards) → previews →
// reconverge. High-intent traffic deep-links straight to /partner or /careers.
export default function HomePage() {
  return (
    <HomeStage>
      <Hero />
      <TheFork />
      <ClientPreview />
      <TalentPreview />
      <TrustBand />
    </HomeStage>
  );
}
