"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies the address to the clipboard: mailto links often do nothing on work laptops. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this email address:", email);
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      data-copy-email
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface px-3.5 text-sm font-semibold ring-1 ring-ink/15 hover:bg-brick-yellow"
    >
      {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      {copied ? "Copied" : "Copy email"}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
