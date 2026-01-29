"use client";

import { useState } from "react";

export default function CopyBtn({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/p/${id}`;
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 px-4 py-2 border border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
    >
      {copied ? "Link Copied!" : "Copy Share Link"}
    </button>
  );
}