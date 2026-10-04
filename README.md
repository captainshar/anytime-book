# The Anytime Book

*A map for joining the world — at any age, from any starting point.*

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
last_verified: 2026-10-04   # when resources were last checked
```

## Working locally

Needs Node 24+ and (for the epub) Pandoc.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static site in dist/
npm run epub -- v0.1.0   # dist-epub/anytime-book-v0.1.0.epub
```

## Publishing

- **Website:** Cloudflare Pages builds `main` automatically (build command `npm run build`, output `dist`).
- **Epub:** push a version tag and GitHub Actions attaches the epub to a GitHub Release:

  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

  The site's download link always points to the latest release.
