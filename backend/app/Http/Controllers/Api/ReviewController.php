<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Review, Protocol};
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function byProtocol(Protocol $protocol)
    {
        return response()->json(
            $protocol->reviews()->with('user')->latest()->get()
        );
    }

    public function store(Request $request, Protocol $protocol)
    {
        $validated = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string',
        ]);

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'protocol_id' => $protocol->id],
            ['rating' => $validated['rating'], 'feedback' => $validated['feedback']]
        );

        // Recalculate protocol rating
        $protocol->recalculateRating();

        return response()->json($review->load('user'), 201);
    }
}