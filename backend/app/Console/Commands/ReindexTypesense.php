<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\{Protocol, Thread};

#[Signature('typesense:reindex')]
#[Description('Reindex all protocols and threads in Typesense')]
class ReindexTypesense extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Reindexing Protocols...');
        Protocol::all()->searchable();

        $this->info('Reindexing Threads...');
        Thread::all()->searchable();

        $this->info('✅ Done!');
    }
}
