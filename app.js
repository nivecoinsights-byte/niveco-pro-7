'use strict';
const $=id=>document.getElementById(id);
const STORAGE={ipos:'niveco60_ipos',watch:'niveco60_watch',theme:'niveco60_theme',auth:'niveco60_auth',lang:'niveco60_lang',lastSync:'niveco60_last_sync',gmpSync:'niveco60_gmp_sync',cleaned:'niveco60_cleaned',remoteUrl:'niveco61_remote_csv',autoSync:'niveco61_auto_sync',remoteSync:'niveco61_remote_sync'};
const LEGACY_STORAGE={ipos:['niveco57_ipos','niveco51_ipos','niveco41_ipos'],watch:['niveco57_watch','niveco51_watch','niveco41_watch'],theme:['niveco57_theme','niveco51_theme','niveco41_theme'],lang:['niveco57_lang','niveco51_lang'],lastSync:['niveco57_last_sync']};
const ADMIN_EMAILS=['nivecoinsights@gmail.com','admin@nivecoinsights.com'];
const ADMIN_PASSWORD='Niveco@2026';
const seed=[];
let ipos=loadFirst([STORAGE.ipos,...LEGACY_STORAGE.ipos],seed),watch=loadFirst([STORAGE.watch,...LEGACY_STORAGE.watch],[]),route='home',ipoFilter='all',homeFilter='open',calendarDate=new Date(),selectedDate='',lang=loadTextFirst([STORAGE.lang,...LEGACY_STORAGE.lang],'en');

