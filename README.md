# NIVECO PRO 7.0

Production-ready React/Firebase Progressive Web App for verified Indian IPO intelligence. The UI deliberately ships with no fabricated market records; live IPOs are streamed from Firestore.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and add your Firebase web app configuration.
3. Enable Email/Password and Google providers in Firebase Authentication.
4. Deploy `firestore.rules` and create an `admins/{uid}` document for each administrator.
5. Create an `ipos` collection through the protected `/admin` console.
6. Configure Firebase Cloud Messaging with the VAPID key and send web-push payloads from a trusted server environment.
7. Run `npm run dev` or deploy to Vercel. SPA rewrites and service-worker caching are included.

## Data model

Each `ipos` record supports `name`, `symbol`, `type`, `exchange`, `status`, `openDate`, `closeDate`, `listingDate`, `priceMin`, `priceMax`, `lotSize`, `gmp`, `subscription`, `listingPrice`, and `listingGain`. Market data must be sourced and verified by the deploying organization.

## Security

Firestore rules allow public IPO reads, administrator-only IPO writes, and owner-only notification device records. Admin access is server-controlled through documents that clients cannot write.
