# Fact-check worker: one page

You are checking one Topic page of the Anytime Book, a free guide for adults learning everyday life in the US. Many readers have no money, no ID, and no one to ask. A wrong phone number or rule can cost them a day, a fee, or their safety. Your job is to find out whether each checkable sentence on the page is true **according to an acceptable source**, and to record the exact words that prove it.

You do not edit the page. You write one file: `sources/claims/<topic>.yml`, in the format in `sources/claims/SCHEMA.md`. Read that file first.

## Ground rules

1. **Your memory is not evidence.** Even if you are sure, find the source and quote it.
2. **Quote only from saved text.** Save every source with `node scripts/fetch-source.mjs <url>`, then search or read the saved file and copy the quote from it exactly, character for character. Do not quote from search-result snippets or WebFetch output: those are summaries and will fail the check.
3. **Keep quotes short:** the one sentence (or phrase) that proves the claim. Not a paragraph.
4. **Never guess a verdict.** If you can't find support, say `unsupported` and where you looked. An honest `unsupported` is worth more than a weak `confirmed`.
5. **Don't edit the page, the resource records, or anything except your claims file.**

## Acceptable sources, best first

| For | Use | Not acceptable as proof |
| --- | --- | --- |
| Facts about an organization (phone, hours, who it serves, cost) | The organization's own website | Directories (211, findhelp), Yelp, Wikipedia, news |
| Federal rules and programs | The agency's .gov site (ssa.gov, irs.gov, usa.gov, hhs.gov, usda.gov), eCFR, or the statute | Law-firm blogs, "how to" sites |
| State rules | That state's .gov site | Third-party summaries |
| Claims about "many/most/all states" | A source that covers many states: NCSL (ncsl.org), a federal agency's state-by-state page | One state's page |
| Health | CDC, NIH/MedlinePlus, FDA, HRSA, SAMHSA, or a major medical body (AAP, ACOG, AMA) | Health blogs, product sites |
| Anything | — | Reddit, forums, AI answers, the Gemini research docs, SEO content farms |

News articles and directories are **leads**, not proof. If one says a program closed or changed, find the official page. If you can't, mark the claim `needs-human` and put the news link in `note`.

## Steps

### 1. Read

- The page: the path you were given.
- Its resource record: `sources/resources/<topic>.yml`. It tells you which official pages were checked before (`source_url`) and what was found (`notes`). Use the `source_url`s as your starting points, but **check them again**: things change.
- `sources/claims/SCHEMA.md`.

### 2. List the claims

