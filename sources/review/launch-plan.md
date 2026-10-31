# Launch plan: trust, tone, and the road to "verified"

Written 2026-10-31. This is the plan for three things Sharon asked for: an automated, trustworthy fact validator (a full crawl before sharing the site, then a slow continuous loop), a tone and presentation pass, and a UI check. It builds on what is already in the repo rather than starting over.

## Where things stand

| | Count |
| --- | --- |
| Topic pages (all `status: draft`, last verified Oct 4–5) | 58 |
| Words | ~61,000 |
| Outbound links on pages | 457 |
| Resource records (`sources/resources/*.yml`) | 418 (412 on page, 6 held back) |
| Of those, high risk (phone lines, money, legal, health, abuse) | 119 |
| Candidates dropped with a reason | 313 |
| Claims logged sentence by sentence (the 2.1 pilot only) | 67 (44 confirmed, 6 corrected, 14 unsupported, 3 need a human) |

What already exists and works:

- **Resource records with a schema** and a checker (`scripts/check-resources.mjs`) that fails CI on missing fields, two orgs sharing a phone number, and stale checks.
- **Weekly link check** (`.github/workflows/links.yml`) that builds the site, runs lychee, and files a GitHub issue.
- **A style guide** (`sources/STYLE.md`, six parts), a style linter (`scripts/check-style.mjs`), and a `/tighten` skill for line edits. These are on `origin/main`; four pages have been tightened.
- **A fact-check system**, on the local branch `claude/fact-check-skill` (not pushed, not merged):
  - `sources/claims/SCHEMA.md`: one claim per checkable sentence, with a verdict and a verbatim quote from an official source.
  - `scripts/fetch-source.mjs`: saves a source page's text so quotes can be checked word for word.
  - `scripts/check-facts.mjs`: fails if a phone link dials a number other than the one it shows, if a quote is not in the saved source, or if a logged claim is no longer on the page.
  - `/fact-check` skill: one Haiku worker per page, mechanical quote check, review of risky and doubtful verdicts by the main model, then Sharon approves every page change.
  - A calibration audit (`sources/review/calibration-2026-10.md`): 30 random resources rechecked by three independent agents. Zero material errors in the recorded facts. Eight pages overstated or dropped a detail the record had right. So the risk is **page wording drifting from the record**, which is exactly what the claims log catches.

What is broken or waiting:

1. **The weekly link issues are mostly false positives.** Three "Resource check" issues (Oct 12, 19, 26) are open and unanswered. Nearly every "404" is on consumer.ftc.gov or consumer.gov. Those pages load fine in a browser; the FTC blocks non-browser clients, and even its homepage returns 404 to curl. Alerts nobody trusts get ignored, which defeats the point.
2. **Local main is 9 commits behind `origin/main`**, and `node_modules` predates the `yaml` dev dependency, so the checkers do not run locally until `npm ci`.
3. **The fact-check branch is unpushed.** It sits cleanly on top of `origin/main`, so merging is a fast-forward, but it lives on one laptop.
4. **The repo is private, while the "How this book was made" page tells readers the project is open on GitHub and invites them to file issues.** They cannot. This also matters for CI: branch protection and unlimited Actions minutes come free only for public repos.
5. **Research gaps:** 53 Gemini follow-up prompts queued, 8 started, 3 saved.
6. **Human experts:** `sources/review/README.md` lists pages that need a DV advocate, a lawyer, a tax volunteer, and a clinician. No automation replaces that; it is the real long pole for the safety pages.

## The validator: how it is built to be trusted

The rule is that no fact reaches a reader on any one model's say-so. Five layers, each catching what the one above it cannot:

| Layer | Runs | Who | Catches | Cost |
| --- | --- | --- | --- | --- |
| 1. Deterministic checks | Every PR and push, in CI | Scripts, no AI | Bad records, phone links that dial the wrong number, quotes not in sources, claims no longer on the page, style rule hits, build or epub failures | Free |
| 2. Link liveness | Weekly, in CI | lychee, then a real browser for anything that failed | Dead or moved pages, with bot-blocks filtered out | Free |
| 3. Claims crawl | Once before launch, then a few pages a week | Haiku workers, one per page | Wrong facts in prose: steps, rules, numbers, "most states", closures | The main token cost |
| 4. Review | Same runs | A stronger model (Claude Opus, or the session model) | Quotes that exist but do not support the claim; wrong corrections; anything high-risk | Moderate |
| 5. Approval | Every page change | Sharon, via a PR with a Cloudflare preview | Judgment, values, tone | Your time |

Three design rules make this hard to fool:

- **A quote must appear word for word in the saved copy of the source**, and the checker enforces it. A model cannot pass a claim by paraphrasing or inventing a quote.
- **`corrected` and `unsupported` are the verdicts most often wrong** (in the pilot, 3 of 7 corrections were mistakes). So the worker rules demand "a source says something different," never "this page does not mention it," and the review layer re-reads every one of them.
- **Only Sharon promotes a page from `draft` to `verified`.** Automation can propose, never promote. Every change lands as a PR, never a push to `main`.

