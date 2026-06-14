<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;

class Thread extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'user_id', 'protocol_id', 'title', 'body', 'tags',
        'upvotes_count', 'downvotes_count',
    ];

    protected $casts = ['tags' => 'array'];

    public function user()     { return $this->belongsTo(User::class); }
    public function protocol() { return $this->belongsTo(Protocol::class); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
    public function votes()    { return $this->morphMany(Vote::class, 'votable'); }

    public function toSearchableArray(): array
    {
        return [
            'id'             => (string) $this->id,
            'title'          => $this->title,
            'body'           => $this->body,
            'tags'           => $this->tags ?? [],
            'upvotes_count'  => (int) $this->upvotes_count,
            'created_at'     => $this->created_at->timestamp,
        ];
    }

    public function typesenseCollectionSchema(): array
    {
        return [
            'name'   => $this->searchableAs(),
            'fields' => [
                ['name' => 'id',            'type' => 'string'],
                ['name' => 'title',         'type' => 'string'],
                ['name' => 'body',          'type' => 'string'],
                ['name' => 'tags',          'type' => 'string[]', 'facet' => true],
                ['name' => 'upvotes_count', 'type' => 'int32'],
                ['name' => 'created_at',    'type' => 'int64',    'facet' => true],
            ],
            'default_sorting_field' => 'created_at',
        ];
    }

    public function searchableAs(): string { return 'threads'; }
}