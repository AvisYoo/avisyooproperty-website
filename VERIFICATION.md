# Verification — 6 November 2026

- Production build: passed (`npm run build`, Prisma generation and Next.js webpack build).
- ESLint: passed, no warnings or errors.
- TypeScript: passed as part of the final production build.
- Automated tests: 12 passed, 0 failed. Includes demo-data integrity, combined filters, unknown bedroom exclusion, query validation, gross yield, consent and honeypot validation, encoded WhatsApp messages, signed-session tamper rejection, same-origin guards, bounded JSON parsing and development storage persistence with production failure when no database exists.
- Built-app HTTP checks: home, property search, one property detail, insights, rental management, about, contact, disabled admin, sitemap and robots all returned 200. Chinese document language and invalid-filter feedback were checked. Production enquiry without PostgreSQL returned 503; unauthenticated admin mutation returned 401.
- Dependency audit after targeted transitive overrides: 0 known vulnerabilities. Overrides update `deepmerge-ts` and the TypeScript ESLint parser's `minimatch`; Prisma generation, lint and build passed with these overrides.
- Source archive excludes environment secrets, local enquiries, generated builds and dependencies.

Not verified: a live PostgreSQL connection, deployed Vercel runtime, GitHub publishing, authenticated admin browser flow, or visual screenshots/mobile browser rendering. No external deployment or remote repository has been created yet; GitHub and Vercel account connections are required.

The local Windows environment intermittently denied generated-folder creation during initial builds. Creating those generated directories within the workspace allowed the final build to finish. Those generated folders are not part of the source deliverable.