### Continuous loop: where it runs and how it spends tokens

Recommendation: **a Claude Code cloud routine** (claude.ai/code/routines), not a GitHub Action with an API key.

- It runs on your Claude subscription, so "a portion of my monthly tokens" is literally what it uses. No API key to create, store, or rotate.
- It clones the GitHub repo into an isolated cloud sandbox, runs the same `/fact-check` skill and scripts from the repo, and opens a PR. It cannot touch your laptop.
- It can be paused, edited, or run on demand from the routines page, and each run has a log.
- Minimum interval is 1 hour; weekly is right for this.

The weekly routine's job, in order, with hard caps so the spend is predictable:

1. Run layer 1. If anything fails on `main`, open an issue and stop.
2. Pick the **N pages with the oldest `checked_on`**, high-risk claims first (limits: high-risk rechecked within 180 days, everything else within 365). Start with **N = 2**. At 2 pages a week the whole book is rechecked in about 7 months, and the 180-day high-risk window is met by weighting those pages first. Raise N after the first month once you see the real cost.
3. Fact-check those pages with the skill. Write the claims logs. Open **one PR** titled "Recheck: <topics> <date>" with the logs, proposed corrections in the description, and the review-layer notes. The PR gets a Cloudflare preview automatically.
4. **Scouting (one item per run):** take the next unstarted prompt in `sources/review/gemini-queue.md`, search official sources only, and append candidate resources to the Area's review file with the evidence found. It never adds a resource to a page.
5. If the weekly link check left an open issue, recheck each failure and comment with "still down," "moved to <url>," or "false positive, loads in a browser."

Measure before you tune: the 2.1 pilot is the only cost data point so far. Run Area 2 first (five pages) and note the token use the routine's log reports, then set N.

### Why not a GitHub Action with Claude?

It works, but it means an Anthropic API key or OAuth token in GitHub secrets, pay-per-token billing separate from your subscription, and a workflow with write permissions triggered by repo events. The cloud routine gives the same result with less to secure. Keep GitHub Actions for the free, deterministic layers.

## Tone and presentation

The pieces exist: `STYLE.md` Parts 1–3 define the voice ("plain is not simple-minded," "not patronizing," "honest without alarm"), the linter flags the mechanical tells (minimizers, "should," cheerleading, promises, 25-word sentences), and `/tighten` applies the guide one page at a time without touching facts.

What to add:

1. **Run `/tighten` over the remaining 54 pages**, one Area per sitting. Review the diff of the first page in each Area before letting it do the rest; that is already how the skill is written.
2. **A separate reader-panel review**, not a line edit. A judge pass that reads each page as three readers (someone who left a high-control group last month, someone homeschooled with no records, someone newly arrived from another culture) and answers: Where did this talk down to me? Where did it scare me? Where did it get in my way? Where was it vague about what to do next? Output goes to `sources/review/tone-<area>.md` for you, not into the pages. Keeping the judge separate from the editor is what makes its verdict worth something.
3. **A readability line in the linter**, advisory only: words per sentence and a grade-level estimate per page, printed in `--summary`. The guide asks for 6th–8th grade; the number tells you which pages to read first.
4. **Decide the open values calls** in `sources/review/README.md` section 2 (988 Press 3, reproductive health, faith-based tools, privacy tradeoffs). The tone pass cannot settle these and should not try.

## UI pass

The book's stance is "get out of the way," so the bar for adding anything is: does it help a reader act faster or trust the page more? Candidates, in order:

1. **A "Checked on <date>" line on every Topic page**, generated from `last_verified` in frontmatter. Cheapest trust signal there is, and it makes the validator's work visible.
2. **Phone and text numbers as buttons on phones.** Many readers will be on a phone, often an old one. `tel:` links already exist; style them as tap targets, with "Call" and "Text" labels, at least 44px tall.
3. **A "Need help right now?" link in the header** to the crisis and safety Topics (2.x, 988, the DV hotline). One link, always visible, no modal.
4. **A quick-leave control on the safety pages** (9.2 Leaving Family Safely, 7.3 Red Flags, 2.4). DV sites do this: one tap to a neutral site. Worth asking the DV advocate reviewer whether to include it.
5. **A mobile audit at 375px** of the built site: sidebar behavior, aside readability, table overflow, tap target sizes, dark mode contrast. Starlight handles most of this; check rather than assume.
6. **Area icons or small graphics:** only after the above. Nothing decorative inside Topic pages.

Do this as a short browser session against the local build and a Cloudflare preview, with screenshots, after the tone pass so you are not styling text that is about to change.

## Secure CI setup, step by step

Nothing here needs a secret. The only credential anywhere is the Claude GitHub connection that the cloud routine already uses.

