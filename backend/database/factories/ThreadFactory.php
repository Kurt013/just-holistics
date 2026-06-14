<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use App\Models\Thread;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Thread>
 */
class ThreadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tagPool = ['question','experience','tips','results','beginner','advanced'];

        return [
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'protocol_id' => Protocol::query()->inRandomOrder()->value('id') ?? Protocol::factory(),
            'title' => fake()->sentence(8),
            'body' => fake()->paragraphs(3, true),
            'tags' => fake()->randomElements($tagPool, rand(1, 3)),
        ];
    }
}
