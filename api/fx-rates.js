// Live currency conversion rates for Finance invoices (multi-currency agencies —
// clients pay in USD, PKR, SAR, OMR, etc). Free, no-key upstream, refreshed a
// few times a day — cached at the edge so we don't hammer the upstream API on
// every invoice render.
let cache = { rates: null, base: 'USD', fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {
  const now = Date.now();

  if (!cache.rates || now - cache.fetchedAt > TTL_MS) {
    try {
      const upstream = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!upstream.ok) throw new Error('Upstream FX API returned ' + upstream.status);
      const data = await upstream.json();
      if (!data.rates) throw new Error('Upstream FX API response missing rates');
      cache = { rates: data.rates, base: 'USD', fetchedAt: now };
    } catch (err) {
      // Upstream hiccup — serve the last good rates if we have them instead of failing.
      if (!cache.rates) {
        return res.status(502).json({ error: err.message || 'Could not fetch FX rates' });
      }
    }
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json({ base: cache.base, rates: cache.rates, fetchedAt: cache.fetchedAt });
}
