# context7

Fetch up-to-date library documentation using Context7.

## Usage

`/context7 <library-name> [topic]`

- `library-name` — the library or framework you need docs for (e.g. `react`, `express`, `prisma`)
- `topic` *(optional)* — narrow the docs to a specific topic (e.g. `hooks`, `routing`, `migrations`)

## Steps

**1. Resolve the library ID**

WebFetch `https://context7.com/api/v1/search?query=<library-name>`

Pick the best-matching result (highest `trustScore` or exact name match) and note its `id` field.

**2. Fetch the documentation**

WebFetch `https://context7.com/api/v1/<library-id>?tokens=10000&topic=<topic>`

Omit `&topic=...` when no topic was given.

**3. Present the docs**

Return the documentation inline, summarising the most relevant sections for the user's current task.

## Notes

- If step 1 returns no results, try a shorter or alternate spelling (e.g. `nextjs` → `next.js`).
- If the user has an exact Context7 library ID already (e.g. `/vercel/next.js`), skip step 1 and go straight to step 2.
- Prefer the result whose `id` matches the official package name or repo slug.
