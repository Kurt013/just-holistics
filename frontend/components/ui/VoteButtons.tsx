'use client';
import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Props {
  type: 'thread' | 'comment';
  id: number;
  upvotes: number;
  downvotes: number;
  userId: number;
}

export default function VoteButtons({ type, id, upvotes, downvotes, userId }: Props) {
  const [up, setUp]     = useState(upvotes);
  const [down, setDown] = useState(downvotes);
  const [loading, setLoading] = useState(false);

  const vote = async (voteType: 'up' | 'down') => {
    if (loading) return;
    setLoading(true);
    try {
      const endpoint = type === 'thread' ? `api/threads/${id}/vote` : `api/comments/${id}/vote`;
      const res = await api.post(endpoint, { user_id: userId, type: voteType });
      setUp(res.data.upvotes_count);
      setDown(res.data.downvotes_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote('up')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
        disabled={loading}
      >
        <ArrowUpIcon className="w-4 h-4" />
        <span>{up}</span>
      </button>
      <button
        onClick={() => vote('down')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
        disabled={loading}
      >
        <ArrowDownIcon className="w-4 h-4" />
        <span>{down}</span>
      </button>
    </div>
  );
}