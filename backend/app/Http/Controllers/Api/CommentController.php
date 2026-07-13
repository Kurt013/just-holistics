<?php
namespace App\Http\Controllers\Api;

use App\Services\CommentService;

use App\Http\Requests\CommentRequest;

use App\Http\Controllers\Controller;
use App\Models\{Comment, Thread};
use Illuminate\Http\Request;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function byThread(Thread $thread)
    {
        $comments = $this->commentService->getTopThread($thread);

        return response()->json($comments);
    }

    public function store(CommentRequest $request, Thread $thread)
    {
        $comment = $thread->comments()->create([
            'user_id'   => $request->user()->id,
            'body'      => $request->validated('body'),
            'parent_id' => null,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function reply(CommentRequest $request, Comment $comment)
    {
        $reply = Comment::create([
            'user_id'          => $request->user()->id,
            'body'             => $request->validated('body'),
            'parent_id'        => $comment->id,
            'commentable_id'   => $comment->commentable_id,
            'commentable_type' => $comment->commentable_type,
        ]);

        return response()->json($reply->load('user'), 201);
    }

    public function update(CommentRequest $request, Comment $comment)
    {
        $comment->update($request->validated());
        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json(null, 204);
    }
}