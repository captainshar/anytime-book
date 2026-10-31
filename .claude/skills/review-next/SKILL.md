---
name: review-next
description: Hand Sharon the next Anytime Book page to read, one at a time, and record when she has read it (human_reviewed in frontmatter, notes queued in sources/review). Use when she says "next page", "what should I read next", "review next", "I read it", "done", "mark 4.2 read", or gives reading notes about the page she just read. Not for editing pages (that's /tighten) or checking facts (that's /fact-check).
---

# Review the next page

A thin wrapper around `scripts/review-next.mjs`. Sharon reads pages the way a reader would, a bit at a time, without having to load the whole project back into her head. You keep it to one page and one question.

## "Next" (or no page is open yet)

1. Run `node scripts/review-next.mjs --no-open` and read the page it picked.
2. Open the URL it printed in the built-in browser (`navigate`). Use the live site unless she asks for local.
3. Say one line: the page's number and title, and when its facts were last checked. Nothing else. Don't summarize the page or point out what to look for; that's the gut check she is doing.

## "Done" / "I read it" / "mark it read"

Run `node scripts/review-next.mjs --done <id>`, which stamps `human_reviewed: <today>`, commits "Read <id> <title>", and prints what's next. Then offer the next page in one line.

## Notes about the page ("the Goodbudget price line should go", "the second resource felt preachy")

- Queue it, don't fix it: `node scripts/review-next.mjs --done <id> --note "<her words, lightly tidied>"`. The note lands under "Sharon's reading notes" in `sources/review/<area>.md` for a later `/tighten` or `/fact-check` pass.
- Several notes: join them with "; " in one `--note`, or run `--done` once with the first and append the rest to the same review file by hand under the same heading.
- Only edit the page right then if she explicitly asks for the change now. Even then, keep facts (numbers, URLs, eligibility, costs) exactly as they are unless she gives the new fact.

## Status

"How far am I?" or "what's left": `node scripts/review-next.mjs --status`. Report the count line and, if she asks, the next three.

## Rules

- One page at a time. Don't open several or queue a batch.
- Never change `status` or `last_verified`. Reading a page is not verifying its facts.
- Don't push. She decides when commits go up.
