<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class TypesenseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(TypesenseClient::class, function () {
            return new TypesenseClient([
                'api_key' => config('scout.typesense.client-settings.api_key'),
                'nodes'   => config('scout.typesense.client-settings.nodes'),
                'connection_timeout_seconds' => 2,
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
