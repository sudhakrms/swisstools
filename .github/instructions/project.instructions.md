---
description: Core project instructions for SwissTools
applyTo: '**'
---

# SwissTools — Project Instructions

## Repository

The canonical remote for this project is **always**:

```
https://github.com/sudhakrms/swisstools
```

- Owner: `sudhakrms`
- Repo: `swisstools`
- Always use this when creating PRs, pushing code, referencing issues, or any GitHub operations.

## Architecture

- Vanilla HTML + CSS + **Preact** (via CDN, no build step)
- Hash-based SPA routing: `/#/{tool-slug}`
- Each tool lives in `tools/{slug}/tool.js` — fully self-contained Preact component
- Register tools in `tools/registry.js` only — no other files need touching to add a tool
- No backend, no database — `localStorage` only

## Adding a New Tool

1. Create `tools/{slug}/tool.js` — export a named Preact component
2. Add one entry to `tools/registry.js`
3. That's it — the router, home grid, search, and favourites all pick it up automatically
