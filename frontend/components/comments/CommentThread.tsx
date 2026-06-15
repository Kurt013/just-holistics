"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import CommentItem from "./CommentItem";

interface Props {
  threadId: number;
}

export type Comment = {
	id: number;
	body: string;
	created_at: string;
	upvotes_count: number;
	downvotes_count: number;
	user?: {
		name?: string;
	} | null;
	replies?: Comment[];
};

export default function CommentThread({ threadId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!threadId) return;

    setLoading(true);

    const res = await api.get(`api/threads/${threadId}/comments`);
    setComments(res.data);

    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    
    const loadComments = async () => {
      if (!threadId) return;

      setLoading(true);
      const res = await api.get(`api/threads/${threadId}/comments`);
      setComments(res.data);
      setLoading(false);
    };

    loadComments();

    return () => controller.abort();
  }, [threadId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!body.trim()) return;
    await api.post(`api/threads/${threadId}/comments`, { body, user_id: 1 });
    setBody("");
    fetchComments();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Comments</h3>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Share your thoughts..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm
                     hover:bg-green-700 transition-colors"
        >
          Post Comment
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c: Comment) => (
            <CommentItem key={c.id} comment={c} onReply={fetchComments} />
          ))}
        </div>
      )}
    </div>
  );
}
