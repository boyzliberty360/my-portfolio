# My Portfolio

React and Vite portfolio deployed on Vercel.

## Projects admin

The `/admin` page uses a server-side password and stores project records in
`public/data/projects.json`. Publishing or deleting a project commits the updated JSON file to the
GitHub repository. Firebase is not used.

Configure these server-only environment variables in Vercel Project Settings:

- `ADMIN_PASSWORD`: the password used on `/admin`.
- `GITHUB_PROJECTS_TOKEN`: a fine-grained GitHub token limited to this repository with
  **Contents: Read and write** permission.

The repository owner, repository name, branch, and data path are detected/defaulted for this
project. They can be overridden with the optional variables documented in `.env.example`.

Do not use a `VITE_` prefix for either secret. Vite exposes `VITE_` variables to the browser.

After the GitHub token commits a project update, the public Projects section reads the latest data
through `/api/projects`. The repository commit also triggers the normal Vercel redeployment so the
static fallback stays synchronized.

For local testing of both the Vite app and Vercel Function, use `vercel dev`. Running `npm run dev`
serves the static project-list fallback but does not provide the admin API.

## Commands

```bash
npm run dev
npm run lint
npm run build
```
