NIVECO PRO 7.3 STABLE

આ build જૂના NIVECO PRO look ને જાળવીને તૈયાર કરેલ છે.

મુખ્ય બાબતો:
1. NIVECO eye + NIVΞCO three-line wordmark header.
2. Dark/Light theme, Gujarati/English switch.
3. Home, IPO List, Calendar, Calculator, Watchlist અને More/Admin navigation.
4. Firestore live IPO read source: project niveco-insights-4254b.
5. Firestore data ન મળે તો /api/ipos પછી local data/ipos.json fallback.
6. Vercel માટે vercel.json ઉમેરેલ છે.
7. PWA manifest અને service worker સામેલ છે.
8. Service-account private key/browser codeમાં મૂકશો નહીં.

VERCEL DEPLOY:
- GitHub repository માં આ packageનાં files upload/commit કરો.
- Vercel -> Add New Project -> repository Import.
- Framework Preset: Other (અથવા auto detection).
- Build Command ખાલી રાખો.
- Output Directory ખાલી/./ રાખો.
- Deploy.

નોંધ:
- આ static build Firestore public read rules પર આધાર રાખે છે.
- Admin login હાલ browser-side legacy modeમાં છે; production writes માટે Firebase Authentication + server-side secured write endpoint અલગથી કરવું શ્રેષ્ઠ છે.
