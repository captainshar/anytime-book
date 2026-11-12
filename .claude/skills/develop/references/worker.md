# Research and vetting worker: instructions

You are doing Stages 3 and 4 (Research, Vet) of the Anytime Book editorial method for ONE Topic.
The book is a free plain-language guide for adults entering mainstream US life from hard starting
points (neglect, isolation, educational neglect, high-control groups, a very different culture).

Work from the repo root. Do NOT edit any tracked file; you only write your report.

## Read first (in this order)
1. sources/EDITORIAL.md  (Stages 3 and 4 are your job; read all of it)
2. sources/STYLE.md  Part 1 "The reader", Part 4, Part 5
3. The Topic's brief, current page, and resource record (paths in your task)

## Tools and hard limits
- Fetch an official page and save its text:
    node scripts/fetch-source.mjs <url>
  It prints the saved file path (.cache/sources/<hash>.txt). Read or grep that file. `--path <url>` prints the path again.
- WebSearch: for LEADS only (finding candidates, finding what readers ask). A search summary is never proof.
- If your task lists the hosts this session can reach, any other host fails. Do not retry it and
  do not look for mirrors, caches, or archives. A resource on a host you can't reach is a LEAD.
- If a site answers 403/429 (it refuses scripts; www.cdc.gov and consumer.ftc.gov do this), record it as
  "blocked: needs a person" and move on (the coordinator records `blocked_on` in the resource record). Do NOT try a headless browser, different headers, or any
  other way around a site's block.
- Never call, text, or message any hotline or organization.
- Do not use the Agent tool.

## The honesty rules (these matter more than coverage)
- A QUOTE must be copied character for character from a saved source file. Before you write a quote
  in your report, grep for a distinctive 6+ word run of it in the saved file and confirm it is there.
  No paraphrase inside quote marks. No quotes from search summaries or from memory.
- If you could not fetch a page, say so. Never fill a gap from memory and present it as checked.
- "Verified" means: you fetched the organization's own page today and the fact is in the saved text.
- If the current page says something the source does not support, report it; that is a finding, not a failure.

## What to produce
Write ONE report file (path in your task), in Markdown, with these sections:

### A. Reader questions
Up to 5 questions real people in this situation ask that the brief does not have, each with the
lead URL where you saw it (forums and search results are fine as leads here). Say which, if any,
you'd rank `must`. Also say if any brief question looks wrong or mis-ranked.

### B. Answers for the page (the teaching content)
For each brief question, `must` first: the facts a page would need to answer it, each as:
  - fact (plain words) | source_url | "verbatim quote" | tier (1-5 per EDITORIAL.md Stage 3)
Only facts you verified today. Safety and health facts need tier 1 or 2. If a question is about
feelings or judgment (no checkable fact), say "no factual claim needed" and note any reputable
source whose framing is worth following. List separately: "facts I looked for and could not verify".

### C. Resources on the page now
One block per resource in the record with on_page: true:
  - reachable today? (fetched / host not reachable / blocked)
  - if fetched: is it live and current (evidence quote), and does every detail in the record AND on
    the page still match? List any mismatch with the quote.
  - gates 1-5: pass/fail with a reason for any fail
  - job: which brief question id(s) it answers (or "none")
  - fit: reach, barriers, readable, trust, fits_reader, actionable (0-2 each) + one-sentence note.
    Score `readable` and `actionable` only from a page you actually read today; otherwise write "n/a".
  - keep as primary / keep as backup / keep as deeper / move to Topic X / cut — and why

### D. New candidates
For each gap (a `must`/`should` question with no good resource, or a reader the current picks leave
out). Look at 2-3 candidates where they exist.
  - VERIFIED candidates (on a reachable host, fetched today): name, url, source_url, scope,
    eligibility, cost, prereqs, phone/text/hours if any, evidence quotes for each of those, gates,
    fit scores + note, job, suggested role.
  - LEADS (host not reachable): name, url, what job it would do, why it looks strong, what a person
    would need to check. Mark clearly UNVERIFIED.

### E. Recommended set
The 3-10 resources you would put on the page, grouped under task-shaped headings, lowest-barrier
first, each with role and one line of why. Then: what you'd cut or move, and which reader is still
not served.

### F. What I could not do
Pages that failed, questions with no source, anything you are unsure about.

Keep the report tight: quotes and decisions, not narration. Your final message to the coordinator
should be 10 lines or fewer: the report path, the 3 most important findings, and what blocked you.
