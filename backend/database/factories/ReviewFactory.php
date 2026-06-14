<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'     => User::inRandomOrder()->first()?->id ?? User::factory(),
            'protocol_id' => Protocol::inRandomOrder()->first()?->id ?? Protocol::factory(),
            'rating'      => rand(1, 5),
            'feedback'    => fake()->optional(0.7)->paragraph(),
        ];
    }
}
