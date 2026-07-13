<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use Illuminate\Http\Request;

class ProtocolController extends Controller
{
    public function index(Request $request)
    {
        $query = Protocol::with('user')
            ->withCount('reviews')
            ->withCount('threads');

        // Filter by title
        if ($request->filled('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        // Sorting
        match ($request->sort) {
            'most_recent'   => $query->latest(),
            'most_reviewed' => $query->orderByDesc('reviews_count'),
            'highest_rated' => $query->orderByDesc('rating'),
            default         => $query->latest(),
        };

        return response()->json($query->paginate(12));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'tags'    => 'nullable|array',
        ]);

        $protocol = Protocol::create([
            'title'   => $validated['title'],
            'content' => $validated['content'],
            'tags'    => $validated['tags'] ?? [],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($protocol->load('user'), 201);
    }

    public function show(Protocol $protocol)
    {
        return response()->json(
            $protocol->load(['user', 'reviews.user', 'threads.user'])
                     ->loadCount(['reviews', 'threads'])
        );
    }

    public function update(Request $request, Protocol $protocol)
    {
        $validated = $request->validate([
            'title'   => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'tags'    => 'nullable|array',
        ]);

        $protocol->update([
            'title'   => $validated['title'] ?? $protocol->title,
            'content' => $validated['content'] ?? $protocol->content,
            'tags'    => $validated['tags'] ?? $protocol->tags,
        ]);

        return response()->json($protocol);
    }

    public function destroy(Protocol $protocol)
    {
        $protocol->delete();
        return response()->json(null, 204);
    }
}