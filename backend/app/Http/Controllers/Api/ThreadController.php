<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Thread, Protocol};
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function index(Request $request)
    {
        $query = Thread::with('user', 'protocol');

        if ($request->filled('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        $query = match ($request->sort) {
            'most_recent'  => $query->latest(),
            'most_upvoted' => $query->orderByDesc('upvotes_count'),
            default        => $query->latest(),
        };

        return response()->json($query->paginate(15));
    }

    public function byProtocol(Protocol $protocol, Request $request)
    {
        $threads = $protocol->threads()
            ->with('user')
            ->withCount('comments')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return response()->json($threads);
    }

    public function store(Request $request, Protocol $protocol)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'body'    => 'required|string',
            'tags'    => 'nullable|array',
        ]);


        $thread = $protocol->threads()->create([
            'title'   => $validated['title'],
            'body'    => $validated['body'],
            'tags'    => $validated['tags'] ?? [],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($thread->load('user'), 201);
    }

    public function show(Thread $thread)
    {
        return response()->json(
            $thread->load([
                'user',
                'protocol',
                'comments.user',
                'comments.replies.user',
            ])
            ->loadCount('comments')
        );
    }

    public function update(Request $request, Thread $thread)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body'  => 'sometimes|string',
            'tags'  => 'nullable|array',
        ]);

        $thread->update([
            'title' => $validated['title'] ?? $thread->title,
            'body'  => $validated['body'] ?? $thread->body,
            'tags'  => $validated['tags'] ?? $thread->tags,
        ]);

        return response()->json($thread);
    }

    public function destroy(Thread $thread)
    {
        $thread->delete();
        return response()->json(null, 204);
    }
}