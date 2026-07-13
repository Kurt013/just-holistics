<?php

namespace App\Services;

use App\Repositories\CommentRepository;

class CommentService
{
    protected $commentRepository;
    /**
     * Create a new class instance.
     */
    public function __construct(CommentRepository $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function getTopThread($thread)
    {
        return $this->commentRepository->getTopThread($thread);
    }
}
