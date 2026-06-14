<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Vote, Thread, Comment};
use Illuminate\Http\Request;

class VoteController extends Controller
{
    private function processVote(Request $request, $model): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type'    => 'required|in:up,down',
        ]);

        $existing = Vote::where([
            'user_id'      => $request->user_id,
            'votable_id'   => $model->id,
            'votable_type' => get_class($model),
        ])->first();

        if ($existing) {
            if ($existing->type === $request->type) {
                // Undo vote (toggle off)
                $existing->delete();
                $action = 'removed';
            } else {
                // Flip vote
                $existing->update(['type' => $request->type]);
                $action = 'changed';
            }
        } else {
            Vote::create([
                'user_id'      => $request->user_id,
                'votable_id'   => $model->id,
                'votable_type' => get_class($model),
                'type'         => $request->type,
            ]);
            $action = 'added';
        }

        // Refresh counts
        $model->update([
            'upvotes_count'   => $model->votes()->where('type', 'up')->count(),
            'downvotes_count' => $model->votes()->where('type', 'down')->count(),
        ]);

        return response()->json([
            'action'          => $action,
            'upvotes_count'   => $model->fresh()->upvotes_count,
            'downvotes_count' => $model->fresh()->downvotes_count,
        ]);
    }

    public function voteThread(Request $request, Thread $thread)
    {
        return $this->processVote($request, $thread);
    }

    public function voteComment(Request $request, Comment $comment)
    {
        return $this->processVote($request, $comment);
    }
}