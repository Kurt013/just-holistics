<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;

class Protocol extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'user_id', 'title', 'content', 'tags', 'rating',
        'upvotes_count', 'downvotes_count',
    ];

    protected $casts = [
        'tags'   => 'array',
        'rating' => 'float',
    ];

    // Relationships
    public function user()     { return $this->belongsTo(User::class); }
    public function threads()  { return $this->hasMany(Thread::class); }
    public function reviews()  { return $this->hasMany(Review::class); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }

    // Typesense: which fields to index
    public function toSearchableArray(): array
    {
        return [
            'id'             => (string) $this->id,
            'author'         => $this->user?->name ?? '',
            'title'          => $this->title,
            'tags'           => $this->tags ?? [],
            'rating'         => (float) $this->rating,
            'upvotes_count'  => (int) $this->upvotes_count,
            'created_at'     => $this->created_at->timestamp,
        ];
    }

    // Typesense schema definition
    public function typesenseCollectionSchema(): array
    {
        return [
            'name'   => $this->searchableAs(),
            'fields' => [
                ['name' => 'id',            'type' => 'string'],
                ['name' => 'author',        'type' => 'string'],
                ['name' => 'title',         'type' => 'string'],
                ['name' => 'tags',          'type' => 'string[]', 'facet' => true],
                ['name' => 'rating',        'type' => 'float',    'facet' => true],
                ['name' => 'upvotes_count', 'type' => 'int32'],
                ['name' => 'created_at',    'type' => 'int64',    'facet' => true],
            ],
            'default_sorting_field' => 'created_at',
        ];
    }

    public function searchableAs(): string
    {
        return 'protocols';
    }

    // Recompute rating from reviews
    public function recalculateRating(): void
    {
        $avg = $this->reviews()->avg('rating') ?? 0;
        $this->update(['rating' => round($avg, 2)]);
    }
}