<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'votable_id', 'votable_type', 'type'];

    public function user()    { return $this->belongsTo(User::class); }
    public function votable() { return $this->morphTo(); }
}