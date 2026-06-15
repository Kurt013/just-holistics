import Link from 'next/link';

interface ProtocolUser {
  name: string;
}

export type Protocol = {
  id: string | number;
  title: string;
  content: string;
  tags?: string[];
  rating: number;
  reviews_count?: number;
  threads_count?: number;
  user?: ProtocolUser | null;
  created_at: string;
}
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface ProtocolCardProps {
  protocol: Protocol;
}

export default function ProtocolCard({ protocol }: ProtocolCardProps) {
  const tags = protocol.tags ?? [];
  const excerpt =
    protocol.content.length > 120
      ? protocol.content.slice(0, 120) + '…'
      : protocol.content;

  return (
    <Link href={`/protocols/${protocol.id}`}>
      <article
        className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                   hover:shadow-md hover:border-green-200 transition-all duration-200 h-full flex flex-col"
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} label={tag} color="green" />
            ))}
            {tags.length > 3 && (
              <Badge label={`+${tags.length - 3}`} color="gray" />
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2
                       group-hover:text-green-700 transition-colors line-clamp-2">
          {protocol.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <StarRating value={protocol.rating} size="sm" />
            <span className="text-xs text-gray-500">
              {protocol.rating > 0 ? protocol.rating.toFixed(1) : 'No reviews'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            {protocol.reviews_count !== undefined && (
              <span>📝 {protocol.reviews_count} reviews</span>
            )}
            {protocol.threads_count !== undefined && (
              <span>💬 {protocol.threads_count} threads</span>
            )}
          </div>
        </div>

        {/* Author */}
        {protocol.user && (
          <p className="text-xs text-gray-400 mt-2">
            by <span className="font-medium text-gray-500">{protocol.user.name}</span>
            {' · '}
            {new Date(protocol.created_at).toLocaleDateString()}
          </p>
        )}
      </article>
    </Link>
  );
}