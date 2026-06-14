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

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        match ($request->sort) {
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
            ->paginate(15);

        return response()->json($threads);
    }

    public function store(Request $request, Protocol $protocol)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'body'    => 'required|string',
            'tags'    => 'nullable|array',
            'user_id' => 'required|exists:users,id',
        ]);

        $thread = $protocol->threads()->create($validated);

        return response()->json($thread->load('user'), 201);
    }

    public function show(Thread $thread)
    {
        return response()->json(
            $thread->load(['user', 'protocol', 'comments.user', 'comments.replies.user'])
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

        $thread->update($validated);
        return response()->json($thread);
    }

    public function destroy(Thread $thread)
    {
        $thread->delete();
        return response()->json(null, 204);
    }
}