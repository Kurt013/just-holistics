<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Protocol, Thread};
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function protocols(Request $request)
    {
        $query   = $request->get('q', '');
        $sortBy  = $request->get('sort', 'created_at:desc');
        $page    = $request->get('page', 1);
        $perPage = $request->get('per_page', 12);

        $sortMap = [
            'most_recent'   => 'created_at:desc',
            'highest_rated' => 'rating:desc',
            'most_upvoted'  => 'upvotes_count:desc',
        ];

        $sortField = $sortMap[$sortBy] ?? 'created_at:desc';

        if (empty($query)) {
            // No query — use Scout's default search (*) 
            $results = Protocol::search('*')
                ->orderBy(explode(':', $sortField)[0], explode(':', $sortField)[1])
                ->paginate($perPage, 'page', $page);
        } else {
            $results = Protocol::search($query)
                ->orderBy(explode(':', $sortField)[0], explode(':', $sortField)[1])
                ->paginate($perPage, 'page', $page);
        }

        return response()->json($results);
    }

    public function threads(Request $request)
    {
        $query   = $request->get('q', '');
        $sortBy  = $request->get('sort', 'created_at:desc');
        $page    = $request->get('page', 1);
        $perPage = $request->get('per_page', 15);

        $sortMap = [
            'most_recent'  => 'created_at:desc',
            'most_upvoted' => 'upvotes_count:desc',
        ];

        $sortField = $sortMap[$sortBy] ?? 'created_at:desc';

        if (empty($query)) {
            $results = Thread::search('*')
                ->orderBy(explode(':', $sortField)[0], explode(':', $sortField)[1])
                ->paginate($perPage, 'page', $page);
        } else {
            $results = Thread::search($query)
                ->orderBy(explode(':', $sortField)[0], explode(':', $sortField)[1])
                ->paginate($perPage, 'page', $page);
        }

        return response()->json($results);
    }
}