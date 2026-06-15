import ThreadCard, { Thread } from "@/components/threads/ThreadCard";
import api from "@/lib/api";


async function getThreads(id: string): Promise<Thread[] | null> {
	try {
		const response = await api.get(`api/protocols/${id}/threads`);

		if (!response.data.data) return null;

		return response.data.data as Thread[];
	} catch {
		return null;
	}
}

export default async function ThreadList({ protocolId }: { protocolId: string }) {
    const threads = await getThreads(protocolId);

    if (!threads) return <p className="text-sm text-slate-500">No discussions found for this protocol.</p>;

    return (
        <>
            <p className="pb-4">
                Explore discussions, questions, and shared experiences related to this protocol. Join the conversation or start a new thread to connect with others on their wellness journeys.
            </p>
            <div className="space-y-2">

                {threads.length === 0 ? (
                    <p className="text-sm text-slate-500">No discussions yet. Be the first to start a thread!</p>
                ) : (
                    threads.map((thread) => (
                        <ThreadCard key={thread.id} thread={thread} showProtocol={false} />
                    ))
                )}
            </div>
        </>
 
    );
}