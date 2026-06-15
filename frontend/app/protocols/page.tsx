"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import SearchBar from "@/components/search/SearchBar";
import FilterBar from "@/components/search/FilterBar";
import ProtocolCard, { Protocol } from "@/components/protocols/ProtocolCard";
import Spinner from "@/components/ui/Spinner";
import NewProtocolForm from "@/components/protocols/NewProtocolForm";

type Meta = {
  last_page: number;
};

const SORT_OPTIONS = [
  { value: "most_recent", label: "Most Recent" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "highest_rated", label: "Top Rated" },
];

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("most_recent");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProtocols = async () => {
      setLoading(true);
      try {
        // Use Typesense search if there's a query, else use standard API
        const endpoint = query
          ? `api/search/protocols?q=${encodeURIComponent(query)}&sort=${sort}&page=${page}`
          : `api/protocols?sort=${sort}&page=${page}`;

        const res = await api.get(endpoint);
        setProtocols(res.data.data ?? res.data.hits ?? []);
        setMeta(res.data.meta ?? null);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, [query, sort, page, refreshKey]);

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 md:p-10 shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm ring-1 ring-emerald-100">
              Community Protocols
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Explore the protocols shaping the community.
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
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-green-800 text-white text-sm font-semibold hover:bg-green-700 mb-3 transition-colors"
        >
          + Create Protocol
        </button>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={(q) => {
                setQuery(q);
                setPage(1);
              }}
              placeholder="Search protocols..."
            />
          </div>
          <FilterBar
            options={SORT_OPTIONS}
            selected={sort}
            onChange={(s) => {
              setSort(s);
              setPage(1);
            }}
          />
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocols.map((p: Protocol) => (
                <ProtocolCard key={p.id} protocol={p} />
              ))}
            </div>

            {/* Pagination */}
            {meta && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded text-sm ${
                        p === page
                          ? "bg-green-600 text-white"
                          : "border text-gray-600 hover:border-green-500"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </section>

      {showCreate && (
        <NewProtocolForm
          onSuccess={() => {
            setShowCreate(false);
            setRefreshKey((prev) => prev + 1);
            setPage(1);
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </main>
  );
}