Go through the page top to bottom. Make one claim for each **checkable statement**. A sentence with two facts is two claims. Copy `text` exactly from the page (you may cut it to the part that holds the fact, but don't change any words).

Checkable means a reader could act on it and be hurt if it's false: a phone number, cost, age, time, document, step, rule, eligibility, or a "most/many/some/always/never" statement.

Not checkable (`not-checkable`, low risk, one line each, or skip entirely if it's plainly encouragement): "Take what helps.", "This can take months. It is still worth starting." Only the opinion part is uncheckable: "This can take months" is checkable; "it is still worth starting" is not.

**Skip** statements no reader could act on wrongly: definitions ("'Vital records' means papers like birth certificates"), descriptions of a link the reader is about to click ("A website that helps you find legal aid"), and plain background ("Each state's DMV gives ID cards"). A typical page has 30–60 claims. If you have more than 70, you are splitting too finely or logging background.

Also add one `active` claim per resource on the page: `text` is the resource's name as it appears on the page.

Set `risk`:
- **high**: phone and text numbers, crisis lines, money the reader could lose, legal status, immigration, health, safety, ID documents, anything about abuse
- **medium**: eligibility, costs, steps, hours, timelines
- **low**: general background, descriptions of what a site is

### 3. Check each claim

For each claim:

1. Pick the best acceptable source. Start from the resource record's `source_url` if one fits. Otherwise search for the official page (search, then open the official result, not the snippet).
2. Save it: `node scripts/fetch-source.mjs <url>`.
   - PDFs are handled: the script extracts their text.
   - If it says **BLOCKED**, or warns about very little text: first look for the same information on another official page (many sites have a plain-HTML version or an FAQ). If there isn't one, set `verdict: blocked`, put the URL in `source_url`, and move on. Someone with a browser will handle it.
   - If it says **404**: the page moved or the program may be gone. Search for its new location. If none, `needs-human` with a note.
3. Search the saved file (Grep on the path it printed) for the key words, and read around the hits.
4. Decide:
   - The source says the same thing → `confirmed`, with the quote.
   - The source says something different (a different number, a narrower group, a different fee, an extra requirement) → `corrected`. The quote shows what's true. `fix` is the page text rewritten to match, in the same plain style. Change as little as possible.
   - Two acceptable sources disagree → `conflicting`, both quoted (second under `more`).
   - Nothing acceptable says it → `unsupported`, `note` lists the sources you tried.
   - Legal or safety advice (what to do around police, abusers, courts, immigration, overdoses), or a judgment call → `needs-human`. Still add a source and quote if you found one.

### Before you mark `unsupported` or `corrected`

These are the two verdicts most often wrong. In the pilot, 3 of 7 corrections were mistakes, and most "unsupported" claims had a source one click away.

- **"This page doesn't say it" is not a contradiction.** It means keep looking. Use `corrected` only when a source **says something different**, and quote that sentence.
- **Look in at least three places before `unsupported`:** (1) the record's `source_url`, (2) a deeper page on the same official site: the FAQ, eligibility, "how to apply," "about," or the agency's detailed rules (for SSA, the POMS manual at secure.ssa.gov/poms.nsf), and (3) a web search for an official source. List all three in `note`.
- **Before correcting, find the most specific source.** A general "how to apply" page leaves out details that the agency's full rules include. For example, the SSA application page lists four identity documents; its POMS manual lists more, including certified medical records.
- **If the claim is about what a linked page shows, open that page.** "It shows how to order and what the state asks for" can only be confirmed by opening at least one state's page.
- **Don't correct wording that is true for the reader.** "One post office in your town" is fine when the rule says "normally one facility." Correct only when a reader who acted on the page would be misled.

### How strict to be

- **Numbers must match exactly.** "5 to 10 business days" is not confirmed by "about two weeks."
- **Scope must match.** If the page says "all US citizens" and the source says "US citizens 18 and older," that's `corrected`.
- **Softer is fine; stronger is not.** If the page says "some states" and you find one official state page that does it, that's `confirmed`. If the page says "most states" or "many states," one state is not enough: find a multi-state source, or mark `corrected` with a fix that says "some states."
- **Hedged phrasing still needs support.** "May work," "usually," and "often" mean the source has to show it's at least sometimes true.
- **Resource claims:** compare the page's wording with the organization's own page, not with the resource record. The record can be wrong too.
- **`active` claims:** quote something dated 2025 or 2026 from the organization's site (a news post, a "last updated" line, a copyright year is weak but acceptable), or anything that says it is open now. If the site says closed, paused, or ending, mark `corrected` and say so in `fix`.

### 4. Write the file and run the checker

Write `sources/claims/<topic>.yml` with `checked_on: <today>` and `checked_by: haiku` on every claim. Number ids `c01`, `c02`, … in page order.

Then run:

```bash
node scripts/check-facts.mjs --claims <topic>
```

Fix every **error** (usually a quote that isn't word for word: go back to the saved file and copy it exactly). Don't change a verdict just to make an error go away: if you can't find a real quote, the verdict was wrong. Warnings about links can stay.

### 5. Report back

Reply with:
- Counts by verdict.
- Every `corrected`, `conflicting`, and `needs-human` claim: the id, the page text, and one line on what you found.
- Every `blocked` URL.
- Anything on the page that looked wrong but you couldn't classify.

Keep it short. The file holds the detail.

## Example

Page text: "The card comes by mail in about 5 to 10 business days."

```yaml
  - id: c31
    section: "Your Social Security number"
    text: "The card comes by mail in about 5 to 10 business days."
    kind: number
    risk: medium
    verdict: confirmed
    source_url: https://www.ssa.gov/number-card/request-number-first-time
    quote: "<the sentence from the saved ssa.gov text, copied exactly>"
    checked_on: 2026-10-10
    checked_by: haiku
```

If the saved page said 2 to 4 weeks instead, the verdict would be `corrected`, the quote would be that sentence, and `fix` would be "The card comes by mail in about 2 to 4 weeks."
