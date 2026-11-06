# JC Property | 俊创房产

A bilingual Next.js App Router MVP for a Johor property advisory brand. The earlier `index.html` deliverable is preserved alongside this project.

## Run locally

Requires Node.js 20.9 or newer and npm. From this directory:

```sh
npm ci
cp .env.example .env.local
npm run db:generate
npm run dev
```

On Windows, copy `.env.example` to `.env.local` using File Explorer or `Copy-Item`. Open http://localhost:3000. Put `NEXT_PUBLIC_WHATSAPP_NUMBER=60143194105` in `.env.local` to enable the supplied contact number. Restart after environment changes. Public environment variables are embedded at build time, so rebuild for production after changes.

## Included

- Home, searchable properties, slug-based details and gallery, educational insights, gross-yield calculator, rental management, adviser profile, contact and protected admin routes.
- English and Simplified Chinese, selected through `?lang=en` / `?lang=zh`, persisted in a first-party preference cookie. Switching preserves page and filters.
- Query filters for transaction type, location, category, minimum/maximum price, minimum rooms, and minimum/maximum built-up area.
- Reusable typed data layer, Zod validation, consent-based enquiry storage and truthful storage failures.
- Expiring HMAC-signed administrator cookie, bcrypt password verification, same-origin mutation checks, bounded request bodies, persistent database-backed request throttling when configured, and development-only in-memory throttling.
- Listing CRUD, draft/publish, featured status, bilingual image descriptions, authenticated image upload, gallery ordering by upload order, removal of image references, and enquiry status management.
- Uploaded JPEG/PNG/WebP images up to 5 MB are decoded, EXIF-oriented, resized and re-encoded to JPEG without source metadata. Images are public by URL; upload only publication-safe property photography. Removed image references leave the stored blob for backup/manual cleanup.
- Responsive layouts, keyboard focus styles, reduced-motion support, localized metadata, sitemap, robots and Organization structured data. Demo listing pages are `noindex` and omitted from the sitemap; no investment offers or licensed-agency credentials are fabricated.

## Historical demonstrations

The three supplied examples are historical and unverified. Every card and detail page is labelled accordingly. Their empty image arrays render intentional CSS illustrations labelled as placeholders, not photographs of real units. Bathroom counts are unknown. The Forest City room figures are shown as rooms with classification to confirm, not asserted as verified bedroom counts.

In development without a database, these examples initialise a private `.local/data.json` store on the first write. Listings and enquiries persist on this device. An enquiry confirmation explicitly says **saved locally for development only**, not delivered to the adviser. `.local` is excluded from source control and the source archive.

In production without a database, public pages can show the demo collection. Enquiry submission fails safely, and admin is disabled. No production fallback writes to a temporary filesystem. No email or CRM delivery is implemented; administrators review stored enquiries.

## PostgreSQL

Set `DATABASE_URL` to a PostgreSQL connection string. Prisma CLI reads `.env`, while Next.js reads `.env.local`; export `DATABASE_URL` in your shell for migration/seed commands, or use an ignored `.env` for Prisma. Do not commit secrets.

```sh
npm run db:generate
npx prisma migrate deploy
npm run db:seed
```

The included migration creates `Listing`, `Lead`, `Image` and `RateBucket`. Seed is idempotent and does not overwrite edited records. For disposable local database prototyping, `npm run db:push` is available instead of migrations. Do not mix migration and push workflows against a production database.

Back up PostgreSQL, restrict its credentials, require transport encryption as appropriate to the provider, and configure retention/deletion procedures for leads and orphan images. No database credentials are included and a live PostgreSQL integration has not been verified in this workspace.

## Administrator setup

No public defaults exist. Use an interactive terminal:

```sh
npm run admin:hash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The first command prompts for a password (input hidden, minimum 14 characters) and emits its bcrypt hash. Put that in `ADMIN_PASSWORD_HASH`, quoted if your environment provider needs it. Put the random secret in `SESSION_SECRET`. Never pass a plaintext password through command arguments or add it to source. Restart, then visit `/admin` and enter the original password. Production also requires PostgreSQL and HTTPS. Sessions expire after eight hours; rotate `SESSION_SECRET` to invalidate all sessions. There is one administrator role; multi-user accounts, MFA and password reset are outside this MVP.

API authorization is checked separately from the protected page. Images can be uploaded only after authentication. Publishing is a deliberate administrator action; keep the demo checkbox enabled until all facts, availability and image rights are verified.

## Anti-spam and hosting

Lead submission has a honeypot, consent validation, body limit and a **global** limit of 20 requests per 15 minutes. Login has a global limit of 5 per 15 minutes. Global limits intentionally avoid trusting spoofable forwarded IP headers. This is conservative for a small MVP and may affect other visitors after repeated submissions. Add trusted-proxy-aware client limits and a managed challenge/edge protection before a high-traffic launch. PostgreSQL makes counters consistent across app instances. Clean expired `RateBucket` rows periodically; no task is scheduled automatically.

Serve through a standard Next.js Node deployment with PostgreSQL. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS public origin and enable `NEXT_PUBLIC_WHATSAPP_NUMBER`. Same-origin checks accept the deployment request origin or the configured public origin. Use a properly configured trusted reverse proxy. Local HTTP production servers issue secure admin cookies and therefore require HTTPS to use admin in a browser.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The first typecheck before Next generates route types may require `npm run build` first. No public deployment is performed by this source deliverable.

## Required before public business launch

Complete the actual registered estate agency name, agency registration, required business disclosures and privacy-controller details in `src/components/chrome.tsx`, `src/app/about/page.tsx` and `src/app/contact/page.tsx`. JC Property is treated as a brand, not a separately licensed agency. REN38165, six years of experience, the WhatsApp number and portrait come from the user's previous instructions; they have not been independently credential-verified.

Provide the privacy contact, retention policy, hosting/processor and cross-border details. Confirm the Facebook profile before setting `NEXT_PUBLIC_FACEBOOK_URL`; the earlier supplied address had an uncertain spelling, so no social destination is invented. Add verified current listings through admin and replace demo illustrations with authorized property photos. Review business disclosures with the relevant qualified adviser.

## Assets and attribution

- `public/avis-yoo.jpg`: portrait supplied by the user.
- `public/johor-bahru.png`: **Johor Bahru skyline**, Malaysia Skyline, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Johor_Bahru_skyline.png), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Displayed with cropping and a navy overlay. Credit and licence links are included in the footer. This city photograph is contextual imagery, not a listing photo.
- Property and article illustrations are original CSS artwork.

Dependencies are pinned by `package-lock.json`. Check `VERIFICATION.md` for the checks actually run and any remaining limitations.
