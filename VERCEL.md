# Deploy to Vercel

1. Create a Neon Postgres database and copy its connection string.
2. Import this repository into Vercel. `vercel.json` publishes `public/` as the static site and Vercel deploys the handlers in `api/` as serverless functions. No build command is required.
3. Add `DATABASE_URL` in the Vercel project settings for Production, Preview, and Development, then deploy. The users table is created automatically the first time someone registers or logs in.
4. If you have existing accounts in `users.json`, set `DATABASE_URL` in `.env.local` and run `npm run migrate:users` before deploying. Imported password hashes are preserved; rerunning the command skips existing email addresses.

For local development, set `DATABASE_URL` in `.env.local` and run `npm start`. The local Express server uses the same API handlers and database as the Vercel functions.

`users.json`, `.env`, and `.env.local` are excluded from deployment. The current and historical `users.json` contents may still exist in Git history. If this repository has been public, rotate affected passwords and purge the file from repository history before deploying.