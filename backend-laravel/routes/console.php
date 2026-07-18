<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Replaces the Vercel Cron job at api/recurring-run.js (was 0 4 * * *).
// Requires the Laravel scheduler itself to be running — see
// deploy/crontab.txt for the one line that drives it in production.
Schedule::command('techyfuel:run-recurring')->dailyAt('04:00');

Schedule::command('techyfuel:publish-scheduled')->everyMinute();
