const UPSTOX_BASE = 'https://api.upstox.com/v2';
const STATUSES = ['open', 'upcoming', 'closed', 'listed'];

function tokenFromEnv() {
  return process.env.UPSTOX_EXTENDED_TOKEN || process.env.UPSTOX_ACCESS_TOKEN || '';
}

function cleanCompanyName(name = '') {
  return String(name).replace(/\s+IPO$/i, '').trim();
}

function priceBand(min, max) {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  if (!lo && !hi) return 'TBA';
  if (!lo || lo === hi) return `₹${hi || lo}`;
  return `₹${lo}–₹${hi}`;
}

function mapStatus(status) {
  if (status === 'listed') return 'listed';
  if (status === 'upcoming') return 'upcoming';
  return 'current';
}

async function upstoxFetch(path, token) {
  const response = await fetch(`${UPSTOX_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.status === 'error') {
    const detail = body?.errors?.[0]?.message || body?.message || `HTTP ${response.status}`;
    throw new Error(detail);
  }
  return body;
}

async function listStatus(status, token) {
  const query = new URLSearchParams({
    status,
    page_number: '1',
    records: '30'
  });
  const body = await upstoxFetch(`/ipos?${query}`, token);
  return Array.isArray(body.data) ? body.data : [];
}

async function mapLimit(items, limit, worker) {
  const out = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      try {
        out[i] = await worker(items[i], i);
      } catch (error) {
        out[i] = { ...items[i], _detailError: error.message };
      }
    }
  });
  await Promise.all(runners);
  return out;
}

async function enrichRecord(base, token) {
  if (!base?.id) return base;
  const body = await upstoxFetch(`/ipos/${encodeURIComponent(base.id)}`, token);
  return body?.data ? { ...base, ...body.data } : base;
}

function normalizeIpo(x) {
  const timeline = x.timeline || {};
  const registrar = x.registrar_info || {};
  return {
    id: x.id || '',
    company: cleanCompanyName(x.name || ''),
    symbol: x.symbol || '',
    exchange: x.listing_exchange || '',
    status: mapStatus(x.status),
    sourceStatus: x.status || '',
    priceBand: priceBand(x.minimum_price, x.maximum_price),
    lotSize: Number(x.lot_size || x.minimum_quantity || 0),
    issueSize: Number(x.issue_size || 0) || null,
    subscription: Number(x.total_subscription || 0) || null,
    issueType: x.issue_type === 'sme' ? 'SME' : 'Mainboard',
    industry: x.industry || '',
    registrar: registrar.name || registrar.registrar || '',
    openDate: timeline.application_start_date || x.bidding_start_date || '',
    closeDate: timeline.application_end_date || x.bidding_end_date || '',
    allotmentDate: timeline.allotment_date || '',
    listingDate: timeline.listing_date || '',
    listingPrice: Number(x.listing_price || 0) || null,
    faceValue: Number(x.face_value || 0) || null,
    cutOffPrice: Number(x.cut_off_price || 0) || null,
    rhpUrl: x.rhp_url || '',
    drhpUrl: x.drhp_url || '',
    ipoSource: 'Upstox IPO API'
  };
}

function sortRecords(a, b) {
  const rank = { current: 0, upcoming: 1, listed: 2 };
  const ra = rank[a.status] ?? 9;
  const rb = rank[b.status] ?? 9;
  if (ra !== rb) return ra - rb;
  const da = a.openDate || a.listingDate || '9999-12-31';
  const db = b.openDate || b.listingDate || '9999-12-31';
  return da.localeCompare(db);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = tokenFromEnv();
  if (!token) {
    return res.status(503).json({
      error: 'Live IPO provider is not configured',
      code: 'UPSTOX_TOKEN_MISSING',
      records: []
    });
  }

  try {
    const groups = await Promise.all(STATUSES.map(status => listStatus(status, token)));
    const base = groups.flat();

    // Full detail calls add lot size, allotment/listing timeline and registrar.
    // Limit concurrency to stay friendly to the upstream service.
    const detailed = await mapLimit(base, 5, item => enrichRecord(item, token));
    const records = detailed.map(normalizeIpo).filter(x => x.company).sort(sortRecords);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return res.status(200).json({
      source: 'Upstox IPO API',
      updatedAt: new Date().toISOString(),
      records
    });
  } catch (error) {
    console.error('NIVECO live IPO sync failed:', error);
    return res.status(502).json({
      error: 'Unable to load live IPO data',
      detail: error.message,
      records: []
    });
  }
}
