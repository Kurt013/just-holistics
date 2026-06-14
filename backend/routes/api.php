<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\{
    ProtocolController, ThreadController, CommentController,
    ReviewController, VoteController, SearchController
};


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Protocols
Route::apiResource('protocols', ProtocolController::class);

// Threads (nested under protocols for creation, standalone for others)
Route::get('protocols/{protocol}/threads',      [ThreadController::class, 'byProtocol']);
Route::post('protocols/{protocol}/threads',     [ThreadController::class, 'store']);
Route::apiResource('threads', ThreadController::class)->except(['store']);

// Comments
Route::post('threads/{thread}/comments',             [CommentController::class, 'store']);
Route::post('comments/{comment}/replies',            [CommentController::class, 'reply']);
Route::get('threads/{thread}/comments',              [CommentController::class, 'byThread']);
Route::apiResource('comments', CommentController::class)->only(['update', 'destroy']);

// Reviews
Route::post('protocols/{protocol}/reviews', [ReviewController::class, 'store']);
Route::get('protocols/{protocol}/reviews',  [ReviewController::class, 'byProtocol']);

// Votes
Route::post('threads/{thread}/vote',   [VoteController::class, 'voteThread']);
Route::post('comments/{comment}/vote', [VoteController::class, 'voteComment']);

// Search
Route::get('search/protocols', [SearchController::class, 'protocols']);
Route::get('search/threads',   [SearchController::class, 'threads']);