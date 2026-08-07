const SOURCE = 'https://zerodha.com/ipo/';

export async function onRequestGet({ request }) {
  try {
    const indexHtml = await fetchHtml(SOURCE);
    const links = [...new Set([...indexHtml.matchAll(/href=["'](\/ipo\/\d+\/[^"'?#/]+\/?)["']/gi)].map(m => new URL(m[1], SOURCE).href))].slice(0, 40);
    if (!links.length) throw new Error('No IPO links found');

    const pages = await mapLimit(links, 6, async url => {
      try { return parseDetail(await fetchHtml(url), url); } catch { return null; }
    });
    const records = pages.filter(Boolean).filter(x => x.company && x.openDate && x.closeDate && x.priceBand && x.lotSize);
    if (!records.length) throw new Error('No valid IPO records');

    return json({ updatedAt: new Date().toISOString(), source: SOURCE, records }, 200, 900);
  } catch (error) {
    return json({ updatedAt: new Date().toISOString(), source: SOURCE, records: [], error: String(error.message || error) }, 502, 60);
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NIVECO-IPO/1.0)', 'Accept': 'text/html,application/xhtml+xml' }, cf: { cacheTtl: 900, cacheEverything: true } });
  if (!res.ok) throw new Error(`Source HTTP ${res.status}`);
  return res.text();
}

function text(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&#8377;|&order;rupee;/gi, '₹').replace(/\s+/g, ' ').trim();
}
function capture(t, re) { const m=t.match(re); return m ? m[1].trim() : ''; }
function isoDate(value) {
  if (!value) return '';
  const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
  const m=value.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\s+(\d{4})/);
  if (!m) return '';
  return `${m[3]}-${months[m[2].slice(0,3).toLowerCase()]}-${String(m[1]).padStart(2,'0')}`;
}
function parseDetail(html, url) {
  const t=text(html);
  const title=capture(t,/([^|]{2,120}?)\s+IPO(?:\s+details)?/i).replace(/^Apply for latest IPOs instantly\s*/i,'').trim();
  const dateRange=capture(t,/IPO date\s+(.{5,60}?)\s+Listing date/i);
  const dates=[...dateRange.matchAll(/\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9}\s+\d{4}/g)].map(x=>isoDate(x[0]));
  const listingDate=isoDate(capture(t,/Listing date\s+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9}\s+\d{4})/i));
  const priceBand=capture(t,/Price range\s+(₹\s*[\d,]+(?:\s*[–-]\s*₹?\s*[\d,]+)?)/i).replace(/\s+/g,' ');
  const lotSize=Number(capture(t,/Lot size\s+([\d,]+)/i).replace(/,/g,''))||null;
  const issueSize=Number(capture(t,/Issue size\s+([\d,.]+)\s*cr/i).replace(/,/g,''))||null;
  const statusText=capture(t,new RegExp(`${escapeRe(title)}\\s+IPO\\s+(Live|Upcoming|Closed|Listed)?\\s*(Mainboard|SME|SSE)?`,'i'));
  const type=/\bSME\b/i.test(t.slice(0,Math.min(t.length,800)))?'SME':'Mainboard';
  let status='upcoming'; const now=new Date().toISOString().slice(0,10);
  if (listingDate && now>=listingDate) status='listed'; else if(dates[0]&&dates[1]&&now>=dates[0]&&now<=dates[1]) status='current';
  return { id:url.split('/').filter(Boolean).slice(-2).join('-'), company:title, status, priceBand, lotSize, issueSize, subscription:null, gmp:null, issueType:type, registrar:'', openDate:dates[0]||'', closeDate:dates[1]||'', allotmentDate:'', listingDate, ipoSource:'Zerodha IPO calendar', sourceUrl:url };
}
function escapeRe(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
async function mapLimit(items, limit, fn){const out=[];let i=0;async function worker(){while(i<items.length){const n=i++;out[n]=await fn(items[n],n)}}await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return out}
function json(body,status,maxAge){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':`public, max-age=${maxAge}`,'access-control-allow-origin':'*'}})}
