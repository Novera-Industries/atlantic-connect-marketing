import Link from "next/link";
import { Instagram, Linkedin, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { site } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-deep">
      <WaveDivider className="opacity-50" />

      {/* Segmented dual CTA - leads never cross-contaminate. The bordered
          hairline grid is an inner element so cells fill it edge-to-edge (the
          Container's own padding must not show the bg-line as end bars). */}
      <Container size="shell">
        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          <div className="bg-bg-elev p-8 sm:p-10">
            <p className="text-eyebrow font-medium uppercase tracking-[0.18em] text-brand-bright">For brands</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Partner with us</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Book a 20-minute strategy call. We reply within one business day. No pressure, no spam.
            </p>
            <Button href="/partner" variant="primary" size="md" className="mt-5">
              Partner With Us
            </Button>
          </div>
          <div className="bg-bg-elev p-8 sm:p-10">
            <p className="text-eyebrow font-medium uppercase tracking-[0.18em] text-gold-mid">For talent</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Join the team</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Grow With Us. Every application gets a real reply within one business day.
            </p>
            <Button href="/careers" variant="gold" size="md" className="mt-5">
              Explore Careers
            </Button>
          </div>
        </div>
      </Container>

      <Container size="shell" className="mt-16 grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm text-muted">{site.spine}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-chrome-mid/50 hover:text-ink"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-chrome-mid/50 hover:text-ink"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <FooterCol
          title="Company"
          links={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Partner With Us", href: "/partner" },
            { label: "Careers", href: "/careers" },
          ]}
        />
        <FooterCol
          title="For brands"
          links={[
            { label: "How it works", href: "/partner#how" },
            { label: "Brand safety", href: "/partner#brand-safety" },
            { label: "Coverage", href: "/partner#coverage" },
            { label: "Book a strategy call", href: "/partner#contact" },
          ]}
        />
        <div>
          <h4 className="text-eyebrow font-medium uppercase tracking-[0.16em] text-subtle">Visit</h4>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
            <span>{site.address.full}</span>
          </p>
          <div className="mt-4 flex flex-col gap-1 text-sm">
            <a href={`mailto:${site.email.partners}`} className="text-muted hover:text-ink">
              {site.email.partners}
            </a>
            <a href={`mailto:${site.email.careers}`} className="text-muted hover:text-ink">
              {site.email.careers}
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container size="shell" className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-subtle sm:flex-row">
          <p>
            {/* site.name already ends in "Inc." — no extra period */}
            © {year} {site.name} All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-muted">Privacy (PIPEDA)</Link>
            <Link href="/about" className="hover:text-muted">About</Link>
            <span className="text-subtle/70">Halifax · Atlantic Canada</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-eyebrow font-medium uppercase tracking-[0.16em] text-subtle">{title}</h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
