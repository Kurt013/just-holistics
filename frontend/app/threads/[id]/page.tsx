import api from "@/lib/api";
import { notFound } from "next/navigation";
import CommentsSection, {
	Comment,
} from "@/components/comments/CommentSection";
import Link from "next/link";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import VoteButtons from "@/components/ui/VoteButtons";

type Thread = {
	id: string;
	user_id: number;
	protocol_id: string;
	title?: string;
	body?: string;
	tags?: string[];
	upvotes_count?: number;
	downvotes_count?: number;
	user?: { name?: string } | null;
	protocol?: { 
		id: string;
		title?: string 
	};
	created_at: string;
	comments?: Comment[];
};

async function getThread(id: string): Promise<Thread | null> {
	try {
		const response = await api.get(`api/threads/${id}`);

		if (!response.data) return null;

		return response.data;
	} catch {
		return null;
	}
}

export default async function ThreadPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const thread = await getThread(id);

	if (!thread) notFound();

	return (
		<main className="min-h-screen bg-slate-50">
			<div className="max-w-5xl mx-auto px-4 py-8">
				<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-8">
						<div className="flex flex-wrap gap-2 mb-3">
							{thread.tags?.map((tag) => (
								<span
									key={tag}
									className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
								>
									{tag}
								</span>
							))}
						</div>
						
						{thread.protocol?.id && (
							<Link href={`/protocols/${thread.protocol.id}`}>
								<div className="flex items-center gap-1 text-green-600 hover:text-green-800">
									<ArrowTopRightOnSquareIcon className="inline h-4 w-4" />
									<span className="font-medium ">
										{thread.protocol.title}
									</span>
								</div>
							</Link>
						)}

						<h1 className="text-3xl font-semibold text-slate-900">
							{thread.title}
						</h1>

						<div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
							{thread.user && (
								<span>
									by{" "}
									<span className="font-medium text-slate-700">
										{thread.user.name}
									</span>
								</span>
							)}

							<span>
								{new Date(thread.created_at).toLocaleDateString()}
							</span>
						</div>

						<div className="mt-4">
							<VoteButtons
								type="thread"
								id={parseInt(thread.id)}
								upvotes={thread.upvotes_count || 0}
								downvotes={thread.downvotes_count || 0}
								userId={thread.user_id}
							/>
						</div>
					</div>

					<div className="p-8">
						<div className="whitespace-pre-wrap leading-7 text-slate-700">
							{thread.body}
						</div>
					</div>
				</div>

				<CommentsSection
					threadId={thread.id}
					initialComments={thread.comments ?? []}
				/>
			</div>
		</main>
	);
}