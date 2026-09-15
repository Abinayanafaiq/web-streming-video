"use client";

import { useState } from "react";

type Props = {
  title: string;
  path: string;
};

export default function ShareButton({ title, path }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}${path}`;
    const shareData = { title, text: `Tonton "${title}" di Videqqu`, url };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user membatalkan share native, lanjut ke fallback copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn-primary !py-1.5 text-xs"
    >
      {copied ? "Link tersalin!" : "Bagikan"}
    </button>
  );
}
