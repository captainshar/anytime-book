# The Anytime Book, United States Edition

*A free map to everyday adult life — at any time, from any starting point.*

A free, plain-language guide for adults entering mainstream life from hard starting points: neglect, isolation, educational neglect, high-control groups, or a very different culture. Published at **[anytimebook.org](https://anytimebook.org)** and as a free downloadable epub.

## How the repo is laid out

| Path | What's there |
| --- | --- |
| `src/content/docs/` | The book. One Markdown page per Topic, one folder per Area. |
| `sources/outline.md` | The original outline the pages were scaffolded from. |
| `sources/manifest.yml` | Map of each Topic to its Gemini Deep Research doc in Google Drive. |
| `scripts/build-epub.mjs` | Builds the epub from the same pages, using Pandoc. |
| `epub/` | Epub stylesheet (add `cover.png` here for a cover). |

### Topic page frontmatter

```yaml
topic: "4.6"            # Topic number
status: outline         # outline → draft → verified
last_verified: 2026-10-04   # when the facts and resources were last checked
human_reviewed: 2026-11-02  # when a person last read the whole page (set by `npm run review`)
```

Both dates show in the footer of every page ("Facts checked … · Read by a person …").

### Reading pages one at a time

```bash
npm run review                          # opens the next page to read in your browser
npm run review -- --done 4.2            # marks it read today and commits
npm run review -- --done 4.2 --note "…" # also queues a fix in sources/review/<area>.md
npm run review -- --status              # where you are
```

Pages nobody has read come first (safety, health, and big-decisions Areas before the rest), then the page read longest ago. In Claude Code, `/review-next` does the same by conversation.

## Working locally

Needs Node 24+ and (for the epub) Pandoc.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static site in dist/
npm run epub -- v0.1.0   # dist-epub/anytime-book-v0.1.0.epub
```

## Publishing

- **Website:** Cloudflare Workers (Workers Builds) deploys `main` automatically and builds a preview for every pull request. Settings: build command `npm run build`, deploy command `npx wrangler deploy`. `wrangler.jsonc` serves the static `dist/` folder.
- **Epub:** push a version tag and GitHub Actions attaches the epub to a GitHub Release:

  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

  The site's download link always points to the latest release.
