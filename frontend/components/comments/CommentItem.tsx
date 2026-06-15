'use client';
import { SyntheticEvent, useState } from 'react';
import api from '@/lib/api';
import VoteButtons from '@/components/ui/VoteButtons';
import { Comment } from './CommentThread';

interface Props {
  comment: Comment;
  onReply: () => void;
  depth?: number;
  id?: number;
}

export default function CommentItem({ comment, onReply, depth = 0, id }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const submitReply = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    await api.post(`api/comments/${comment.id}/replies`, { body: replyBody, user_id: id });
    setReplyBody('');
    setShowReply(false);
    onReply();
  };

  const replies = comment.replies ?? [];

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
            {comment.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="text-sm font-medium text-gray-800">{comment.user?.name ?? 'Unknown'}</span>
          <span className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3">{comment.body}</p>
        <div className="flex items-center gap-4">
          <VoteButtons
            type="comment"
            id={comment.id}
            upvotes={comment.upvotes_count}
            downvotes={comment.downvotes_count}
            userId={1}
          />
          {depth < 3 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-gray-500 hover:text-green-600 transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {showReply && (
          <form onSubmit={submitReply} className="mt-3">
            <textarea
              value={replyBody}
              onChange={e => setReplyBody(e.target.value)}
              rows={2}
              placeholder="Write a reply..."
              className="w-full border border-gray-200 rounded p-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <div className="flex gap-2 mt-1">
              <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                Reply
              </button>
              <button type="button" onClick={() => setShowReply(false)} className="px-3 py-1 text-gray-500 text-xs hover:text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply: Comment) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} id={id} />
          ))}
        </div>
      )}
    </div>
  );
}