const I18N={
 en:{
  home:'Home',ipoList:'IPO List',watchlist:'Watchlist',ipoCalendar:'IPO Calendar',ipoCalculator:'IPO Calculator',adminPanel:'Admin Panel',exportBackup:'Export Backup',importBackup:'Import Backup',manage:'MANAGE',currentUpcoming:'Current & Upcoming',listed:'Listed',searchCompany:'Search IPO company…',liveRecords:n=>`${n} IPO record${n===1?'':'s'}`,exploreIpos:'EXPLORE IPOs',allIpos:'All IPOs',all:'All',current:'Current',upcoming:'Upcoming',mainboard:'Mainboard',sme:'SME',importantDates:'IMPORTANT DATES',selectDate:'Select a highlighted date.',estimateReturns:'ESTIMATE RETURNS',issuePrice:'Issue price',expectedListingPrice:'Expected listing price',lotSize:'Lot size',numberLots:'Number of lots',calculate:'Calculate',investment:'Investment',estimatedProfit:'Estimated Profit',return:'Return',myPicks:'MY PICKS',clearAll:'Clear all',secureAdmin:'SECURE ADMIN',adminLogin:'Admin Login',authorizedCredentials:'Use the authorized NIVECO credentials.',email:'Email',password:'Password',login:'Login',manageData:'MANAGE DATA',adminDashboard:'Admin Dashboard',logout:'Logout',addEditIpo:'Add / Edit IPO',company:'Company',status:'Status',priceBand:'Price band',gmp:'GMP (₹)',issueSize:'Issue size (₹ Cr)',subscriptionTimes:'Subscription (times)',issueType:'Issue type',registrar:'Registrar',gmpSource:'GMP source',gmpUpdated:'GMP updated',unofficialGmp:'Unofficial GMP',openDate:'Open date',closeDate:'Close date',allotmentDate:'Allotment date',listingDate:'Listing date',saveIpo:'Save IPO',reset:'Reset',importIpoData:'Import IPO Data',csvHelp:'Upload CSV. The template includes allotment date, listing date, issue size and subscription.',uploadCsv:'Upload CSV',downloadTemplate:'Download Template',existingRecords:'Existing IPO Records',ipos:'IPOs',calendar:'Calendar',calc:'Calc',more:'More',offer:'Offer',offerPrice:'Offer Price',premium:'GMP / Premium',allotment:'Allotment',share:'Share',watch:'Watch',saved:'Saved',live:'Live',noMatching:'No matching IPO records.',watchEmpty:'Your watchlist is empty.',opens:'Opens',closes:'Closes',listing:'Listing',noEvent:'No IPO event on this date.',edit:'Edit',delete:'Delete',deleteConfirm:'Delete this IPO record?',deleted:'IPO deleted',addedWatch:'Added to watchlist',removedWatch:'Removed from watchlist',copied:'IPO details copied',refreshed:'Data refreshed',watchCleared:'Watchlist cleared',loginSuccess:'Admin login successful',incorrectLogin:'Incorrect email or password.',loggedOut:'Logged out',companyRequired:'Company name is required',ipoSaved:'IPO saved',chooseCsv:'Choose a CSV file first.',noRows:'No data rows found',recordsImported:n=>`${n} IPO record(s) imported.`,csvComplete:'CSV import completed',csvError:'CSV error: ',backupImported:'Backup imported',invalidBackup:'Invalid backup file',theme:'Toggle theme',openMenu:'Open menu',closeMenu:'Close menu',openCalendar:'Open calendar',refresh:'Refresh',light:'Light',dark:'Dark',autoSync:'Saved on this device',syncing:'Refreshing saved IPO data…',syncDone:'IPO list refreshed',syncFailed:'Showing saved data',lastUpdated:'Last updated'
 },
 gu:{
  home:'હોમ',ipoList:'IPO યાદી',watchlist:'વૉચલિસ્ટ',ipoCalendar:'IPO કેલેન્ડર',ipoCalculator:'IPO કેલ્ક્યુલેટર',adminPanel:'એડમિન પેનલ',exportBackup:'બેકઅપ નિકાસ',importBackup:'બેકઅપ આયાત',manage:'વ્યવસ્થાપન',currentUpcoming:'ચાલુ અને આગામી',listed:'લિસ્ટેડ',searchCompany:'IPO કંપની શોધો…',liveRecords:n=>`${n} IPO રેકોર્ડ`,exploreIpos:'IPO શોધો',allIpos:'બધા IPO',all:'બધા',current:'ચાલુ',upcoming:'આગામી',mainboard:'મેઇનબોર્ડ',sme:'SME',importantDates:'મહત્વની તારીખો',selectDate:'હાઇલાઇટ કરેલી તારીખ પસંદ કરો.',estimateReturns:'અંદાજિત વળતર',issuePrice:'ઇશ્યૂ કિંમત',expectedListingPrice:'અંદાજિત લિસ્ટિંગ કિંમત',lotSize:'લોટ સાઇઝ',numberLots:'લોટની સંખ્યા',calculate:'ગણતરી કરો',investment:'રોકાણ',estimatedProfit:'અંદાજિત નફો',return:'વળતર',myPicks:'મારી પસંદગી',clearAll:'બધું દૂર કરો',secureAdmin:'સુરક્ષિત એડમિન',adminLogin:'એડમિન લૉગિન',authorizedCredentials:'અધિકૃત NIVECO ઓળખપત્રોનો ઉપયોગ કરો.',email:'ઈમેલ',password:'પાસવર્ડ',login:'લૉગિન',manageData:'ડેટા વ્યવસ્થાપન',adminDashboard:'એડમિન ડેશબોર્ડ',logout:'લૉગઆઉટ',addEditIpo:'IPO ઉમેરો / સુધારો',company:'કંપની',status:'સ્થિતિ',priceBand:'પ્રાઇસ બેન્ડ',gmp:'GMP (₹)',issueSize:'ઇશ્યૂ સાઇઝ (₹ કરોડ)',subscriptionTimes:'સબ્સ્ક્રિપ્શન (ગણું)',issueType:'ઇશ્યૂ પ્રકાર',registrar:'રજિસ્ટ્રાર',gmpSource:'GMP સ્રોત',gmpUpdated:'GMP અપડેટ',unofficialGmp:'અનધિકૃત GMP',openDate:'ખુલવાની તારીખ',closeDate:'બંધ થવાની તારીખ',allotmentDate:'એલોટમેન્ટ તારીખ',listingDate:'લિસ્ટિંગ તારીખ',saveIpo:'IPO સેવ કરો',reset:'રીસેટ',importIpoData:'IPO ડેટા આયાત',csvHelp:'CSV અપલોડ કરો. ટેમ્પલેટમાં એલોટમેન્ટ, લિસ્ટિંગ, ઇશ્યૂ સાઇઝ અને સબ્સ્ક્રિપ્શન સામેલ છે.',uploadCsv:'CSV અપલોડ કરો',downloadTemplate:'ટેમ્પલેટ ડાઉનલોડ',existingRecords:'હાલના IPO રેકોર્ડ',ipos:'IPO',calendar:'કેલેન્ડર',calc:'કેલ્ક્યુલેટર',more:'વધુ',offer:'ઓફર',offerPrice:'ઓફર કિંમત',premium:'GMP / પ્રીમિયમ',allotment:'એલોટમેન્ટ',share:'શેર',watch:'વૉચ',saved:'સેવ થયેલ',live:'લાઇવ',noMatching:'મેળ ખાતો IPO રેકોર્ડ મળ્યો નથી.',watchEmpty:'તમારી વૉચલિસ્ટ ખાલી છે.',opens:'ખુલે છે',closes:'બંધ થાય છે',listing:'લિસ્ટિંગ',noEvent:'આ તારીખે કોઈ IPO ઇવેન્ટ નથી.',edit:'સુધારો',delete:'ડિલીટ',deleteConfirm:'આ IPO રેકોર્ડ ડિલીટ કરવો છે?',deleted:'IPO ડિલીટ થયો',addedWatch:'વૉચલિસ્ટમાં ઉમેર્યું',removedWatch:'વૉચલિસ્ટમાંથી દૂર કર્યું',copied:'IPO વિગતો કૉપી થઈ',refreshed:'ડેટા રિફ્રેશ થયો',watchCleared:'વૉચલિસ્ટ સાફ થઈ',loginSuccess:'એડમિન લૉગિન સફળ',incorrectLogin:'ઈમેલ અથવા પાસવર્ડ ખોટો છે.',loggedOut:'લૉગઆઉટ થયું',companyRequired:'કંપનીનું નામ જરૂરી છે',ipoSaved:'IPO સેવ થયો',chooseCsv:'પહેલા CSV ફાઇલ પસંદ કરો.',noRows:'ડેટાની કોઈ પંક્તિ મળી નથી',recordsImported:n=>`${n} IPO રેકોર્ડ આયાત થયા.`,csvComplete:'CSV આયાત પૂર્ણ થઈ',csvError:'CSV ભૂલ: ',backupImported:'બેકઅપ આયાત થયો',invalidBackup:'અમાન્ય બેકઅપ ફાઇલ',theme:'થીમ બદલો',openMenu:'મેનુ ખોલો',closeMenu:'મેનુ બંધ કરો',openCalendar:'કેલેન્ડર ખોલો',refresh:'રિફ્રેશ',light:'લાઇટ',dark:'ડાર્ક',autoSync:'આ ઉપકરણમાં સેવ થયેલો ડેટા',syncing:'સેવ થયેલી IPO યાદી રિફ્રેશ થઈ રહી છે…',syncDone:'IPO યાદી રિફ્રેશ થઈ',syncFailed:'સેવ કરેલો ડેટા બતાવેલ છે',lastUpdated:'છેલ્લું અપડેટ'
 }
};
function t(key,...args){const v=(I18N[lang]&&I18N[lang][key])??I18N.en[key]??key;return typeof v==='function'?v(...args):v}
function setLabel(id,text){const el=$(id);if(!el)return;const label=el.closest('label');if(label&&label.firstChild)label.firstChild.nodeValue=text}

const API_BASE='';
const FIREBASE_PROJECT_ID=(window.NIVECO_CONFIG&&window.NIVECO_CONFIG.firebaseProjectId)||'niveco-insights-4254b';
const FIRESTORE_URL=`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/ipos`;

const IPO_FEED_URLS=['firestore','/api/ipos','./data/ipos.json'];
const GMP_FEED_URLS=[];

