<?php
namespace Database\Seeders;

use App\Models\{User, Protocol, Thread, Comment, Review, Vote};
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create 5 users
        $users = User::factory(5)->create();

        // 2. Create 12 protocols
        $protocols = Protocol::factory(12)->create([
            'user_id' => fn() => $users->random()->id,
        ]);

        // 3. Create 10 threads (spread across protocols)
        $threads = Thread::factory(10)->create([
            'user_id'     => fn() => $users->random()->id,
            'protocol_id' => fn() => $protocols->random()->id,
        ]);

        // 4. Add comments on threads (top-level)
        $comments = collect();
        foreach ($threads as $thread) {
            $threadComments = Comment::factory(rand(2, 5))->create([
                'user_id'          => fn() => $users->random()->id,
                'commentable_id'   => $thread->id,
                'commentable_type' => Thread::class,
                'parent_id'        => null,
            ]);
            $comments = $comments->merge($threadComments);

            // Nested replies on some comments
            $threadComments->take(2)->each(function ($comment) use ($users, $thread) {
                Comment::factory(rand(1, 2))->create([
                    'user_id'          => fn() => $users->random()->id,
                    'commentable_id'   => $thread->id,
                    'commentable_type' => Thread::class,
                    'parent_id'        => $comment->id,
                ]);
            });
        }

        // 5. Create reviews for protocols (unique per user+protocol)
        foreach ($protocols as $protocol) {
            $reviewers = $users->random(rand(2, 4));
            foreach ($reviewers as $user) {
                Review::firstOrCreate(
                    ['user_id' => $user->id, 'protocol_id' => $protocol->id],
                    ['rating' => rand(1, 5), 'feedback' => fake()->optional()->paragraph()]
                );
            }
            $protocol->recalculateRating();
        }

        // 6. Create votes on threads and comments
        foreach ($threads as $thread) {
            $voters = $users->random(rand(2, 5));
            foreach ($voters as $user) {
                Vote::firstOrCreate(
                    ['user_id' => $user->id, 'votable_id' => $thread->id, 'votable_type' => Thread::class],
                    ['type'    => fake()->randomElement(['up', 'down'])]
                );
            }
            // Update counts
            $thread->update([
                'upvotes_count'   => $thread->votes()->where('type', 'up')->count(),
                'downvotes_count' => $thread->votes()->where('type', 'down')->count(),
            ]);
        }

        // 7. Index everything in Typesense
        Protocol::all()->searchable();
        Thread::all()->searchable();

        $this->command->info('✅ Database seeded and Typesense indexed!');
    }
}