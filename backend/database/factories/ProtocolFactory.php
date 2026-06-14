<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Protocol>
 */
class ProtocolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tagPool = ['nutrition','sleep','detox','meditation','fasting','breathwork',
                    'movement','herbalism','mindfulness','recovery','immunity','stress'];
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title'   => fake()->sentence(6),
            'content' => fake()->paragraphs(4, true),
            'tags'    => fake()->randomElements($tagPool, rand(2, 4)),
            'rating'  => 0, // recalculated after reviews
        ];
    }
}
