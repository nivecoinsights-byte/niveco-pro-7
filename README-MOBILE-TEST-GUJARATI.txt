NIVECO PRO 6.2.1 MOBILE STABLE

મોબાઇલમાં ટેસ્ટ કરવાની રીત:
1. ZIP Extract કરો.
2. index.html ખોલો. આ આવૃત્તિમાં CSS અને JavaScript index.htmlમાં જ સામેલ છે, તેથી content:// દ્વારા ખોલતાં પણ design દેખાશે.
3. સંપૂર્ણ PWA, live sync અને install માટે આખો extracted folder Cloudflare Pages/Netlify પર upload કરો.

મહત્વપૂર્ણ:
- index.html એકલો ખોલવાથી UI અને local features ચાલશે.
- Remote CSV sync માટે internet અને published CSV URL જરૂરી છે.
- PWA install/service worker ફક્ત HTTPS deployment પર કાર્ય કરશે.
