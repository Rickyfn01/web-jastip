This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production Setup

Before deploying, configure these environment variables in Vercel:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public anon key
- `ADMIN_PASSWORD` - Password for `/admin`
- `SITE_URL` - Public site URL used for sitemap generation

Use `.env.example` as the base template.

### Neon Database Setup

1. Create a Neon project and copy the pooled connection string.
2. Put the value into `DATABASE_URL`.
3. Generate Prisma client with:

```bash
npm run db:generate
```

4. Apply schema migrations:

```bash
npm run db:migrate:deploy
```

Recommended deployment flow:

1. Push the latest branch to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables above for Production and Preview.
4. Run `npm run db:migrate:deploy` in Vercel build pipeline or pre-deploy step.
5. Run `npm run build` locally before shipping.
6. Verify these routes after deploy:
	- `/`
	- `/api/orders`
	- `/track/[id]`
	- `/admin`
	- `/admin/dashboard`

## End-to-End Testing

Run the browser test flow locally with:

```bash
npm run test:e2e
```

The test covers:

- submit order from landing page
- confirm order is stored in the database
- open the tracking page
- log in as admin
- update order status and pricing
- confirm the tracking page reflects the update
