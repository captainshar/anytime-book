# The Anytime Book editorial method

How a Topic gets decided, researched, vetted, and built. `STYLE.md` says how a page should sound and look. The `/fact-check` skill says whether its sentences are true. This file covers the question neither of them asks: **is this the right page for the reader?**

The `/develop` skill (`.claude/skills/develop/`) runs this method on a Topic. `node scripts/check-editorial.mjs` checks the result and prints where every Topic stands.

- [Why this exists](#why-this-exists)
- [The five stages](#the-five-stages)
- [Stage 1: Brief](#stage-1-brief)
- [Stage 2: Audit](#stage-2-audit)
- [Stage 3: Research](#stage-3-research)
- [Stage 4: Vet](#stage-4-vet)
- [Stage 5: Build](#stage-5-build)
- [Reader test](#reader-test)
- [Where this sits with the other passes](#where-this-sits-with-the-other-passes)

---

## Why this exists

The first draft of the book was built resource-first: outline, then Gemini research, then verify what Gemini found, then pour it into one template. That produced pages that are true and kind, and often still not useful. Four things went wrong, and each stage below fixes one.

| What went wrong | What it looks like on a page | Fixed by |
| --- | --- | --- |
| Nobody wrote down what the reader came for. | A page about rest with a sleep app, a screening quiz, and a crisis line, and one sentence on how to rest. | Stage 1: Brief |
| Resources were whatever the research turned up and survived checking. | Nothing compared against a better option. Nobody asked what a reader with no ID or no smartphone does. | Stages 3–4: Research, Vet |
| One template for three kinds of Topic. | A skill page (swimming) and a feelings page (rest) laid out like a shelter directory. | Stage 5: Build |
| Outline fields were printed as sections. | Four headings in a row with one line under each: "This opens up: Safety and self-trust." | Stage 5: Build |

---

## The five stages

| Stage | Question | What it produces |
| --- | --- | --- |
| 1. Brief | Who is reading, and what do they need to walk away with? | `sources/briefs/<topic>.yml` |
| 2. Audit | What does the current page do for that reader? | Coverage notes in the brief |
| 3. Research | What are the candidates for each gap? | A long list, with sources |
| 4. Vet | Which candidates are good enough, and which is best? | Scored records in `sources/resources/<topic>.yml` |
| 5. Build | What shape does this Topic need? | The page |

Then a **reader test** by someone who did not write the page. Then `/fact-check` and `/tighten` as before.

Work one Area at a time. Sharon reads the briefs before research starts. A brief takes two minutes to read and is the cheapest place to catch a wrong page.

---

## Stage 1: Brief

Write the brief **before opening a single resource**. It is one screen of YAML (format: `sources/briefs/SCHEMA.md`).

### The reader's moment

One or two sentences: what just happened that sent this person to this page? "A coworker invited them to the lake and they can't swim." "They sat down on their first day off and felt sick with guilt." A page written for a moment is specific. A page written for "people who want to learn about swimming" is a brochure.

### The questions

Five to nine questions, **in the reader's words**, each marked:

- **must:** the page has failed if a reader leaves without this.
- **should:** most readers want it.
- **could:** nice to have. First to go if the page gets long.

Where questions come from, in order of trust:

1. People who lived it: Sharon, reader feedback, peer-led groups' own FAQs and guides.
2. People who get asked every day: what librarians, 211 operators, adult-ed teachers, swim instructors, and advocates say beginners ask.
3. What people search and post: forums and "people also ask" results. Good for wording and for questions we'd never think of. Leads only.
4. The editor's judgment. Mark these `from: editor` so the next person knows nobody has checked them against a real reader.

A question the reader would be embarrassed to ask out loud is usually a **must**. "What do I wear?" "Is it weird to start at 30?" "What counts as rest?" Those are the ones nobody else answers for them.

### The rest of the brief

- **Type:** `service`, `skill`, or `inner` (see Stage 5). This decides the page's shape.
- **Outcome:** what the reader can do afterward. A thing you could watch them do.
- **Constraints:** which barriers are likely for this reader on this Topic: no money, no ID, no car, no smartphone, no private space, fear of police, wariness of anything religious, shame about their body.
- **Harms:** what on this page could hurt someone if it's wrong, and who preys on people looking for this.
- **Not here:** what belongs to another Topic. Link it, don't repeat it. This is what stops a page from drifting.
- **Start here:** the one first step. It should need as little as possible: ideally no money, no ID, no internet.

---

## Stage 2: Audit

Read the current page against the brief and mark each question `answered`, `partly`, or `missing`.

Then go the other way: for every resource on the page, which question does it serve? A resource that serves none is a candidate to cut or move, however good it is.

The audit is the honest "before." Keep it in the brief under `audit`.

---

## Stage 3: Research

Search **by the reader's question**, not by topic keyword. "Where does an adult with no money learn to swim" finds different things than "swimming resources."

For each gap, look in this order. Stop when you have two or three real candidates.

| Tier | Source | Use it for |
| --- | --- | --- |
| 1 | **Whoever owns the facts.** The agency or standards body: Social Security, the Weather Service, the American Heart Association, the Red Cross. | Facts, rules, steps. Safety and health statements come from here or they don't go on the page. |
| 2 | **Public explainers.** Federal and state health pages, MedlinePlus, public libraries, Cooperative Extension, long-running national nonprofits. | Plain-language how-to. |
| 3 | **Official finders.** A national locator for a local service. | Anything run by a city, county, or state. |
| 4 | **Peer-led groups.** People with this experience, organized: homeschool alumni, people who left high-control groups, people in recovery. | What it is like, what to expect, who else has done this. Often the best-fitting resource on the page. |
| 5 | **Named experts, creators, and books.** | Depth, when tiers 1–4 don't have it. Say who they are and what they sell. |
| Leads only | Search summaries, Gemini docs, Reddit, forums, directories, blogs. | Finding candidates and reader questions. Never proof. |

Two more places to look:

- **What do the professionals hand out?** A 211 operator, a public librarian, a clinic social worker, and a peer-led group's own resource page have already done this sorting for readers like ours. If three of them point to the same thing, look at it.
- **What would the reader do with no internet?** A phone number, a place to walk into, a thing to ask for. If a question has no offline answer, say so in the brief.

Write down every candidate you looked at, including the ones you reject. Rejections go in `dropped` in the resource record so nobody re-adds them.

---

## Stage 4: Vet

Three steps: gates, fit, and the whole page.

### Gates

A candidate that fails any gate is dropped, with the reason.

1. **Real and running.** Its own page loads and shows it is operating now. (`STYLE.md` Part 5 has the full verification steps. They still apply.)
2. **Honest about reach.** We can say truthfully who it serves and where.
3. **Honest about cost.** Free, or the price is stated, or the page tells the reader exactly how to find the price before paying.
4. **Not a trap for this reader.** No sales funnel behind a "free" label, no hidden agenda (crisis pregnancy centers, conversion therapy, recruiting), no unlicensed person selling a cure.
5. **Does a job in the brief.** It answers one of the reader's questions better than a paragraph on the page could.

### Fit

Score what passes, 0 to 2 on each line. The number is a way to compare candidates for the same job, not a grade. Write one sentence of reasoning (`fit.note`).

| | 2 | 1 | 0 |
| --- | --- | --- | --- |
| **Reach** | Anyone in the US: national, online, or a national finder | Many places, not all | One state or metro |
| **Barriers** | Needs nothing, or only a phone call | Needs one of: internet, a smartphone, an account, ID, proof of income, a library card | Needs several, or money up front |
| **Readable** | Plain words, short, or audio/video. Usable at a 6th–8th grade level. | Readable with effort | Dense, academic, or a wall of text |
| **Trust** | Government, a standards body, or a long-running nonprofit with nothing to sell | Credible, with a shop or upsell beside the free part | One person's site, undated, or sales-led |
| **Fits this reader** | Assumes no family, no prior knowledge, no faith; made for adults | Fine, with a caveat we can state in **Good to know** | Assumes a life our reader doesn't have |
| **Actionable** | The first step is obvious within a minute of landing | Takes some hunting | Unclear what to do |

### The whole page

Resources are a set. Check the set:

- **Every `must` question is answered**, by the page's own text or by a resource.
- **One primary pick per job.** A backup only if it serves a reader the primary can't (no smartphone, not on SNAP, a man, rural). Mark each resource `role: primary`, `backup`, or `deeper`.
- **At least one way in with no internet, and one with no ID and no money,** wherever such a way exists.
- **3 to 10 resources.** A tenth resource costs the reader more attention than it gives back.
- **Nothing does another Topic's job.** Link to that Topic.
- **Lowest-barrier first.** Within a group, the one that needs the least goes on top.

When two candidates are close, prefer the one more likely to still be there next year.

---

## Stage 5: Build

### Three kinds of Topic

| Type | The reader wants to… | The page is mostly… | Examples |
| --- | --- | --- | --- |
| `service` | **get** something from a system | where to go, in what order, and what will happen | A Safe Place to Sleep Tonight, Proof That You Exist, Health Insurance |
| `skill` | **do** something themselves | how to do it, step by step; resources teach more | A Budget, Laundry, Swimming, Phone Calls |
| `inner` | **understand** something about themselves, and feel differently over time | why it's like this, and small things to try; a few resources | Resting Without Guilt, Naming What Happened, Finding What You Enjoy |

Some Topics are two kinds (`also:` in the brief). Swimming is a skill and a service: the page teaches water safety and helps you find lessons.

The test for a `skill` or `inner` page: **if every link on it died tomorrow, would the page still help?** If not, the teaching is missing.

### Page anatomy

```markdown
(Lead: no heading. 2–4 sentences.)
What this is, in words you could say to a friend. Who often hasn't got it,
and why, in one line. What changes once you have it: something concrete.

**Good to have first:** [Linked Topic](/area/topic/). One line, only if it's
a real head start. Otherwise leave it out.

:::tip[Start here]
The one first step, with the words to say if there are any.
:::

## What's going on      (inner; optional on the others)
The mechanism. Why this is hard after the life the reader had, or how the
thing actually works. Explain, don't reassure.

## How it works         (skill; optional on service)
Numbered steps, or task-shaped ### sections. What you need, what happens,
what to do if it goes wrong.

## Things to try        (inner)
Small experiments. Each one free, under 15 minutes, and doable alone.

## Where to get help
Resource entries under task-shaped ### headings (STYLE.md Part 4).

## Watch out for
**Bold trap.** How to spot it. What to do instead.

## This opens up
- [Linked Topic](/area/topic/): a few words on why it's next.
```

Rules that go with it:

- **No stub sections.** A heading with less than two full sentences under it is not a section. Fold it into the lead or cut it. This is what "What it is" and "Why it helps you" were: the lead paragraph says both, better, without the headings.
- **The top of the page is for acting.** A reader should hit **Start here** within one screen on a phone.
- **`##` headings are the fixed set above**, so readers learn where things are. `###` headings are task-shaped and specific to the Topic.
- **Teach on the page; link for depth.** If a resource's main advice fits in three sentences, write the three sentences and link the resource for more. Don't send a reader to a 4,000-word article to get one idea.
- **Every safety or health sentence has a tier 1 or tier 2 source** you have read. Record them in the claims log (`sources/claims/<topic>.yml`).
- Frontmatter: `status: draft`, and `last_verified` moves only when the page's resources were re-checked.

### Area intros

Two to four sentences: what the Area covers, who tends to need it, where to start. Then a line per Topic saying what the reader will be able to do. No pep talk.

---

## Reader test

The person who built the page cannot judge it. A reader test is run by someone (or a fresh model session) who has **the page and nothing else**: not the brief, not this file.

**Part 1: three cold reads.** The tester reads the page as each of these people and answers the same questions for each:

- Someone who left a high-control group last month. Sharp, wary, watching for being handled or recruited.
- Someone who was homeschooled and isolated, with no records and few reference points for ordinary life.
- Someone newly arrived from a very different culture, reading in a second language on a phone.

For each reader: What would you do first after reading this? Which sentence did you not understand? Where did the page talk down to you, scare you, or get in your way? What did you want to know that it didn't tell you?

**Part 2: the question test.** The tester is then given the brief's questions and must answer each one **using only the page**, quoting the lines that answer it. A `must` question with no quotable answer fails the page.

Pass means:

- Every `must` question is answered from the page.
- At least two of three readers name the **Start here** step, or something just as good, as what they'd do first.
- Nothing flagged as talking down, alarming, or blocking is left unaddressed. Fix it, or write down why it stays.

Record the result in the brief under `reader_test`, and anything unresolved in the Area's review file.

A model playing a reader is a stand-in. It catches missing answers, jargon, and buried actions well. It cannot tell you how a page lands with someone who lived it. Real readers and the expert reviewers in `sources/review/README.md` are still the standard for the safety pages.

---

## Where this sits with the other passes

| Pass | Asks | Changes | Tool |
| --- | --- | --- | --- |
| **Develop** (this file) | Is it the right page? | What's on the page, which resources, what order | `/develop`, `check-editorial.mjs` |
| **Fact-check** | Is every sentence true? | Wrong facts | `/fact-check`, `check-facts.mjs` |
| **Tighten** | Does it sound right? | Wording only | `/tighten`, `check-style.mjs` |
| **Approve** | Should it ship? | `status` | Sharon |

Develop comes first. There's no point polishing or fact-checking sentences that are about to be cut.

A Topic is **developed** when its brief is at `stage: reader-tested` and `check-editorial.mjs` shows no errors for it. Developed is not `verified`: only Sharon promotes a page.