function isCompleteIpo(x){return Boolean(x&&x.company&&x.openDate&&x.closeDate&&x.priceBand&&Number(x.lotSize)>0)}
function normalizeStatusByDate(x){
 const today=new Date();today.setHours(0,0,0,0);
 const open=x.openDate?new Date(x.openDate+'T00:00:00'):null,close=x.closeDate?new Date(x.closeDate+'T23:59:59'):null,listing=x.listingDate?new Date(x.listingDate+'T00:00:00'):null;
 if(listing&&today>=listing)return 'listed';
 if(open&&today<open)return 'upcoming';
 if(open&&close&&today>=open&&today<=close)return 'current';
 return x.status||'upcoming';
}
function companyKey(v){return String(v||'').toLowerCase().replace(/\b(limited|ltd|pvt|private|technologies|technology|industries|industry|india)\b/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function stableId(name){return companyKey(name).replace(/\s+/g,'-')||'ipo'}
function hasCoreIpoData(x){
 const priceNums=String(x.priceBand||'').match(/\d[\d,]*/g)||[];
 return Boolean(x.company&&x.openDate&&x.closeDate&&priceNums.length&&Number(x.lotSize)>0);
}
function isLikelyIpo(x){
 const name=String(x.company||'').toLowerCase();
 return !/rights issue|right issue|reit|inv(it|it)|bond|ncd|buyback/.test(name);
}
function normalizeUnknowns(x){
 const y={...x};
 if(!(Number(y.lotSize)>0))y.lotSize=null;
 if(!(Number(y.issueSize)>0))y.issueSize=null;
 if(!(Number(y.subscription)>0))y.subscription=null;
 if(y.gmp===0&&!y.gmpSource)y.gmp=null;
 return y;
}
function mergeLiveRecords(records){
 const byKey=new Map(ipos.map(x=>[companyKey(x.company),normalizeUnknowns(x)]));
 records.forEach(raw=>{
  if(!raw.company||!isLikelyIpo(raw))return;
  const key=companyKey(raw.company),old=byKey.get(key);
  // A new auto-discovered record is added only after mandatory IPO details are present.
  if(!old&&!hasCoreIpoData(raw))return;
  const merged=normalizeUnknowns({...old,...raw,id:old?.id||raw.id||stableId(raw.company)});
  merged.status=normalizeStatusByDate(merged);byKey.set(key,merged);
 });
 ipos=[...byKey.values()].filter(isLikelyIpo).sort((a,b)=>(a.openDate||'9999').localeCompare(b.openDate||'9999'));persist();
}
function parseDateRange(text){
 const clean=String(text).replace(/\*/g,'').replace(/\s+/g,' ').trim();
 const months={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
 const hits=[...clean.matchAll(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Z][a-z]{2})\s+(\d{4})/g)];if(hits.length<2)return null;
 const iso=h=>`${h[3]}-${String(months[h[2]]).padStart(2,'0')}-${String(h[1]).padStart(2,'0')}`;return [iso(hits[0]),iso(hits[1])];
}
function cleanMarkdown(v){return String(v).replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/`|\*/g,'').trim()}
function parseZerodhaMarkdown(text){
 let section='';const out=[];for(const raw of String(text).split(/\r?\n/)){const line=raw.trim();
  if(/^##\s+Live IPOs/i.test(line)){section='current';continue}if(/^##\s+Upcoming IPOs/i.test(line)){section='upcoming';continue}if(/^##\s+(Closed IPOs|Recently listed)/i.test(line)){section='listed';continue}
  if(!section||!line.startsWith('|')||!line.includes('₹'))continue;const cells=line.split('|').map(cleanMarkdown).filter(Boolean);if(cells.length<4||cells.some(c=>/^---/.test(c)))continue;
  const info=cells.find(c=>/\b(Mainboard|SME|SSE)\b/.test(c)),dateCell=cells.find(c=>/\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]{2}\s+\d{4}/.test(c)&&/[–-]/.test(c)),price=cells.find(c=>/₹/.test(c)&&!/date/i.test(c));if(!info||!dateCell||!price)continue;
  const m=info.match(/^([A-Z0-9]+)\s+(Mainboard|SME|SSE)\s+(.+)$/i);if(!m)continue;const dates=parseDateRange(dateCell);if(!dates)continue;
  const listingCell=cells.find(c=>/\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}/.test(c)&&c!==dateCell),listingMatch=listingCell&&listingCell.match(/(\d{1,2})\s+([A-Z][a-z]{2})\s+(\d{4})/);const monthMap={Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};const listingDate=listingMatch?`${listingMatch[3]}-${monthMap[listingMatch[2]]}-${String(listingMatch[1]).padStart(2,'0')}`:'';
  out.push({company:m[3].trim(),status:section,priceBand:price.replace(/\s+/g,''),issueType:m[2].toUpperCase()==='SME'?'SME':'Mainboard',openDate:dates[0],closeDate:dates[1],listingDate,ipoSource:'Zerodha IPO calendar'});
 }return out;
}
function parseGmpMarkdown(text,sourceName){
 const rows=[];for(const raw of String(text).split(/\r?\n/)){const line=raw.trim();if(!line.startsWith('|')||!/₹|\bGMP\b/i.test(line))continue;const cells=line.split('|').map(cleanMarkdown).filter(Boolean);if(cells.length<2||cells.some(c=>/^---/.test(c)))continue;
  const companyCell=cells.find(c=>/[A-Za-z]{3}/.test(c)&&!/GMP|Updated|Date|Price|Estimate|Listing|IPO Name/i.test(c));if(!companyCell)continue;const gmpCell=cells.find(c=>/₹\s*[+-]?\d/.test(c));const gmpMatch=gmpCell&&gmpCell.match(/₹\s*([+-]?\d[\d,]*(?:\.\d+)?)/);if(!gmpMatch)continue;
  rows.push({company:companyCell.replace(/\s+IPO.*$/i,'').trim(),gmp:Number(gmpMatch[1].replace(/,/g,'')),gmpSource:sourceName,gmpUpdatedAt:new Date().toISOString(),gmpUnofficial:true});
 }return rows;
}
function updateSyncText(state,when){const el=$('syncText');if(!el)return;if(state==='loading')el.textContent=t('syncing');else if(state==='error')el.textContent=t('syncFailed');else if(when)el.textContent=`${t('lastUpdated')}: ${new Date(when).toLocaleString(lang==='gu'?'gu-IN':'en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}`;else el.textContent=t('autoSync')}
async function fetchText(url,timeout=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);try{const res=await fetch(url,{cache:'no-store',signal:controller.signal});if(!res.ok)throw new Error('HTTP '+res.status);return {text:await res.text(),type:res.headers.get('content-type')||''}}finally{clearTimeout(timer)}}
function firestoreValue(v){
 if(!v||typeof v!=='object')return null;
 if('stringValue' in v)return v.stringValue;
 if('integerValue' in v)return Number(v.integerValue);
 if('doubleValue' in v)return Number(v.doubleValue);
 if('booleanValue' in v)return Boolean(v.booleanValue);
 if('timestampValue' in v)return v.timestampValue;
 if('nullValue' in v)return null;
 return null;
}
function firestoreDocumentToIpo(doc){
 const f=doc.fields||{},get=k=>firestoreValue(f[k]);
 const company=get('company')||get('Company')||'';
 return normalizeUnknowns({
  id:(doc.name||'').split('/').pop()||stableId(company),company,
  exchange:get('exchange')||get('Exchange')||'',
  status:String(get('status')||get('Status')||'upcoming').toLowerCase(),
  priceBand:get('priceBand')||get('priceband')||get('PriceBand')||'TBA',
  lotSize:Number(get('lotSize')||get('lotsize')||0),
  gmp:Number(get('gmp')||0)||null,
  issueSize:Number(get('issueSize')||0)||null,
  subscription:Number(get('subscription')||0)||null,
  issueType:/sme/i.test(String(get('issueType')||''))?'SME':'Mainboard',
  registrar:get('registrar')||'',
  openDate:get('openDate')||'',closeDate:get('closeDate')||'',
  allotmentDate:get('allotmentDate')||'',listingDate:get('listingDate')||'',
  ipoSource:'Firebase Firestore'
 });
}
async function fetchFirestoreIpos(){
 const res=await fetch(FIRESTORE_URL,{cache:'no-store'});
 if(!res.ok)throw new Error('Firestore HTTP '+res.status);
 const data=await res.json();
 const records=(data.documents||[]).map(firestoreDocumentToIpo).filter(x=>x.company);
 if(!records.length)throw new Error('No Firestore IPO records');
 return {records,updatedAt:new Date().toISOString()};
}
async function syncIpoList(){
 for(const url of IPO_FEED_URLS){
  try{
   let records=[],updatedAt=new Date().toISOString();
   if(url==='firestore'){
    const data=await fetchFirestoreIpos();records=data.records;updatedAt=data.updatedAt;
   }else{
    const {text,type}=await fetchText(url);
    if(type.includes('json')||url.endsWith('.json')){const data=JSON.parse(text);records=Array.isArray(data)?data:(data.records||[]);updatedAt=data.updatedAt||updatedAt}else records=parseZerodhaMarkdown(text);
   }
   if(!records.length)throw new Error('No IPO records');
   mergeLiveRecords(records);return {ok:true,updatedAt};
  }catch(e){console.warn('IPO source failed',url,e.message)}
 }
 return {ok:false};
}

function applyStaticTranslations(){
 document.documentElement.lang=lang==='gu'?'gu':'en';
 $('langBtn').textContent=lang==='gu'?'English':'ગુજરાતી';
 const drawerKeys=['home','ipoList','watchlist','ipoCalendar','ipoCalculator','adminPanel'];
 document.querySelectorAll('.drawer-nav button[data-route] span').forEach((s,i)=>{if(drawerKeys[i])s.textContent=t(drawerKeys[i])});
 const dlabel=document.querySelector('.drawer-label');if(dlabel)dlabel.textContent=t('manage');
 const exportSpan=$('drawerExport')?.querySelector('span');if(exportSpan)exportSpan.textContent=t('exportBackup');
 const importSpan=document.querySelector('.drawer-upload span');if(importSpan)importSpan.textContent=t('importBackup');
 document.querySelectorAll('[data-home-filter]').forEach(b=>b.textContent=t(b.dataset.homeFilter==='listed'?'listed':'currentUpcoming'));
 $('homeSearch').placeholder=t('searchCompany');$('ipoSearch').placeholder=t('searchCompany');
 const smalls=document.querySelectorAll('.page-heading small');if(smalls[0])smalls[0].textContent=t('exploreIpos');if(smalls[1])smalls[1].textContent=t('importantDates');if(smalls[2])smalls[2].textContent=t('estimateReturns');if(smalls[3])smalls[3].textContent=t('myPicks');if(smalls[4])smalls[4].textContent=t('manageData');
 const headings=document.querySelectorAll('.page-heading h1');if(headings[0])headings[0].textContent=t('allIpos');if(headings[1])headings[1].textContent=t('ipoCalendar');if(headings[2])headings[2].textContent=t('ipoCalculator');if(headings[3])headings[3].textContent=t('watchlist');if(headings[4])headings[4].textContent=t('adminDashboard');
 document.querySelectorAll('[data-filter]').forEach(b=>{const k=b.dataset.filter==='all'?'all':b.dataset.filter==='current'?'current':b.dataset.filter==='upcoming'?'upcoming':b.dataset.filter==='listed'?'listed':b.dataset.filter==='Mainboard'?'mainboard':'sme';b.textContent=t(k)});
 document.querySelectorAll('[data-calendar-legend]').forEach(el=>el.textContent=t(el.dataset.calendarLegend));
 $('calendarEvents').textContent=t('selectDate');
 setLabel('issuePrice',t('issuePrice'));setLabel('listingPrice',t('expectedListingPrice'));setLabel('lotSize',t('lotSize'));setLabel('lots',t('numberLots'));$('calcBtn').textContent=t('calculate');
 const rs=document.querySelectorAll('.result-grid article span');if(rs[0])rs[0].textContent=t('investment');if(rs[1])rs[1].textContent=t('estimatedProfit');if(rs[2])rs[2].textContent=t('return');
 $('clearWatch').textContent=t('clearAll');document.querySelector('.admin-brand-lockup small').textContent=t('secureAdmin');document.querySelector('.admin-brand-lockup h1').textContent=t('adminLogin');document.querySelector('.login-card .muted').textContent=t('authorizedCredentials');setLabel('adminEmail',t('email'));setLabel('adminPassword',t('password'));$('loginBtn').textContent=t('login');$('logoutBtn').textContent=t('logout');
 const cards=document.querySelectorAll('#adminDashboard .form-card h2');if(cards[0])cards[0].textContent=t('addEditIpo');if(cards[1])cards[1].textContent=t('importIpoData');if(cards[2])cards[2].textContent=t('existingRecords');
 [['company','company'],['status','status'],['priceBand','priceBand'],['adminLot','lotSize'],['gmp','gmp'],['issueSize','issueSize'],['subscription','subscriptionTimes'],['issueType','issueType'],['registrar','registrar'],['openDate','openDate'],['closeDate','closeDate'],['allotmentDate','allotmentDate'],['listingDate','listingDate']].forEach(([id,k])=>setLabel(id,t(k)));
 $('saveIpo').textContent=t('saveIpo');$('resetForm').textContent=t('reset');document.querySelector('#adminDashboard .admin-layout .form-card:nth-child(2) .muted').textContent=t('csvHelp');$('uploadCsv').textContent=t('uploadCsv');$('downloadTemplate').textContent=t('downloadTemplate');
 const navKeys=['home','ipos','calendar','calc','more'];document.querySelectorAll('#bottomNav small').forEach((s,i)=>s.textContent=t(navKeys[i]));
 updateSyncText('ok',localStorage.getItem(STORAGE.lastSync));$('drawerBtn').ariaLabel=t('openMenu');$('drawerClose').ariaLabel=t('closeMenu');$('themeBtn').ariaLabel=t('theme');$('homeCalendar').ariaLabel=t('openCalendar');$('refreshBtn').ariaLabel=t('refresh');
 const week=lang==='gu'?['રવિ','સોમ','મંગળ','બુધ','ગુરુ','શુક્ર','શનિ']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];document.querySelectorAll('.week-row span').forEach((x,i)=>x.textContent=week[i]);
 const statusText=lang==='gu'?['ચાલુ','આગામી','લિસ્ટેડ']:['Current','Upcoming','Listed'];Array.from($('status').options).forEach((o,i)=>o.textContent=statusText[i]);

 if($('remoteSyncTitle'))$('remoteSyncTitle').textContent=lang==='gu'?'મોબાઇલ ડેટા સિંક':'Mobile Data Sync';
 if($('remoteSyncHelp'))$('remoteSyncHelp').textContent=lang==='gu'?'Published CSV URL પેસ્ટ કરો (ઉદાહરણ: CSV તરીકે publish કરેલી Google Sheet). નવી ZIP વિના માન્ય પંક્તિઓ merge થશે.':'Paste a published CSV URL (for example, a Google Sheet published as CSV). Valid rows merge without a new ZIP.';
 if($('remoteCsvLabel'))$('remoteCsvLabel').firstChild.nodeValue=lang==='gu'?'Remote CSV URL':'Remote CSV URL';
 if($('autoSyncLabel'))$('autoSyncLabel').textContent=lang==='gu'?'એપ ખુલતાં auto-sync':'Auto-sync when app opens';
 if($('syncRemoteBtn'))$('syncRemoteBtn').textContent=lang==='gu'?'હમણાં સિંક કરો':'Sync Now';
 if($('clearRemoteBtn'))$('clearRemoteBtn').textContent=lang==='gu'?'URL દૂર કરો':'Clear URL';

 document.querySelector('.drawer-footer').textContent='NIVECO PRO 7.3 STABLE';
}
function setLanguage(next){lang=next;localStorage.setItem(STORAGE.lang,lang);applyStaticTranslations();renderAll();renderCalendar();renderAdmin()}

function load(key,fallback){try{const raw=localStorage.getItem(key);if(raw===null)return fallback;const v=JSON.parse(raw);return v??fallback}catch{return fallback}}
function loadFirst(keys,fallback){for(const key of keys){const raw=localStorage.getItem(key);if(raw===null)continue;try{const value=JSON.parse(raw);if(value!==null&&value!==undefined){localStorage.setItem(keys[0],JSON.stringify(value));return value}}catch{}}return fallback}
function loadTextFirst(keys,fallback){for(const key of keys){const value=localStorage.getItem(key);if(value){localStorage.setItem(keys[0],value);return value}}return fallback}
function persist(){localStorage.setItem(STORAGE.ipos,JSON.stringify(ipos));localStorage.setItem(STORAGE.watch,JSON.stringify(watch));localStorage.setItem(STORAGE.lastSync,new Date().toISOString())}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function money(v){return '₹'+Number(v||0).toLocaleString('en-IN')}
function fmtDate(v){if(!v)return '—';const d=new Date(v+'T00:00:00');return d.toLocaleDateString(lang==='gu'?'gu-IN':'en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function slug(s){return String(s||'ipo').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36).slice(-4)}
function toast(text){$('toast').textContent=text;$('toast').classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.add('hidden'),1900)}
function initials(name){return String(name).split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function openDrawer(){ $('drawer').classList.add('open');$('drawer').setAttribute('aria-hidden','false');$('drawerBackdrop').classList.remove('hidden') }
function closeDrawer(){ $('drawer').classList.remove('open');$('drawer').setAttribute('aria-hidden','true');$('drawerBackdrop').classList.add('hidden') }
function navigate(id){route=id;document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('[data-route]').forEach(x=>x.classList.toggle('active',x.dataset.route===id));document.querySelectorAll('#bottomNav button').forEach(x=>x.classList.toggle('active',x.dataset.route===id||(id==='watchlist'&&x.dataset.route==='admin')));closeDrawer();window.scrollTo(0,0);if(id==='admin')renderAdmin();if(id==='calendar')renderCalendar()}
function statusBadge(x){const label=x.status==='current'?t('live'):x.status==='upcoming'?t('upcoming'):t('listed');return `<span class="badge ${x.status==='current'?'live':x.status}">• ${label}</span>`}
function card(x){const saved=watch.includes(x.id);const maxPrice=Number((String(x.priceBand).match(/[\d,.]+/g)||[]).pop()?.replace(/,/g,''))||0;const hasGmp=x.gmp!==''&&x.gmp!==null&&x.gmp!==undefined&&Number.isFinite(Number(x.gmp));const premiumPct=hasGmp&&maxPrice?((Number(x.gmp)/maxPrice)*100):0;const gmpMeta=hasGmp?`<span class="gmp-meta">${t('unofficialGmp')}${x.gmpSource?' · '+esc(x.gmpSource):''}${x.gmpUpdatedAt?' · '+new Date(x.gmpUpdatedAt).toLocaleString(lang==='gu'?'gu-IN':'en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):''}</span>`:'';return `<article class="ipo-card" data-id="${esc(x.id)}"><div class="ipo-card-head"><div class="company-line"><div class="company-avatar">${esc(initials(x.company))}</div><div><h2>${esc(x.company)}</h2><p class="offer-dates">${t('offer')}: ${fmtDate(x.openDate)} – ${fmtDate(x.closeDate)}</p></div></div>${statusBadge(x)}</div><div class="ipo-stats"><div class="ipo-stat"><small>${t('offerPrice')}</small><strong>${esc(x.priceBand||'TBA')}</strong></div><div class="ipo-stat"><small>${t('lotSize')}</small><strong>${esc(x.lotSize||'—')}</strong></div><div class="ipo-stat"><small>${t('subscriptionTimes')}</small><strong>${Number(x.subscription)>0?Number(x.subscription).toFixed(2)+(lang==='gu'?' ગણું':'x'):'—'}</strong></div><div class="ipo-stat"><small>${t('premium')}</small><strong class="${Number(x.gmp)>=0?'positive':'negative'}">${hasGmp?`${money(x.gmp)} (${premiumPct.toFixed(1)}%)`:'—'}</strong>${gmpMeta}</div><div class="ipo-stat"><small>${t('issueSize')}</small><strong>${x.issueSize?money(x.issueSize)+(lang==='gu'?' કરોડ':' Cr'):'—'}</strong></div><div class="ipo-stat"><small>${t('allotment')}</small><strong>${fmtDate(x.allotmentDate)}</strong></div></div><div class="card-footer"><button class="share-button" data-share="${esc(x.id)}" type="button">${t('share')}</button><button class="watch-button ${saved?'saved':''}" data-watch="${esc(x.id)}" type="button">${saved?'★ '+t('saved'):'☆ '+t('watch')}</button></div></article>`}
function attachCardActions(root){root.querySelectorAll('[data-watch]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.watch;watch=watch.includes(id)?watch.filter(x=>x!==id):[...watch,id];persist();renderAll();toast(watch.includes(id)?t('addedWatch'):t('removedWatch'))});root.querySelectorAll('[data-share]').forEach(btn=>btn.onclick=async()=>{const x=ipos.find(i=>i.id===btn.dataset.share);const text=`${x.company}\nPrice Band: ${x.priceBand}\nUnofficial GMP: ${x.gmp===undefined?'—':money(x.gmp)}${x.gmpSource?'\nSource: '+x.gmpSource:''}`;try{if(navigator.share)await navigator.share({title:x.company,text});else{await navigator.clipboard.writeText(text);toast(t('copied'))}}catch{}})}

function renderHome(){const q=$('homeSearch').value.trim().toLowerCase();const list=ipos.filter(x=>homeFilter==='listed'?x.status==='listed':x.status!=='listed').filter(x=>x.company.toLowerCase().includes(q));$('liveText').textContent=t('liveRecords',list.length);$('homeList').innerHTML=list.length?list.map(card).join(''):`<div class="empty">${t('noMatching')}</div>`;attachCardActions($('homeList'))}
function renderIpos(){const q=$('ipoSearch').value.trim().toLowerCase();const list=ipos.filter(x=>ipoFilter==='all'||x.status===ipoFilter||x.issueType===ipoFilter).filter(x=>x.company.toLowerCase().includes(q));$('ipoList').innerHTML=list.length?list.map(card).join(''):`<div class="empty">${t('noMatching')}</div>`;attachCardActions($('ipoList'))}
function renderWatch(){const list=ipos.filter(x=>watch.includes(x.id));$('watchList').innerHTML=list.length?list.map(card).join(''):`<div class="empty">${t('watchEmpty')}</div>`;attachCardActions($('watchList'))}
function renderAll(){renderHome();renderIpos();renderWatch();renderAdminList()}
const CALENDAR_EVENT_TYPES=[
 {key:'openDate',type:'open',labelKey:'opens'},
 {key:'closeDate',type:'close',labelKey:'closes'},
 {key:'allotmentDate',type:'allotment',labelKey:'allotment'},
 {key:'listingDate',type:'listing',labelKey:'listing'}
];
function eventsFor(date){
 const out=[];
 ipos.forEach(ipo=>CALENDAR_EVENT_TYPES.forEach(meta=>{
  if(ipo[meta.key]===date)out.push({company:ipo.company,type:meta.type,label:t(meta.labelKey)});
 }));
 return out;
}
function isoLocal(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function renderCalendar(){
 const y=calendarDate.getFullYear(),m=calendarDate.getMonth();
 $('monthTitle').textContent=calendarDate.toLocaleDateString(lang==='gu'?'gu-IN':'en-IN',{month:'long',year:'numeric'});
 const weekNames=lang==='gu'?['રવિ','સોમ','મંગળ','બુધ','ગુરુ','શુક્ર','શનિ']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 document.querySelectorAll('.week-row span').forEach((el,i)=>el.textContent=weekNames[i]);
 const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());
 let html='';
 for(let i=0;i<42;i++){
  const d=new Date(start);d.setDate(start.getDate()+i);
  const iso=isoLocal(d),ev=eventsFor(iso),types=[...new Set(ev.map(e=>e.type))];
  const markers=types.map(type=>`<i class="event-dot ${type}" aria-hidden="true"></i>`).join('');
  html+=`<button class="calendar-day ${d.getMonth()!==m?'dim':''} ${ev.length?'has-event':''} ${selectedDate===iso?'selected':''}" data-date="${iso}" type="button" aria-label="${iso}${ev.length?' '+ev.map(e=>e.label).join(', '):''}"><span class="day-number">${d.getDate()}</span><span class="event-dots">${markers}</span></button>`;
 }
 $('calendarGrid').innerHTML=html;
 $('calendarGrid').querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{
  selectedDate=b.dataset.date;renderCalendar();
  const ev=eventsFor(selectedDate);
  $('calendarEvents').innerHTML=ev.length?`<strong>${fmtDate(selectedDate)}</strong><div class="event-list">${ev.map(e=>`<div class="event-row"><i class="event-dot ${e.type}"></i><span>${esc(e.company)} — ${esc(e.label)}</span></div>`).join('')}</div>`:t('noEvent');
 });
}
function renderAdmin(){const signed=sessionStorage.getItem(STORAGE.auth)==='1';$('loginPanel').classList.toggle('hidden',signed);$('adminDashboard').classList.toggle('hidden',!signed);if(signed)renderAdminList()}
function renderAdminList(){if(!$('adminList'))return;$('adminList').innerHTML=ipos.map(x=>`<div class="admin-row"><div><strong>${esc(x.company)}</strong><div class="muted">${esc(x.status)} • ${esc(x.issueType)}</div></div><button data-edit="${esc(x.id)}" type="button">${t('edit')}</button><button data-delete="${esc(x.id)}" type="button">${t('delete')}</button></div>`).join('');$('adminList').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editIpo(b.dataset.edit));$('adminList').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm(t('deleteConfirm'))){ipos=ipos.filter(x=>x.id!==b.dataset.delete);watch=watch.filter(x=>x!==b.dataset.delete);persist();renderAll();toast(t('deleted'))}})}
function editIpo(id){const x=ipos.find(i=>i.id===id);if(!x)return;['company','status','priceBand','gmp','issueSize','subscription','issueType','registrar','openDate','closeDate','allotmentDate','listingDate'].forEach(k=>$(k).value=x[k]??'');$('adminLot').value=x.lotSize||1;$('editId').value=x.id;window.scrollTo({top:0,behavior:'smooth'})}
function resetForm(){['editId','company','priceBand','registrar','openDate','closeDate','allotmentDate','listingDate'].forEach(id=>$(id).value='');$('status').value='current';$('adminLot').value=1;$('gmp').value=0;$('issueSize').value='';$('subscription').value='';$('issueType').value='Mainboard'}
function parseCSV(text){const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(x=>x.trim());if(lines.length<2)return[];const parse=line=>{const a=[];let s='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'){s+='"';i++}else if(c==='"')q=!q;else if(c===','&&!q){a.push(s.trim());s=''}else s+=c}a.push(s.trim());return a};const heads=parse(lines[0]);return lines.slice(1).map(line=>Object.fromEntries(heads.map((h,i)=>[h,parse(line)[i]||''])))}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

