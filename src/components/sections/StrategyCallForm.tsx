"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * Low-friction strategy-call form: 3–4 fields + reassurance microcopy.
 * No backend in this build - submits to a mailto fallback and shows a designed
 * success state. Wire to the CMS/CRM endpoint at integration time.
 */
export function StrategyCallForm() {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", goal: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\n\nGoal:\n${form.goal}`
    );
    // mailto fallback so the form is never a dead end before the backend is wired.
    window.location.href = `mailto:${site.email.partners}?subject=${encodeURIComponent(
      "Strategy call request"
    )}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-card border border-brand/40 bg-bg-elev p-8 text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand-bright">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-2xl text-ink">Thanks, we&apos;ve got it.</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          We reply within one business day. If your mail client didn&apos;t open, email us directly at{" "}
          <a href={`mailto:${site.email.partners}`} className="text-brand-bright underline">
            {site.email.partners}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-bg-elev p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" autoComplete="name" label="Your name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field id="company" autoComplete="organization" label="Company" required value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
      </div>
      <div className="mt-4">
        <Field id="email" autoComplete="email" label="Work email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      </div>
      <div className="mt-4">
        <label htmlFor="goal" className="mb-1.5 block text-sm text-muted">What are you trying to grow?</label>
        <textarea
          id="goal"
          name="goal"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          rows={3}
          className="w-full resize-none rounded-panel border border-line bg-bg-deep px-4 py-3 text-ink transition-colors placeholder:text-subtle focus:border-brand-bright"
          placeholder="A new market, a product launch, more customers in person…"
        />
      </div>
      <div className="mt-6 flex flex-col items-start gap-3">
        <Button type="submit" variant="primary" size="lg" magnetic={false}>
          Book a 20-minute call
        </Button>
        <p className="text-sm text-subtle">We reply within one business day. No pressure, no spam.</p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  name,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  name?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-muted">
        {label} {required && <span className="text-brand-bright">*</span>}
      </label>
      <input
        id={id}
        name={name ?? id}
        autoComplete={autoComplete}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-panel border border-line bg-bg-deep px-4 py-3 text-ink transition-colors placeholder:text-subtle focus:border-brand-bright"
      />
    </div>
  );
}
