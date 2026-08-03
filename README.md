# Portfolio: Emmanuel Adejoh

Personal portfolio for a full-stack AI engineer. React + Vite front end, Tailwind for styling,
and Vercel Functions backing a small content admin so projects and testimonials can be edited
without a redeploy.

## Architecture

| Piece | Where | Notes |
| --- | --- | --- |
| Page sections | `src/pages/` | One component per section, composed in `src/App.jsx` |
| Copy and profile data | `src/data/profile.js` | Single source of truth, also feeds the generated PDF resume |
| Project cards | `src/components/Card.jsx` | Renders a case study only when there is real content for one |
| Content API | `api/projects.js`, `api/testimonials.js` | Vercel Functions over Vercel Blob, password-protected |
| Admin UI | `src/pages/Admin.jsx` at `/admin` | Add and edit projects and testimonials |
| Resume PDF | `scripts/generate-resume-pdf.mjs` | Runs on `prebuild`, writes `public/Resume.pdf` |
| Project previews | `scripts/capture-previews.mjs` | Screenshots live project URLs into `public/images/projects/` |

Projects load from `/api/projects` and fall back to the committed `public/data/projects.json`
when the API is unavailable, so the page always renders something.

Editing `src/data/profile.js` updates the site **and** regenerates the PDF resume on the next
build. There is no second copy of that content to keep in sync.

## Commands

```bash
npm run dev      # Vite only. /api/projects is bridged, other functions are not
vercel dev       # full stack, needed to exercise the admin end to end
npm run lint
npm run build    # runs prebuild, which regenerates public/Resume.pdf
npm run previews # screenshot project homepages into public/images/projects/
```

## Admin setup

`/admin` authenticates against a server-side password. Projects are stored privately in Vercel
Blob and served publicly through `/api/projects`.

1. In the Vercel project, go to **Storage**, then **Create Database**, then **Blob**.
2. Create a **Private** Blob store and connect it. Vercel Blob connections use managed OIDC
   authentication, so no token needs to be copied manually.
3. Add `ADMIN_PASSWORD` under Project Settings, then Environment Variables.
4. Redeploy.

Do not prefix `ADMIN_PASSWORD` with `VITE_`. Vite exposes any `VITE_`-prefixed variable to the
browser. Storage authentication stays server-side; the admin only ever sends the password.

The contact form uses Web3Forms and needs `VITE_WEB3FORMS_KEY` (browser-exposed by design).

## Adding a project

Everything on a project card comes from the admin form: preview image, live URL, GitHub URL,
tech stack, a featured flag, and an optional case study.

The case study is the part hiring managers actually read, so it carries more than a description:
problem, solution, role, architecture, hardest problem, how it was solved, **trade-offs**, a
**code snippet**, engineering highlights, **what I took from it**, and **what I would do next**.
Trade-offs are entered one per line as `decision | chose | rejected | because`; the list fields
are newline-separated. A snippet with no code is dropped rather than rendered as an empty block.

Two deliberate behaviours: a project with no case study renders without one, and a project with
no tech stack shows no tags. Every case-study section is independently optional and disappears
when empty. Placeholder text would read as filler to anyone evaluating the work, so absence is
preferred over invention, which is also why nothing on the site claims a metric that cannot be
substantiated.

### Preview images

Cards show a static screenshot rather than a live embed, because many sites refuse to be framed
(`X-Frame-Options`) and framing full third-party apps on the homepage is slow for the visitor.

```bash
npm run previews                  # capture anything missing an image
npm run previews -- --force       # recapture everything
npm run previews -- --url=https://example.com --name=Example
```

Needs Chromium and ImageMagick on PATH. Output goes to `public/images/projects/<slug>.webp` at
900px wide, and `public/data/projects.json` is updated in place.

`Card.jsx` resolves a preview in three steps: the project's explicit `image`, then the convention
`/images/projects/<slug>.webp`, then a designed placeholder if that file 404s. So capturing a
screenshot is usually enough and no record needs editing. **The slug rules in `capture-previews.mjs`
and `Card.jsx` must stay identical**, or the convention lookup silently misses.

Projects living in Vercel Blob are not rewritten by the script. Capture the screenshot, then paste
the printed path into the admin's Preview Image field (or rely on the slug convention).
