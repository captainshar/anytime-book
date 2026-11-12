---
name: develop
description: Run the Anytime Book editorial method on a Topic or Area — write the reader brief, audit the page against it, research and vet resources with gates and fit scores, rebuild the page in the shape its type needs (service, skill, or inner), and reader-test it with a fresh reader. Use when the user says "develop", "editorial pass", "rework", "restructure", or "this page reads oddly / is thin / is just a list of links", asks whether a page has the right content or the best resources, or asks to write or review a Topic brief. Not for wording-only edits (that's /tighten) or for checking whether existing sentences are true (that's /fact-check).
---

# Develop a Topic

`/tighten` asks whether a page sounds right. `/fact-check` asks whether it's true. This asks whether it's **the right page**: built for a real reader's questions, with the best resources we can find, in a shape that fits the Topic.

The method is `sources/EDITORIAL.md`. Read it in full before your first run, with `sources/STYLE.md` and `sources/briefs/SCHEMA.md`. This file is the order of work.

## 0. Scope and starting point

```bash
node scripts/check-editorial.mjs --status
```

One Area per sitting. Within an Area, write **all the briefs first**, so you can see which Topic owns what (`not_here`).

## 1. Brief (stop for Sharon here)

For each Topic, write `sources/briefs/<topic>.yml` at `stage: brief`. Do this **before reading the Topic's resource record or Gemini doc**; they anchor you to what's already there.

- Start from the reader's moment, then the questions in their words.
- Read the page only to fill in `was:` (answered / partly / missing) and `audit:`.
- Mark every question's `from:` honestly. `editor` means you made it up from judgment.

Run `node scripts/check-editorial.mjs <topic>`. Then **show Sharon the briefs and wait**, unless she has said to carry on. She knows these readers; a wrong `must` question costs a whole page. Ask her two things: which questions are wrong or missing, and whether the type is right.

## 2. Research and vet

One worker per Topic (Agent tool, `subagent_type: "general-purpose"`, up to 5 in the background). Give each `references/worker.md`, the brief, the page, and the record. Workers write a report to your scratchpad; they do not edit the repo.

What you need back: verified facts with word-for-word quotes for the teaching sections, each current resource re-checked and scored, verified new candidates, and unverified leads kept separate.

Limits to state in the worker prompt:

- Which hosts the session can reach, if the network is restricted. A host the worker can't reach is a **lead**, never a verified resource.
- A site that refuses scripts (403, 429) is recorded as "blocked: needs a person." Don't work around a site's block.
- Never contact a hotline or organization.

When reports come back, **spot-check before you trust**: for every safety or health fact you plan to use, and every fifth other quote, open the saved source (`node scripts/fetch-source.mjs --path <url>`) and find the quote. If more than 1 in 10 is off, check them all.

## 3. Choose the set

You choose, not the worker. Apply "The whole page" checks from EDITORIAL.md Stage 4:

- one primary per job, lowest-barrier first
- a way in with no internet, and one with no ID and no money, where they exist
- 3 to 10 resources
- anything that does another Topic's job moves there, or becomes a link

Update `sources/resources/<topic>.yml`: add `job`, `role`, and `fit` to what stays; set `on_page: false` with a note for what leaves the page but is still good; add rejected candidates to `dropped` with the reason. Put unverified leads in the Area's review file under "Leads to verify," not in the record.

## 4. Build the page

Rebuild in the anatomy for its type (EDITORIAL.md Stage 5). The order that works:

1. **Start here.** If you can't write the first step in two sentences, the brief isn't done.
2. **The teaching section** (`What's going on`, `How it works`, `Things to try`). Answer the `must` questions on the page itself. For `skill` and `inner` Topics this is most of the page.
3. **Where to get help**, from the set you chose.
4. **Watch out for**, from the brief's `harms`.
5. **The lead**, last. Now you know what the page is.
6. **This opens up**, as linked Topics with a few words each.

Facts:

- Every safety, health, legal, or number sentence you write comes from a quote in the worker's report that you have spot-checked. Add each to `sources/claims/<topic>.yml` (format in `sources/claims/SCHEMA.md`) and run `node scripts/check-facts.mjs --claims <topic>`.
- Resource details (URLs, phones, hours, costs, eligibility) come from the record. Don't retype from memory.
- Anything in STYLE.md Part 6 (legal advice, escape tactics, weapons) is drafted carefully or left out, and flagged in the review file.

Then fill in each question's `answered_in`, set the brief to `stage: built`, and run:

```bash
node scripts/check-editorial.mjs <topic>
node scripts/check-style.mjs <page>          # fix, or accept with a style-ok comment and a reason
node scripts/check-resources.mjs
node scripts/check-facts.mjs <topic>
npm run build
```

## 5. Reader test

One fresh worker per page, given `references/reader-test.md` and the page path. **Do not give it the brief file**; paste only the list of questions for Part 2. The whole value of the test is that the reader hasn't seen what you meant.

Record each question's result in the brief as `tested: answered`, `partly`, or `not`, exactly as the tester reported it. Then fix what it found. If you added or rewrote a section, re-test that page with a new fresh worker and update the results.

Set `stage: reader-tested` only when every `must` question is `answered`; the checker enforces this. If a `must` can't be fully answered because no source exists yet, leave the page at `built`, say why in `reader_test.notes`, and put it in the Area review file. Don't soften the tester's verdict to get the stage.

## 6. Report

Per page, in the conversation:

- **Before and after:** questions answered (from `--status`), resources kept, added, moved, cut.
- **What the page now teaches** that it didn't.
- **Needs Sharon:** brief questions marked `editor` she should check, values calls, leads to verify by hand, anything flagged for an expert.
- **Reader test:** result and what changed because of it.

Leave `status: draft`. Move `last_verified` only if every resource on the page was re-checked on this pass. Don't commit unless asked.

## What this skill does not do

- It doesn't replace `/fact-check`. New teaching text gets claims entries as you write it; the full sentence-by-sentence pass still runs after.
- It doesn't replace a person who lived it. A model reading as a reader finds gaps and jargon. It can't tell you how a page lands.
