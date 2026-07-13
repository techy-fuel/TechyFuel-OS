<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FxRatesController extends Controller
{
    public function index()
    {
        $payload = Cache::remember('fx_rates', 3600, function () {
            $response = Http::timeout(5)->get('https://open.er-api.com/v6/latest/USD');
            abort_unless($response->successful() && $response->json('rates'), 502, 'Could not fetch FX rates');

            return ['base' => 'USD', 'rates' => $response->json('rates'), 'fetchedAt' => now()->getTimestampMs()];
        });

        return response()->json($payload);
    }

    public static function toPkr(float $amount, ?string $currency): float
    {
        if (! $amount) {
            return 0;
        }
        if (! $currency || $currency === 'PKR') {
            return $amount;
        }

        $rates = Cache::get('fx_rates')['rates'] ?? null;
        if (! $rates) {
            return 0;
        }

        $usd = $currency === 'USD' ? $amount : ($rates[$currency] ? $amount / $rates[$currency] : null);
        if ($usd === null) {
            return 0;
        }

        return $rates['PKR'] ? $usd * $rates['PKR'] : 0;
    }
}
