# GitHub → Vercel deployment

Deploy this directory as the repository root. It contains `package.json`, `package-lock.json`, Next.js source and `vercel.json`.

1. Create a private GitHub repository called `avisyooproperty-website`, or select an existing repository. Push only this application directory; `.gitignore` excludes dependencies, generated builds, local enquiries and environment files.
2. In Vercel, import that GitHub repository and use `avisyooproperty-website` as the project name. Use the Next.js framework, the repository root, `npm ci` for installation and `npm run build` for the build. Leave the output directory at its Next.js default.
3. Add `NEXT_PUBLIC_WHATSAPP_NUMBER=60143194105` for the supplied contact number. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS Vercel project domain after it is assigned, then redeploy so metadata uses the correct origin.
4. Without a database, this is a demonstration deployment: public pages show labelled historical examples, admin is disabled, and contact forms return an honest unavailable result. WhatsApp works independently.
5. To activate enquiry storage and admin, provision PostgreSQL and add `DATABASE_URL`. Apply the included Prisma migration to that database and optionally seed the demonstration examples. Then configure `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` privately as described in README. Never commit those values or put them in `NEXT_PUBLIC_` variables.
6. Confirm the actual estate agency and business/privacy disclosures before treating the demonstration as the final public business launch.

Vercel's linked Git integration deploys new commits from the configured production branch and creates previews for other branches. No custom GitHub Actions secrets are needed for that integration.

The GitHub repository URL, Vercel project URL and live deployment URL should only be recorded here once the services confirm creation and a successful deployment.
