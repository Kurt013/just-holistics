'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StarRating from '@/components/ui/StarRating';

type ReviewUser = {
  name?: string;
} | null;

type Review = {
  id: number;
  rating: number;
  feedback?: string | null;
  created_at: string;
  user?: ReviewUser;
};

interface Props {
  protocolId: string;
  initialReviews: Review[];
  initialRating: number;
  initialCount: number;
}

export default function ProtocolReviews({
  protocolId,
  initialReviews,
  initialRating,
  initialCount,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);

      try {
        const response = await api.get(`api/protocols/${protocolId}/reviews`);
        setReviews(response.data ?? []);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [protocolId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) return;

    setSubmitting(true);

    try {
      await api.post(`api/protocols/${protocolId}/reviews`, {
        user_id: 1,
        rating,
        feedback: feedback.trim() || null,
      });

      setRating(0);
      setFeedback('');

      const response = await api.get(`api/protocols/${protocolId}/reviews`);
      setReviews(response.data ?? []);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedCount = reviews.length || initialCount;
  const displayedRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : initialRating;

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-200/60">
          <p className="text-sm font-medium text-slate-300">Ratings</p>
          <div className="mt-3 flex items-end gap-3">
            <div className="text-5xl font-semibold tracking-tight">
              {displayedRating ? displayedRating.toFixed(1) : '0.0'}
            </div>
            <div className="pb-1 text-sm text-slate-300">
              <StarRating value={Math.round(displayedRating)} size="sm" />
              <p className="mt-1">{displayedCount} review{displayedCount === 1 ? '' : 's'}</p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
            Rate the protocol and leave feedback at the bottom.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div>
              <p className="text-sm font-medium text-slate-200">Your rating</p>
              <div className="mt-2">
                <StarRating
                  value={rating}
                  interactive
                  size="lg"
                  onChange={(value) => setRating(value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="feedback" className="text-sm font-medium text-slate-200">
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                rows={4}
                placeholder="Share what worked, what didn’t, or any tips for other readers..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !rating}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post feedback'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Feedback</p>
              <h2 className="text-xl font-semibold text-slate-900">What people are saying</h2>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
              {displayedCount} total
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                No feedback yet. Be the first to add a rating.
              </div>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                        {review.user?.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{review.user?.name ?? 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <StarRating value={review.rating} size="sm" />
                  </div>

                  {review.feedback ? (
                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.feedback}</p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">No written feedback.</p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}