1. **Make the repo public, or fix the page.** The disclosure page promises an open project; either make it true or change the wording. Before flipping to public, scan history for anything that should not be there (Drive IDs are fine; look for tokens):

   ```bash
   git log -p --all | grep -iE 'sk-ant|ghp_|api[_-]?key|secret' | head
   ```

   If clean, Settings → General → Change visibility. Public also unlocks branch protection and removes the Actions minutes cap.

2. **Protect `main`.** Settings → Branches (or Rules → Rulesets): require a pull request before merging, require the "Build check" status to pass, block force pushes, and do not allow bypass. This is the gate that makes "automation can only propose" true.

3. **Least-privilege workflows.** Add a top-level `permissions: contents: read` to `ci.yml` (it has none, so it gets the default, which is broader). `links.yml` already scopes to `contents: read` and `issues: write`. `release.yml` needs `contents: write` to attach the epub; keep it tag-triggered only.

4. **Pin third-party actions** (`lycheeverse/lychee-action`, `pandoc/actions/setup`) to a commit SHA rather than a floating tag, and enable Dependabot for GitHub Actions so the pins get PRs when they move. `actions/checkout` and `setup-node` are first-party and fine at a major tag.

5. **Kill the false positives before launch.** In `links.yml`, after lychee, a step loads each failed URL in headless Chromium (`scripts/recheck-links.mjs`) and sorts it three ways: still failing (404, 5xx, no response, or a deep link that now redirects to the homepage), blocked (401, 403, 429: the site refuses automated clients, so it goes on a "check by hand" list and not into the issue), and loaded. Only what still fails opens the issue. The FTC blocks headless browsers too, so its links land in the blocked list; nothing short of a person in a browser can check them, and the one-page-at-a-time human review is where that happens. The `.lycheeignore` approach (listing fda.gov, childwelfare.gov) does not scale and hides real breakage on those domains.

6. **Wire the fact checker into CI** (the branch already does this: `check-facts.mjs` without `--claims` runs on every PR and fails on a phone link that dials the wrong number). Once all pages have claims logs, add `--claims` on the weekly run so a quote that no longer matches its source becomes a warning in the issue.

7. **Add the cloud routine last**, after the first full crawl is merged, so it inherits working skills and a clean baseline. Give it only the tools it needs (Bash, Read, Write, Edit, Glob, Grep, and web fetch for sources); it opens PRs and never merges.

## Phases and what "done" looks like

### Phase 0: housekeeping (one sitting)

- Pull `origin/main`, run `npm ci`, confirm all three checkers run locally.
- Push `claude/fact-check-skill`, open a PR, merge. The `claude/ai-disclosure-blurb` branch holds only an early draft of the AI page that `how-this-book-was-made.md` on `main` superseded; delete it.
- Steps 1–5 of the CI section. Close the three stale issues once the Playwright recheck is in (or triage them by hand in a browser; they are mostly FTC).
- Done when: CI green on `main`, `main` protected, the weekly issue only reports real failures.

### Phase 1: the full crawl (two to three weeks of sittings, Area by Area)

- For each of the ten Areas, in your session: `/fact-check` the Area, review the report, approve corrections, apply, run `/tighten` on the same pages, open one PR per Area, check the Cloudflare preview, merge.
- Expect the pilot's shape: roughly 45 claims per page, two-thirds confirmed, a handful corrected, a dozen unsupported that need either a better source or softer wording.
- Keep the calibration habit: after every three Areas, recheck a random sample of 20 claims independently and record the error rate in `sources/review/calibration-<month>.md`. If the review layer's agreement with the workers drops below 9 in 10, review every claim on those pages.
- Done when: every Topic page has a claims log with 0 checker errors, no `blocked` claims left, and every `corrected` claim is applied or consciously rejected.

### Phase 2: launch gate

- Decide the values calls (review README section 2).
- Get the expert reviews for the pages listed in section 1 of the review README. The safety pages (9.2, 2.2, 2.4, 6.3, 6.7) stay `draft` until a human in that field has read them; everything else can go `verified` on the claims log alone.
- Tone judge pass and UI pass.
- Add a feedback path that does not require a GitHub account (a short form or an email address on the disclosure page). Readers of this book are unlikely to have GitHub.
- Promote pages to `verified` and ship the first epub tag.
- Done when: you would hand the URL to a stranger who needs it tonight.

### Phase 3: continuous (ongoing, low touch)

- Weekly routine: 2 pages rechecked, 1 research gap scouted, link issues triaged. One PR to look at per week.
- Quarterly: read the calibration file, raise or lower N, and feed the scouted resources into pages with a normal `/fact-check` pass.
- Yearly: the law-change list in `STYLE.md` Part 5 step 6 gets reviewed, since benefit rules shift on fixed dates (Medicaid work rules Jan 2027, six-month renewals 2027).

## Decisions only you can make

1. Public repo, or reword the disclosure page.
2. Cloud routine on your subscription (recommended) versus a GitHub Action with an API key.
3. How many pages a week the routine checks after the first month's cost data.
4. The values calls in `sources/review/README.md` section 2.
5. Who the expert reviewers are, and whether safety pages can launch as `draft` with a visible note, or wait.
