---
name: fact-check
description: Fact-check Anytime Book Topic pages sentence by sentence against official sources, with a verbatim quote behind every confirmed claim. Dispatches one Haiku worker per page, verifies every quote mechanically, re-reviews the risky and doubtful verdicts with a stronger model, and reports proposed corrections for Sharon to approve. Use when the user says "fact-check", "verify", "re-check", or "audit" a Topic, Area, page, or the whole book, or asks whether a page's facts, numbers, or resources are still right. Not for tone edits (that's /tighten) or for finding new resources (that's research or scouting).
---

# Fact-check pages

Every checkable sentence on a page ends up in `sources/claims/<topic>.yml` with a verdict and, if confirmed, the exact words from an official source that back it up. You coordinate; Haiku workers do the per-page legwork; you review what they found; Sharon approves changes.

**Why it's built this way.** The research behind the book (Gemini) got about 1 in 4 details wrong, and the first verification pass was a single unreviewed pass. So nothing here relies on any one model's say-so:

| Layer | Who | Catches |
| --- | --- | --- |
| 1. Page vs. record | `scripts/check-facts.mjs` | Phone links that dial the wrong number, numbers and links with no verification record |
| 2. Claim log | Haiku, one per page | Wrong facts in the prose: steps, rules, numbers, "most states" |
| 3. Quote check | `scripts/check-facts.mjs --claims` | Made-up or paraphrased quotes (each must appear word for word in the saved source) |
| 4. Review | You (not Haiku) | Quotes that exist but don't actually support the claim; wrong verdicts; risky claims |
| 5. Approval | Sharon | Every change to a page |

Read `sources/claims/SCHEMA.md` and `references/worker.md` before your first run.

## 1. Scope and preflight

- Work out the pages: a Topic number (`2.1`), an Area folder, or "all". Map Topics to files with `node scripts/check-facts.mjs <topic>` (it errors on a Topic it can't find).
- Run layer 1 and keep the output for the report:

  ```bash
  node scripts/check-facts.mjs <topic ...>
  ```

  Any **error** (a phone link that dials a different number than it shows) goes straight to the top of the report.
- If a page already has a claims log, this is a **re-check**: tell the worker to keep the ids, re-verify every claim, and add claims for any new text. Claims the checker says are "no longer on the page" get removed.

## 2. Dispatch workers

One Haiku worker per page. Use the Agent tool with `model: "haiku"` and `subagent_type: "general-purpose"`. Run up to 5 at a time in the background; queue the rest.

Prompt (fill in the blanks; keep it this short, the reference file holds the method):

> Fact-check one page of the Anytime Book. Follow `.claude/skills/fact-check/references/worker.md` exactly; read it first.
> Topic: `<topic>`. Page: `<path>`. Today: `<YYYY-MM-DD>`.
> <If re-check: "This is a re-check: sources/claims/<topic>.yml exists. Keep ids, re-verify every claim, add new ones, drop ones no longer on the page.">
> Write only `sources/claims/<topic>.yml`. Run `node scripts/check-facts.mjs --claims <topic>` until it shows 0 errors, then report as the reference file says.

## 3. Handle blocked sources

Some sites refuse scripts (they need JavaScript or block bots). For each `blocked` claim:

1. Open the URL in the built-in browser and get the page text (`get_page_text`).
2. Save it: write the text to a scratch file, then `node scripts/fetch-source.mjs --save <url> < <file>`.
3. Check the claim yourself (you're already holding the page), or send it back to the worker with SendMessage if there are many.

PDFs: read them with a PDF tool and save the text the same way.

## 4. Review (you, not Haiku)

Run `node scripts/check-facts.mjs --claims <topic>` first: 0 errors means every quote exists. It does **not** mean every quote supports its claim. That's this step.

Review these claims:
- every `risk: high` claim
- every claim that isn't `confirmed` or `not-checkable`
- a sample of the rest: every 5th `confirmed` claim by id (c05, c10, …)

For each, open the saved source (`node scripts/fetch-source.mjs --path <url>` prints where it is), find the quote, and read the paragraph around it. Ask:

- Does the quote actually say what the page says, for the same program, the same group of people, and the current year? Watch for quotes from an "old rules" section, a different state, a different program with a similar name, or a sentence with "not" or "except" just outside the quote.
- Is the source acceptable (worker.md's table)?
- For `corrected`: is the `fix` true, as plain as the original, and no broader than the source?
- For `unsupported`: spend up to five minutes looking yourself. Many of these are findable.

Record on each reviewed claim: `reviewed_by: claude` and `review: agreed`, or `review: "changed: <old> -> <new>"` with the reason in `note`. Fix the claim (verdict, quote, fix) when you change it.

**Track Haiku's accuracy**: of the sampled `confirmed` claims, how many did you change? Put the rate in the report. If it's above 1 in 10 on a page, review every claim on that page, and say so.

## 5. Report to Sharon

For each page, write a short report into the conversation (not a file):

1. **Errors from layer 1**, if any.
2. **Proposed corrections**: a table of claim id, the page text now, the proposed text, and the source link. Only `corrected` claims you agreed with.
3. **Needs you**: `needs-human`, `conflicting`, and `unsupported` claims, one line each on what's at stake. Group the `unsupported` ones: "can't find a source, so suggest softening or cutting" vs. "probably true, needs a better source."
4. **Not active**: any resource whose `active` claim failed.
5. **Numbers**: claims by verdict, how many you reviewed, Haiku's accuracy on the sample, sources still blocked.

Then ask which corrections to apply. Don't edit pages before she answers.

## 6. Apply approved changes

For each approved correction:

- Edit the page text to the approved `fix`. Change nothing else in the sentence.
- If it changes a resource detail (phone, hours, cost, eligibility), update the same field in `sources/resources/<topic>.yml`, with `verified_on: <today>` and a note.
- In the claims log, set `verdict: confirmed`, `text` to the new page text, and `note: "fixed on page <date>"`.
- Set the page's `last_verified` to today. **Leave `status` alone**: only Sharon promotes a page from `draft` to `verified`.

Then run `node scripts/check-facts.mjs --claims <topic>` (0 errors) and `npm run build`. Don't commit unless asked.

## Notes

- Saved sources live in `.cache/sources/` (gitignored). They're working files; the claims log is the record. If someone re-runs the checker on a fresh machine, missing sources show as errors until re-fetched. That's expected.
- Never accept Reddit, forums, directories, or the Gemini docs as proof. They can be leads.
- Never test-call or message a hotline as part of a check.
