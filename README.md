# The Anytime Book, United States Edition

*A free map to everyday adult life — at any time, from any starting point.*

A free, plain-language guide for adults entering mainstream life from hard starting points: neglect, isolation, educational neglect, high-control groups, or a very different culture. Published at **[anytimebook.org](https://anytimebook.org)** and as a free downloadable epub.

## How the repo is laid out

| Path | What's there |
| --- | --- |
| `src/content/docs/` | The book. One Markdown page per Topic, one folder per Area. |
| `sources/EDITORIAL.md` | The editorial method: how a Topic is briefed, researched, vetted, built, and reader-tested. |
| `sources/STYLE.md` | The style guide: voice, page anatomy, resource format, verification. |
| `sources/briefs/` | One brief per Topic: who the page is for and the questions it has to answer. |
| `sources/resources/` | One record per Topic: every resource, when it was verified, and how well it fits the reader. |
| `sources/claims/` | Fact-check logs: each checkable sentence with a word-for-word quote from its source. |
| `sources/review/` | What still needs a person: expert reviews, values calls, leads to verify. |
| `sources/outline.md` | The original outline the pages were scaffolded from. |
| `sources/manifest.yml` | Map of each Topic to its Gemini Deep Research doc in Google Drive. |
| `scripts/check-*.mjs` | Checkers for briefs and page shape (`editorial`), resource records (`resources`), facts (`facts`), and voice (`style`). |
| `scripts/build-epub.mjs` | Builds the epub from the same pages, using Pandoc. |

### How a page gets made

Each Topic goes through four passes, in this order. The first three are Claude Code skills in `.claude/skills/`.

| Pass | Asks | Skill | Check |
| --- | --- | --- | --- |
| Develop | Is it the right page for the reader? | `/develop` | `npm run check:editorial -- --status` |
| Fact-check | Is every sentence true? | `/fact-check` | `npm run check:facts` |
| Tighten | Does it sound right? | `/tighten` | `npm run check:style` |
| Approve | Should it ship? | Sharon | `status: verified` |
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

- **Website:** Cloudflare Workers (Workers Builds) deploys `main` automatically and builds a preview for every pull request. Settings: build command `npm run build`, deploy command `npx wrangler deploy`. `wrangler.jsonc` serves the static `dist/` folder.
- **Epub:** push a version tag and GitHub Actions attaches the epub to a GitHub Release:

  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

  The site's download link always points to the latest release.
