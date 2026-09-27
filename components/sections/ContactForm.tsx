"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { useState, type FormEvent, type MouseEvent } from "react";
import { Brick } from "@/components/ui/Brick";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import type { BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "A few more words, please (at least 10 characters).";
  return e;
}

const FIELD_COLORS: Record<Field, BrickColor> = { name: "red", email: "blue", message: "yellow" };
const LABELS: Record<Field, string> = { name: "Name", email: "Email", message: "Message" };

export function ContactForm({ to }: { to: string }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { place } = useMotionSafe();

  const errors = validate(values);
  const valid = (f: Field) => !errors[f];
  const allValid = Object.keys(errors).length === 0;
  const show = (f: Field) => touched[f] && errors[f];

  const mailto = `mailto:${to}?subject=${encodeURIComponent(`Hello from ${values.name.trim() || "your portfolio"}`)}&body=${encodeURIComponent(
    `${values.message.trim()}\n\n${values.name.trim()}${values.email.trim() ? ` <${values.email.trim()}>` : ""}`,
  )}`;

  function touchAll() {
    setTouched({ name: true, email: true, message: true });
  }

  function focusFirstInvalid() {
    const first = (["name", "email", "message"] as Field[]).find((f) => errors[f]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    touchAll();
    if (!allValid) return focusFirstInvalid();
    if (honey) return setStatus("sent"); // bots get a silent success
    if (!ENDPOINT) {
      window.location.assign(mailto);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  }

  function onMailtoClick(e: MouseEvent<HTMLAnchorElement>) {
    touchAll();
    if (!allValid) {
      e.preventDefault();
      focusFirstInvalid();
    }
  }

  const inputBase =
    "mt-2 block w-full rounded-[var(--radius-brick)] border-0 bg-surface px-4 py-3.5 text-base text-ink shadow-[var(--shadow-soft)] ring-1 ring-ink/10 placeholder:text-ink-2/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brick-blue";

  return (
    <form onSubmit={onSubmit} noValidate className="relative" aria-describedby="contact-status">
      {/* brick row: one brick per valid field, the submit is the final brick */}
      <div aria-hidden className="mb-8 flex h-12 items-end gap-2" data-brick-row>
        {(["name", "email", "message"] as Field[]).map((f) => (
          <div key={f} className="relative">
            <Brick color={FIELD_COLORS[f]} studs={{ w: 2, h: 1 }} size={22} outline className="opacity-40" />
            <AnimatePresence>
              {valid(f) && (
                <motion.div key="b" className="absolute inset-0" initial={place.initial} animate={place.animate} exit={{ opacity: 0 }} transition={place.transition} data-placed={f}>
                  <Brick color={FIELD_COLORS[f]} studs={{ w: 2, h: 1 }} size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="relative">
          <Brick color="green" studs={{ w: 2, h: 1 }} size={22} outline={status !== "sent"} className={status === "sent" ? "" : "opacity-40"} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {(["name", "email"] as Field[]).map((f) => (
          <div key={f}>
            <label htmlFor={`contact-${f}`} className="text-sm font-semibold">
              {LABELS[f]}
            </label>
            <input
              id={`contact-${f}`}
              name={f}
              type={f === "email" ? "email" : "text"}
              autoComplete={f === "email" ? "email" : "name"}
              value={values[f]}
              onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, [f]: true }))}
              aria-invalid={show(f) ? true : undefined}
              aria-describedby={show(f) ? `contact-${f}-error` : undefined}
              required
              className={cn(inputBase, show(f) && "ring-2 ring-brick-red")}
            />
            {show(f) && (
              <p id={`contact-${f}-error`} className="mt-2 text-sm font-medium text-brick-red" data-error={f}>
                {errors[f]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="text-sm font-semibold">
          {LABELS.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          aria-invalid={show("message") ? true : undefined}
          aria-describedby={show("message") ? "contact-message-error" : undefined}
          required
          className={cn(inputBase, "resize-y", show("message") && "ring-2 ring-brick-red")}
        />
        {show("message") && (
          <p id="contact-message-error" className="mt-2 text-sm font-medium text-brick-red" data-error="message">
            {errors.message}
          </p>
        )}
      </div>

      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {ENDPOINT ? (
          <button
            type="submit"
            disabled={status === "sending"}
            data-testid="contact-submit"
            className="inline-flex h-14 items-center gap-2.5 rounded-[var(--radius-brick)] bg-brick-green px-7 font-semibold text-white shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 active:translate-y-px disabled:opacity-60"
          >
            {status === "sending" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
            {status === "sending" ? "Sending…" : "Place the final brick"}
          </button>
        ) : (
          <a
            href={mailto}
            onClick={onMailtoClick}
            data-testid="contact-submit"
            className="inline-flex h-14 items-center gap-2.5 rounded-[var(--radius-brick)] bg-brick-green px-7 font-semibold text-white shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 active:translate-y-px"
          >
            <Send size={18} aria-hidden /> Place the final brick
          </a>
        )}
        {!ENDPOINT && <p className="text-sm text-ink-2">Opens your email app with the message ready to send.</p>}
      </div>

      <div id="contact-status" role="status" aria-live="polite" className="mt-5 min-h-6 text-sm font-medium">
        {status === "sent" && (
          <p className="flex items-center gap-2 text-brick-green">
            <CheckCircle2 size={18} aria-hidden /> Message sent. Thank you!
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-brick-red">
            <TriangleAlert size={18} aria-hidden /> Something went wrong. Please try again, or use the email link.
          </p>
        )}
      </div>
    </form>
  );
}
