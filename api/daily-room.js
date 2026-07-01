// Creates (or reuses) a Daily.co video room for a TechyFuel OS chat channel.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DAILY_API_KEY not configured on the server' });
  }

  const { roomName } = req.body || {};
  if (!roomName) {
    return res.status(400).json({ error: 'roomName is required' });
  }

  const dailyHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    // Reuse the room if it already exists.
    const existing = await fetch(`https://api.daily.co/v1/rooms/${encodeURIComponent(roomName)}`, {
      headers: dailyHeaders,
    });
    if (existing.ok) {
      const room = await existing.json();
      return res.status(200).json({ url: room.url });
    }

    // Otherwise create it (exp: auto-expire the room 4 hours after creation, private by default).
    const created = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: dailyHeaders,
      body: JSON.stringify({
        name: roomName,
        privacy: 'public',
        properties: {
          exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60,
          enable_chat: false,
          enable_screenshare: true,
          enable_recording: 'local',
          eject_at_room_exp: true,
        },
      }),
    });

    if (!created.ok) {
      const err = await created.json().catch(() => ({}));
      return res.status(created.status).json({ error: err.error || err.info || 'Could not create Daily room' });
    }

    const room = await created.json();
    return res.status(200).json({ url: room.url });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Daily API request failed' });
  }
}
