<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


use App\Http\Controllers\Api\{
    ProtocolController, ThreadController, CommentController,
    ReviewController, VoteController, SearchController, AuthController
};

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::middleware('auth:sanctum')->group(function () {
    // Protocols write
    Route::apiResource('protocols', ProtocolController::class)
        ->except(['index', 'show']);

    // Threads write
    Route::post('protocols/{protocol}/threads', [ThreadController::class, 'store']);
    Route::apiResource('threads', ThreadController::class)
        ->except(['index', 'show', 'store']);

    // Comments write
    Route::post('threads/{thread}/comments', [CommentController::class, 'store']);
    Route::post('comments/{comment}/replies', [CommentController::class, 'reply']);
    Route::apiResource('comments', CommentController::class)
        ->only(['update', 'destroy']);

    // Reviews write
    Route::post('protocols/{protocol}/reviews', [ReviewController::class, 'store']);

    // Votes
    Route::post('threads/{thread}/vote', [VoteController::class, 'voteThread']);
    Route::post('comments/{comment}/vote', [VoteController::class, 'voteComment']);
});

// Protocols (read)
Route::get('protocols', [ProtocolController::class, 'index']);
Route::get('protocols/{protocol}', [ProtocolController::class, 'show']);

// Threads (read)
Route::get('threads', [ThreadController::class, 'index']);
Route::get('threads/{thread}', [ThreadController::class, 'show']);

Route::get('protocols/{protocol}/threads', [ThreadController::class, 'byProtocol']);

// Comments (read)
Route::get('threads/{thread}/comments', [CommentController::class, 'byThread']);

// Reviews (read)
Route::get('protocols/{protocol}/reviews', [ReviewController::class, 'byProtocol']);

// Search
Route::get('search/protocols', [SearchController::class, 'protocols']);
Route::get('search/threads', [SearchController::class, 'threads']);