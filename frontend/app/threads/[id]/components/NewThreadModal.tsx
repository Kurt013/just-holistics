"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewThreadModal({
  protocolId,
  open,
  onClose,
}: {
  protocolId: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    try {
      setLoading(true);

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await api.post(
        `api/protocols/${protocolId}/threads`,
        {
          title,
          body,
          tags,
        }
      );

      const threadId = response.data.id;

      onClose();
      router.push(`/threads/${threadId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create thread.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Start a new discussion
        </h2>

        {error && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Thread title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Write your discussion..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          {/* 🏷 TAG INPUT */}
          <input
            type="text"
            placeholder="Tags (comma separated: health, sleep, wellness)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Thread"}
          </button>
        </form>
      </div>
    </div>
  );
}