function normalizeRemoteRow(row){
 const pick=(...keys)=>{for(const k of keys){const key=Object.keys(row).find(x=>x.trim().toLowerCase()===k.toLowerCase());if(key!==undefined&&String(row[key]).trim()!=='')return String(row[key]).trim()}return ''};
 const company=pick('company','company_name','name','ipo');
 const statusRaw=pick('status').toLowerCase();
 const priceBand=pick('priceBand','price_band','price band','offer_price','offer price');
 const lotSize=Number(pick('lotSize','lot_size','lot size','market_lot','market lot').replace(/,/g,''))||0;
 const n=v=>{const x=Number(String(v||'').replace(/[₹,%xX,]/g,'').trim());return Number.isFinite(x)?x:null};
 const d=(...keys)=>{const v=pick(...keys);if(!v)return '';if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;const dt=new Date(v);return Number.isNaN(dt.getTime())?'':isoLocal(dt)};
 return normalizeUnknowns({
  id:stableId(company),company,
  status:['current','upcoming','listed'].includes(statusRaw)?statusRaw:'upcoming',
  priceBand:priceBand||'TBA',lotSize,
  gmp:n(pick('gmp','grey_market_premium','grey market premium')),
  issueSize:n(pick('issueSize','issue_size','issue size','issue_size_cr','issue size cr')),
  subscription:n(pick('subscription','subscription_times','subscription times','subscribed')),
  issueType:/sme/i.test(pick('issueType','issue_type','issue type'))?'SME':'Mainboard',
  registrar:pick('registrar'),gmpSource:pick('gmpSource','gmp_source','source'),
  gmpUpdatedAt:pick('gmpUpdatedAt','gmp_updated_at','updated_at'),
  openDate:d('openDate','open_date','open date'),closeDate:d('closeDate','close_date','close date'),
  allotmentDate:d('allotmentDate','allotment_date','allotment date'),listingDate:d('listingDate','listing_date','listing date')
 });
}
async function syncRemoteData(showNotice=true){
 const input=$('remoteCsvUrl');const url=(input?input.value:localStorage.getItem(STORAGE.remoteUrl)||'').trim();
 if(!url){if(showNotice)toast(lang==='gu'?'Remote CSV URL દાખલ કરો.':'Enter a remote CSV URL.');return false}
 const message=$('remoteSyncMessage');if(message)message.textContent=lang==='gu'?'ડેટા સિંક થઈ રહ્યો છે…':'Syncing data…';
 if($('syncRemoteBtn'))$('syncRemoteBtn').disabled=true;
 try{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
  const res=await fetch(url,{cache:'no-store',signal:controller.signal});clearTimeout(timer);
  if(!res.ok)throw new Error(`HTTP ${res.status}`);
  const text=await res.text();const rows=parseCSV(text);const mapped=rows.map(normalizeRemoteRow).filter(x=>x.company&&hasCoreIpoData(x));
  if(!mapped.length)throw new Error(lang==='gu'?'માન્ય IPO પંક્તિ મળી નથી.':'No valid IPO rows found.');
  mergeLiveRecords(mapped);localStorage.setItem(STORAGE.remoteUrl,url);localStorage.setItem(STORAGE.remoteSync,new Date().toISOString());
  renderAll();renderCalendar();updateSyncText('ok',new Date().toISOString());
  const ok=lang==='gu'?`${mapped.length} IPO રેકોર્ડ સિંક થયા.`:`${mapped.length} IPO records synced.`;if(message)message.textContent=ok;if(showNotice)toast(ok);return true;
 }catch(e){const msg=(lang==='gu'?'સિંક નિષ્ફળ: ':'Sync failed: ')+(e&&e.message?e.message:String(e));if(message)message.textContent=msg;if(showNotice)toast(msg);return false}
 finally{if($('syncRemoteBtn'))$('syncRemoteBtn').disabled=false}
}
function initRemoteSync(){
 const url=localStorage.getItem(STORAGE.remoteUrl)||'';const auto=localStorage.getItem(STORAGE.autoSync)==='1';
 if($('remoteCsvUrl'))$('remoteCsvUrl').value=url;if($('autoSyncToggle'))$('autoSyncToggle').checked=auto;
 const last=localStorage.getItem(STORAGE.remoteSync);if(last&&$('remoteSyncMessage'))$('remoteSyncMessage').textContent=(lang==='gu'?'છેલ્લું remote sync: ':'Last remote sync: ')+new Date(last).toLocaleString(lang==='gu'?'gu-IN':'en-IN');
 if(auto&&url)syncRemoteData(false);
}

