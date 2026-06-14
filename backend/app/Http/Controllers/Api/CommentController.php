<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Comment, Thread};
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function byThread(Thread $thread)
    {
        // Return only top-level comments; replies are nested inside
        $comments = $thread->comments()
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->whereNull('parent_id')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, Thread $thread)
    {
        $validated = $request->validate([
            'body'    => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $comment = $thread->comments()->create([
            'user_id'   => $validated['user_id'],
            'body'      => $validated['body'],
            'parent_id' => null,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function reply(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'body'    => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $reply = Comment::create([
            'user_id'          => $validated['user_id'],
            'body'             => $validated['body'],
            'parent_id'        => $comment->id,
            'commentable_id'   => $comment->commentable_id,
            'commentable_type' => $comment->commentable_type,
        ]);

        return response()->json($reply->load('user'), 201);
    }

    public function update(Request $request, Comment $comment)
    {
        $comment->update($request->validate(['body' => 'required|string']));
        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json(null, 204);
    }
}