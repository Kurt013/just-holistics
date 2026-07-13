<?php

namespace App\Repositories;

use App\Models\Comment;

class CommentRepository
{
    public function getTopThread($thread) {
    // Return only top-level comments; replies are nested inside
        $comments = $thread->comments()
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->whereNull('parent_id')
            ->latest()
            ->get();

        return $comments;
    }
}