function bind(){
$('drawerBtn').onclick=openDrawer;$('drawerClose').onclick=closeDrawer;$('drawerBackdrop').onclick=closeDrawer;document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>navigate(b.dataset.route));
$('themeBtn').onclick=()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem(STORAGE.theme,next);$('themeBtn').textContent=next==='light'?'☾':'☀';document.querySelector('meta[name="theme-color"]').content=next==='light'?'#f5f7fb':'#06101d'};
$('langBtn').onclick=()=>setLanguage(lang==='en'?'gu':'en');
document.querySelectorAll('[data-home-filter]').forEach(b=>b.onclick=()=>{homeFilter=b.dataset.homeFilter;document.querySelectorAll('[data-home-filter]').forEach(x=>x.classList.toggle('active',x===b));renderHome()});
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{ipoFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderIpos()});
$('homeSearch').oninput=renderHome;$('ipoSearch').oninput=renderIpos;$('homeCalendar').onclick=()=>navigate('calendar');$('refreshBtn').onclick=()=>syncLiveIpos(true);
$('prevMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()};$('nextMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()};
$('calcBtn').onclick=()=>{const issue=+$('issuePrice').value||0,listing=+$('listingPrice').value||0,lot=+$('lotSize').value||0,lots=+$('lots').value||0,investment=issue*lot*lots,profit=(listing-issue)*lot*lots;$('investment').textContent=money(investment);$('profit').textContent=money(profit);$('profit').className=profit>=0?'positive':'negative';$('returnPct').textContent=issue?`${(((listing-issue)/issue)*100).toFixed(2)}%`:'0%'};
$('clearWatch').onclick=()=>{watch=[];persist();renderWatch();renderHome();renderIpos();toast(t('watchCleared'))};
$('loginBtn').onclick=()=>{const email=$('adminEmail').value.trim().toLowerCase(),pass=$('adminPassword').value;const ok=ADMIN_EMAILS.includes(email)&&pass===ADMIN_PASSWORD;if(ok){sessionStorage.setItem(STORAGE.auth,'1');$('loginMessage').textContent='';renderAdmin();toast(t('loginSuccess'))}else $('loginMessage').textContent=t('incorrectLogin')};
$('logoutBtn').onclick=()=>{sessionStorage.removeItem(STORAGE.auth);renderAdmin();toast(t('loggedOut'))};
$('saveIpo').onclick=()=>{const company=$('company').value.trim();if(!company){toast(t('companyRequired'));return}const id=$('editId').value||slug(company);const obj={id,company,status:$('status').value,priceBand:$('priceBand').value.trim()||'TBA',lotSize:+$('adminLot').value||1,gmp:+$('gmp').value||0,issueSize:+$('issueSize').value||0,subscription:+$('subscription').value||0,issueType:$('issueType').value,registrar:$('registrar').value.trim(),openDate:$('openDate').value,closeDate:$('closeDate').value,allotmentDate:$('allotmentDate').value,listingDate:$('listingDate').value};const i=ipos.findIndex(x=>x.id===id);if(i>=0)ipos[i]=obj;else ipos.unshift(obj);persist();resetForm();renderAll();toast(t('ipoSaved'))};$('resetForm').onclick=resetForm;
$('uploadCsv').onclick=()=>{const f=$('csvInput').files[0];if(!f){$('csvMessage').textContent=t('chooseCsv');return}const r=new FileReader();r.onload=()=>{try{const rows=parseCSV(String(r.result));if(!rows.length)throw new Error(t('noRows'));const mapped=rows.map(x=>({id:slug(x.company),company:x.company||'Unnamed IPO',status:['current','upcoming','listed'].includes((x.status||'').toLowerCase())?x.status.toLowerCase():'upcoming',priceBand:x.priceBand||'TBA',lotSize:+x.lotSize||1,gmp:+x.gmp||0,issueSize:+x.issueSize||0,subscription:+x.subscription||0,issueType:x.issueType==='SME'?'SME':'Mainboard',registrar:x.registrar||'',openDate:x.openDate||'',closeDate:x.closeDate||'',allotmentDate:x.allotmentDate||'',listingDate:x.listingDate||''}));ipos=[...mapped,...ipos];persist();renderAll();$('csvMessage').textContent=t('recordsImported',mapped.length);toast(t('csvComplete'))}catch(e){$('csvMessage').textContent=t('csvError')+e.message}};r.readAsText(f)};
$('downloadTemplate').onclick=()=>download('NIVECO-IPO-template.csv','company,status,priceBand,lotSize,gmp,issueSize,subscription,issueType,registrar,openDate,closeDate,allotmentDate,listingDate\nExample IPO,current,₹100–₹110,100,15,1800,5.12,Mainboard,Example Registrar,2026-08-10,2026-08-12,2026-08-15,2026-08-18\n','text/csv');
const exportBackup=()=>download('niveco-backup.json',JSON.stringify({version:'7.3',ipos,watch},null,2),'application/json');$('drawerExport').onclick=exportBackup;$('backupInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(String(r.result));if(!Array.isArray(d.ipos))throw new Error();ipos=d.ipos;watch=Array.isArray(d.watch)?d.watch:[];persist();renderAll();toast(t('backupImported'))}catch{toast(t('invalidBackup'))}};r.readAsText(f)};
if($('syncRemoteBtn'))$('syncRemoteBtn').onclick=()=>syncRemoteData(true);
if($('clearRemoteBtn'))$('clearRemoteBtn').onclick=()=>{localStorage.removeItem(STORAGE.remoteUrl);localStorage.removeItem(STORAGE.remoteSync);$('remoteCsvUrl').value='';$('remoteSyncMessage').textContent='';toast(lang==='gu'?'Remote URL દૂર થયો.':'Remote URL cleared.');};
if($('autoSyncToggle'))$('autoSyncToggle').onchange=e=>localStorage.setItem(STORAGE.autoSync,e.target.checked?'1':'0');
if($('remoteCsvUrl'))$('remoteCsvUrl').onchange=e=>localStorage.setItem(STORAGE.remoteUrl,e.target.value.trim());

}
function init(){lang=loadTextFirst([STORAGE.lang,...LEGACY_STORAGE.lang],'en');const theme=loadTextFirst([STORAGE.theme,...LEGACY_STORAGE.theme],'light');document.documentElement.dataset.theme=theme;$('themeBtn').textContent=theme==='light'?'☾':'☀';cleanStoredDataOnce();bind();applyStaticTranslations();initRemoteSync();renderAll();renderCalendar();renderAdmin();$('calcBtn').click();navigate('home');updateSyncText('ok',localStorage.getItem(STORAGE.lastSync));setTimeout(()=>{const splash=$('splashScreen');if(splash){splash.classList.add('hide');setTimeout(()=>splash.remove(),450)}},850);if(location.protocol==='https:'||location.hostname==='localhost'){setTimeout(()=>syncLiveIpos(false),1000);setInterval(()=>syncLiveIpos(false),30*60*1000)}}
document.addEventListener('DOMContentLoaded',init);
