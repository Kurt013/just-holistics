import api from "@/lib/api";
import { notFound } from "next/navigation";
import StarRating from "../../../components/ui/StarRating";
import ProtocolReviews from "../../../components/protocols/ProtocolReviews";

import ThreadList from "../../threads/[id]/components/ThreadList";
import ThreadModalTrigger from "../../threads/[id]/components/ThreadModalTrigger";

type Protocol = {
	id: string;
	title?: string;
	description?: string;
	content?: string;
	tags?: string[];
	rating?: number;
	reviews_count?: number;
	reviews?: Array<{
		id: number;
		rating: number;
		feedback?: string | null;
		created_at: string;
		user?: {
			name?: string;
		} | null;
	}>;
};

async function getProtocol(id: string): Promise<Protocol | null> {
	try {
		const response = await api.get(`api/protocols/${id}`);

		if (!response.data) return null;

		return response.data as Protocol;
	} catch {
		return null;
	}
}

export default async function ProtocolPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const protocol = await getProtocol(id);

	if (!protocol) notFound();

	return (
		<main className="min-h-screen bg-slate-50">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 lg:col-span-2">
					<div className="flex-1 gap-8">
						<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
							<div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-6 sm:p-8">
								<div className="mt-3 flex flex-wrap items-center gap-3">
									<h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
										{protocol.title ?? "Untitled protocol"}
									</h1>
									<div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
										<StarRating value={protocol.rating ?? 0} size="sm" />
										<span>{protocol.rating ? protocol.rating.toFixed(1) : "No ratings yet"}</span>
									</div>
								</div>
								{protocol.tags && protocol.tags.length > 0 ? (
									<div className="mt-4 flex flex-wrap gap-2">
										{protocol.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
											>
												{tag}
											</span>
										))}
									</div>
								) : null}
								{protocol.description ? (
									<p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
										{protocol.description}
									</p>
								) : null}
							</div>
							<div className="p-6 sm:p-8">
								{protocol.content ? (
									<section>
										<h2 className="text-lg font-semibold text-slate-900">Details</h2>
										<div className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-800 ring-1 ring-slate-200">
											{protocol.content}
										</div>
									</section>
								) : null}
							</div>
						</div>
					</div>
					<div>
						<ProtocolReviews
							protocolId={protocol.id}
							initialReviews={protocol.reviews ?? []}
							initialRating={protocol.rating ?? 0}
							initialCount={protocol.reviews_count ?? protocol.reviews?.length ?? 0}
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-2xl font-semibold text-slate-900">Threads</h2>
						<ThreadModalTrigger protocolId={protocol.id} />
					</div>
					<div className="mt-6 text-sm text-slate-400">
						<ThreadList protocolId={protocol.id} />
					</div>
				</div>
			</div>
		</main>
	);
}
