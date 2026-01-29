"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isValid = content.trim() !== "" && (ttl !== "" || maxViews !== "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? parseInt(ttl) : null,
          max_views: maxViews ? parseInt(maxViews) : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/p/${data.id}`);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create Paste & Share it!!</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            className="w-full h-48 p-3 border border-black rounded-none focus:ring-1 focus:ring-black outline-none resize-none"
            placeholder="Paste your text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Expiry (Seconds)</label>
            <input
              type="number"
              className="w-full p-2 border border-black rounded-none"
              placeholder="e.g. 3600"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
            />
          </div>

          {/* Max Views Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Max Views</label>
            <input
              type="number"
              className="w-full p-2 border border-black rounded-none"
              placeholder="e.g. 5"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
            />
          </div>
        </div>

        {!isValid && content.length > 0 && (
          <p className="text-red-500 text-xs">
            * Please set either an expiry time or a maximum view count.
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full p-3 font-bold transition-colors ${
            isValid && !loading 
              ? "bg-black text-white hover:bg-gray-800" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "CREATING..." : "CREATE PASTE"}
        </button>
      </form>
    </main>
  );
}