# Writing and verification guide for Topic pages

Every Topic page is written for one reader: an adult with little money, maybe no ID, no family support, and little exposure to the topic. They may have been told the outside world is dangerous. Some read below a high-school level.

## Voice

- Plain words. Aim for a 6th–8th grade reading level. Short sentences (under 20 words). Short paragraphs (1–3 sentences).
- Talk to the reader as "you". Warm, calm, never condescending, never alarming.
- No jargon. If a term is needed (like "SNAP" or "FAFSA"), say what it means the first time.
- No shame, no "should". Offer, don't order: "You can…", "Many people start by…".
- Don't explain policy history or cite statistics. Say what to do.
- Be honest about hard parts (waits, paperwork, ID needs) without making them sound impossible.

## Page layout

Keep the existing frontmatter and the "What it is / Why it helps you / Good to have first / This opens up" sections as they are. Replace the "Coming soon" note under **Where to get help** with:

```markdown
## Where to get help

### <Group name, e.g. "Find a bed tonight">

**[Resource name](https://official-url)**
One or two plain sentences on what it does.

- **Cost:** Free
- **Who can use it:** …
- **How to start:** the first concrete step (call, text, click, what to say).
- **Good to know:** ID, money, address, or internet needed; hours if limited.

## If you only do one thing first

A short, kind paragraph naming one step.

## Watch out for

- **Trap name.** One or two sentences on how to spot it and what to do instead.
```

- Phone numbers: write as `1-800-799-7233` and also as a link `[1-800-799-7233](tel:18007997233)`. Text numbers: "Text START to 88788".
- 3–10 resources per Topic. Prefer national, free, official, or long-running nonprofits. For things that are state- or county-run, link to an official **finder** and say how to find the local version. Never publish state-by-state phone tables.
- Never call a local or single-state program national. If a strong program is regional (for example, Holding Out HELP in Utah), you can include it, but say where it serves.
- **Religious and faith-based resources are welcome.** Sometimes they are the only help nearby, and many shelters are religious. Include them when they verify, and say so plainly in **Good to know**: name the faith, quote any religious mission from their own site, and state any religious requirement (services, prayer, Bible study). If the site doesn't say whether there are requirements, tell readers to ask. Never drop a resource only because it is religious.
- Page frontmatter: set `status: draft` (Sharon promotes to `verified`) and `last_verified: <today's date>`.
- Plain Markdown and Starlight asides only (`:::note`, `:::caution`, `:::tip`). The epub build converts asides; don't use MDX components.

## Verification rules (every resource)

1. Open the organization's **own** page (.gov or the org's domain). A directory, blog, Reddit, or Gemini's citation does not count.
2. Confirm it is operating now (2025–26 content, working contact).
3. Confirm scope: national, state, or local.
4. Phone, text, and URL match the official page exactly. Note limited hours.
5. Eligibility, cost, and ID/money prerequisites match the official page.
6. For benefits, tax, health, immigration, or college aid: check for 2025–26 law changes (H.R. 1 / "One Big Beautiful Bill Act", July 4 2025: SNAP work-rule changes effective on signing; Medicaid work rules required by Jan 1 2027 (some states earlier); 6-month Medicaid renewals from 2027; ACA enhanced subsidies expired end of 2025).
7. If you can't verify it, leave it off the page and record why in the review file.

Record each resource in `sources/resources/<topic>.yml` (see `sources/resources/SCHEMA.md`).

## Things that need a human

Do not guess on these. Write them up in `sources/review/<area-slug>.md` instead:

- Legal or safety advice where a mistake could hurt someone (escape tactics, police interactions, immigration, protective orders). Draft it carefully and flag it for review by a DV advocate or lawyer.
- Anything you could not verify, or where official sources disagree.
- Gaps that need new research: write a ready-to-paste Gemini Deep Research prompt that follows Block A of the prompt pack.
- Judgment calls about tone, inclusion, or the book's values.
