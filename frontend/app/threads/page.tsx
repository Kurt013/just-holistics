"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import SearchBar from "@/components/search/SearchBar";
import FilterBar from "@/components/search/FilterBar";
import ThreadCard, { type Thread } from "@/components/threads/ThreadCard";
import Spinner from "@/components/ui/Spinner";

const SORT_OPTIONS = [
  { value: "most_recent", label: "Most Recent" },
  { value: "most_upvoted", label: "Most Upvoted" },
];

type ThreadsMeta = {
  last_page: number;
  found?: number;
};

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("most_recent");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ThreadsMeta | null>(null);
  const lastPage = meta?.last_page ?? Math.ceil((meta?.found ?? 0) / 15) ?? 1;

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);

      try {
        const response = await api.get(
          `api/search/threads?q=${encodeURIComponent(query)}&sort=${sort}&page=${page}&per_page=15`,
        );

        const meta = response.data;

        setThreads(meta.data ?? meta.hits ?? []);
        setMeta(meta);

        // 🚨 clamp page if invalid
        if (meta.last_page && page > meta.last_page) {
          setPage(meta.last_page);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [query, sort, page]);

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 md:p-10 shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm ring-1 ring-emerald-100">
              Community Discussions
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Explore the threads shaping the community.
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-gray-600">
              Browse questions, reflections, and practical experiences from
              people testing protocols, sharing results, and learning together.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-emerald-100">
                <div className="text-2xl font-bold text-gray-900">Fast</div>
                <div className="text-sm text-gray-500">
                  Search conversations instantly
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-emerald-100">
                <div className="text-2xl font-bold text-gray-900">Useful</div>
                <div className="text-sm text-gray-500">
                  Sort by momentum and recency
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-emerald-100">
                <div className="text-2xl font-bold text-gray-900">Readable</div>
                <div className="text-sm text-gray-500">
                  Clean cards with vote context
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={(nextQuery) => {
                setQuery(nextQuery);
                setPage(1);
              }}
              placeholder="Search threads..."
            />
          </div>

          <FilterBar
            options={SORT_OPTIONS}
            selected={sort}
            onChange={(nextSort) => {
              setSort(nextSort);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="max-w-4xl mx-auto flex justify-center py-24">
            <Spinner />
          </div>
        ) : threads.length === 0 ? (
          <section className="max-w-4xl mx-auto rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No threads found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or switch the sort order to discover
              more conversations.
            </p>
          </section>
        ) : (
          <div className="max-w-7xl gap-6">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} showProtocol />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
