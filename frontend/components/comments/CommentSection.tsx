"use client";

import { SyntheticEvent, useState } from "react";
import api from "@/lib/api";
import CommentItem from "./CommentItem";

export type Comment = {
	id: number;
	body: string;
	created_at: string;
	upvotes_count: number;
	downvotes_count: number;
	user?: {
		id?: number;
		name?: string;
	} | null;
	replies?: Comment[];
};

interface Props {
	threadId: string;
	initialComments: Comment[];
}

export default function CommentsSection({
	threadId,
	initialComments,
}: Props) {
	const [comments, setComments] =
		useState<Comment[]>(initialComments);

	const [body, setBody] = useState("");
	const [loading, setLoading] = useState(false);

	const refreshComments = async () => {
		try {
			const response = await api.get(
				`api/threads/${threadId}`
			);

			setComments(response.data.comments ?? []);
		} catch (err) {
			console.error(err);
		}
	};

	const submitComment = async (
		e: SyntheticEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		if (!body.trim()) return;

		try {
			setLoading(true);

			await api.post(
				`api/threads/${threadId}/comments`,
				{
					body,
				}
			);

			setBody("");

			await refreshComments();
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="mt-8">
			<h2 className="text-xl font-semibold mb-4">
				Comments ({comments.length})
			</h2>

			<form
				onSubmit={submitComment}
				className="bg-white rounded-2xl p-4 mb-6"
			>
				<textarea
					value={body}
					onChange={(e) =>
						setBody(e.target.value)
					}
					rows={4}
					placeholder="Write a comment..."
					className="w-full bg-slate-50 rounded-lg p-3 text-sm
					focus:outline-none focus:ring-2 focus:ring-green-500"
				/>

				<div className="mt-3 flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 rounded-lg bg-green-600 text-white
						hover:bg-green-700 disabled:opacity-50"
					>
						{loading
							? "Posting..."
							: "Post Comment"}
					</button>
				</div>
			</form>

			<div className="space-y-4">
				{comments.length === 0 ? (
					<div className="text-sm text-slate-500">
						No comments yet.
					</div>
				) : (
					comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							onReply={refreshComments}
							id={comment.user?.id}
						/>
					))
				)}
			</div>
		</section>
	);
}