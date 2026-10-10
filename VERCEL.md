# Vercel Deployment

1. Create a Neon Postgres project and copy its connection string.
2. Import this Git repository into Vercel. Vercel detects the Express `server.js` entry point; no build command is needed.
3. In Vercel project settings, add `DATABASE_URL` for Production, Preview, and Development, then redeploy. The users table is created automatically on the first health check or auth request.
4. To keep existing local accounts, put the Neon connection string in `.env.local` and run `npm run migrate:users` before removing the local `users.json` copy. Imported password hashes are preserved; rerunning the command skips existing email addresses.

Static pages and assets live in `public/` so Vercel serves them from its CDN. User data and local environment files are excluded from deployment.

The current and historical `users.json` contents may still exist in Git history. If that repository has been public, rotate affected passwords and purge the file from repository history before deploying.