# My Portfolio

React and Vite portfolio deployed on Vercel.

## Projects admin

The `/admin` page uses a server-side password. Projects are stored privately and persistently in
Vercel Blob, then served publicly through `/api/projects`. Firebase and GitHub storage are not used.

### Vercel setup

1. Open the portfolio project in Vercel.
2. Go to **Storage**, select **Create Database**, and choose **Blob**.
3. Create a **Private** Blob store and connect it to this project. New Vercel Blob connections use
   automatically managed OIDC authentication, so no GitHub token or manually copied storage token
   is needed.
4. Add `ADMIN_PASSWORD` in Vercel Project Settings → Environment Variables.
5. Redeploy the project.

Do not prefix `ADMIN_PASSWORD` with `VITE_`, because Vite exposes `VITE_` variables to the browser.
The administrator enters only this password on `/admin`; storage authentication stays server-side.

For local testing of both the Vite app and Vercel Function, link the project and use `vercel dev`.
Running `npm run dev` serves the static project-list fallback but does not provide the admin API.

## Commands

```bash
npm run dev
npm run lint
npm run build
```
