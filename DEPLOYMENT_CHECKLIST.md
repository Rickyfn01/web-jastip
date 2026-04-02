# Deployment Checklist

Use this checklist before publishing JastipVIP to Vercel.

## Environment Variables

Set these in Vercel for Production and Preview:

- `DATABASE_URL` (Neon PostgreSQL)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `SITE_URL`

## Local Validation

- Run `npm run build`
- Run `npm run test:e2e`
- Run `npm run db:generate`
- Run `npm run db:migrate:deploy`
- Check the landing page loads without console errors
- Verify Supabase image URLs resolve correctly

## Production Verification

After deploy, verify these flows manually:

- Open `/` and confirm hero, CTA, and floating WhatsApp button load
- Submit a request from the form and confirm an order ID is returned
- Open `/track/[id]` and confirm the timeline updates from the database
- Log in at `/admin`
- Open `/admin/dashboard`
- Update an order in `/admin/orders/[id]`
- Refresh tracking page and confirm updated status and pricing

## Operational Notes

- Keep `ADMIN_PASSWORD` strong and never commit it to the repo
- Update `SITE_URL` whenever the public domain changes
- Keep Neon branch and database in sync with `prisma migrate deploy`
- If you rotate the Supabase project or bucket policy, re-check image uploads and public URLs
