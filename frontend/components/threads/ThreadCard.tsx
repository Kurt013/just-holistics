import Link from "next/link";
import Badge from "@/components/ui/Badge";
import VoteButtons from "@/components/ui/VoteButtons";

export type Thread = {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  upvotes_count: number;
  downvotes_count: number;
  user?: {
    name: string;
  } | null;
  protocol_id?: string;
  protocol?: {
    title: string;
  };
  created_at: string;
  comments_count?: number;
};

interface ThreadCardProps {
  thread: Thread;
  showProtocol?: boolean;
}

export default function ThreadCard({
  thread,
  showProtocol = false,
}: ThreadCardProps) {
  const excerpt =
    thread.body.length > 160 ? thread.body.slice(0, 160) + "…" : thread.body;

    const tags = thread.tags ?? [];

  return (
    <article
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                        hover:shadow-md hover:border-green-100 transition-all"
    >
      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex-shrink-0 pt-1">
          <VoteButtons
            type="thread"
            id={thread.id}
            upvotes={thread.upvotes_count}
            downvotes={thread.downvotes_count}
            userId={0}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} label={tag} color="amber" />
              ))}
            </div>
          )}

          {/* Title */}
          <Link href={`/threads/${thread.id}`}>
            <h3
              className="font-semibold text-gray-900 hover:text-green-700 transition-colors
                           text-base leading-snug mb-2 line-clamp-2"
            >
              {thread.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {thread.user && (
              <span>
                by{" "}
                <span className="text-gray-600 font-medium">
                  {thread.user.name}
                </span>
              </span>
            )}
            {showProtocol && thread.protocol && (
              <Link
                href={`/protocols/${thread.protocol_id}`}
                className="text-green-600 hover:underline font-medium"
              >
                📋 {thread.protocol.title}
              </Link>
            )}
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
            {thread.comments_count !== undefined && (
              <span>💬 {thread.comments_count} comments</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
