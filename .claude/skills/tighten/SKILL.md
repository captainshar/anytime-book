---
name: tighten
description: Tighten Anytime Book pages to match the house voice and page structure in sources/STYLE.md — compassionate, no-BS, plain, nonjudgmental, never patronizing, with documentation-style structure (start-here tip, steps, linked cross-references). Use when the user says "tighten", "edit for tone", "apply the style guide", "make this less patronizing", "clean up the voice", or names a Topic, Area, or page under src/content/docs and asks to improve how it reads. Not for choosing resources, adding teaching content, or restructuring a page around its reader (that's /develop), and not for checking facts (that's /fact-check).
---

# Tighten a page

Edit one or more pages in `src/content/docs/` so they match `sources/STYLE.md`. You're a line editor, not a researcher: you change how things are said and how the page is organized, never what the facts are.

## Before you start

1. Read `sources/STYLE.md` in full. Parts 1–3 are the rules you apply. Parts 4–5 tell you what you must not disturb.
2. Work out the scope from the request: one page, an Area folder, or a list. For more than ~5 pages, do one page first, show the user the diff, and confirm direction before doing the rest.
3. Run the checker on the scope to get a starting list:

   ```bash
   node scripts/check-style.mjs path/to/page.md
   ```

   The checker is a pointer, not a judge. It misses most of what matters (stacked reassurance, buried actions, vague headings) and flags some things that are fine (a quoted mission statement, a real "must"). Read the whole page yourself.

## Hard rules: never change these

- URLs, phone numbers, text codes, email addresses, hours, costs, ages, eligibility, and place names.
- Text inside quotation marks that quotes an organization (religious missions, self-descriptions).
- Frontmatter, except: `description` may be edited to match a rewritten lead. Leave `status` and `last_verified` alone.
- Which resources are on the page and which group they're in. You can rename a `###` group heading to be task-shaped; you can't add, drop, or move resources. (Choosing resources is `/develop`'s job.)
- Content flagged for legal or safety review. You can fix wording, but don't change the advice. If the advice itself seems off, flag it.

If you notice a fact that looks wrong, leave it and list it in your report.

## The pass

Go top to bottom. For each section, ask the questions, then edit.

### 1. Has the page been developed?

Run `node scripts/check-editorial.mjs --status`. If the Topic's stage is `built` or `reader-tested`, it already has the anatomy in STYLE.md Part 2: keep its sections and order, and edit wording only. If it says `no brief` or `brief`, the page still has the old headings; do steps 2 and 3 below, and tell the user the page needs `/develop` for anything deeper (missing teaching, wrong resources).

### 2. Opening and Start here

- **Lead.** Merge **What it is** and **Why it helps you** into 2–4 sentences with no heading: what this is in words you could repeat to a friend, then what concretely changes ("You'll know where your money goes each month," not "You'll feel more in control"). Delete both headings.
- Any stacked reassurance, cheerleading, or telling the reader what they feel? Cut to one line, or replace with a fact.
- **Good to have first** becomes one bold lead-in line under the lead, with linked Topics: `**Good to have first:** [A Bank Account](/money/a-bank-account/).` Drop it if there's no real prerequisite.
- If the page has `## If you only do one thing first` at the bottom, move its content up into a `:::tip[Start here]` aside directly after that line. Delete the old section.
- The tip is one action, with the script if there is one. Conditions first: "If someone may hear you, text START to 88788 instead."
- Strip any reassurance padding from it. "A real person will help you find the next step" is fine: it says what happens next. "You can do this" is not.

### 3. Cross-references

- Move **This opens up** to the end of the page, after **Watch out for**. It's the "next steps" section: a bulleted list, each item a linked Topic and a few words on why. Find slugs with `ls src/content/docs/<area>/`.
- If **This opens up** has a vague outcome ("Peace of mind.", "A safer, freer life."), replace it with the Topics it leads to. Use `sources/outline.md` to find which Topics list this one under "Good to have first". If none fit, cut the section and note it in the report.
- Any Topic mentioned by name in body text becomes a link.

### 4. Missing teaching is not a tighten job

If the Topic is a skill or an inner-life Topic (budgeting, laundry, rest, a phone call) and the page is only a list of resources, the page is missing its middle. Don't draft it here: new steps are new facts, and they need the brief, the sources, and the reader test that `/develop` brings. Say so in your report.

If the page already has **How it works**, **What's going on**, or **Things to try**, edit the wording like any other section. Steps start with a verb. One action per step.

### 5. Where to get help

- `###` group headings: task-shaped, condition first. "Find a bed near you", "If you are young". Not "Resources" or "Other".
- Resource blurbs: one or two sentences on what it does. Cut "They won't judge you" and similar promises; say what the service is for instead.
- **How to start:** begins with a verb. Includes the script if a phone call is involved.
- **Good to know:** facts the reader needs before they act. Not reassurance.
- Remove "just", "simply", "easily".

### 6. Watch out for

- Each item: **bold trap name.** How to spot it. What to do instead.
- Direct is good here. "This can get you hurt" is fine when true.

### 7. Sentence-level sweep

Apply Part 1 and Part 3 of STYLE.md line by line:

- Sentences mostly under 20 words, but vary rhythm. If three short sentences in a row sound like a children's book, join two of them.
- Common contractions (don't, can't, you're, it's). Keep "do not" for safety lines.
- Word swaps from the Part 3 table.
- No exclamation points. No "should" about the reader's choices. At most one "It's okay to…" per page.
- Explain new terms once, matter-of-factly, then use them.

### 8. Asides

- `:::caution` only for harm or crisis lines. `:::tip` for Start here. `:::note` for context that changes how to use a section.
- If an aside is decoration, fold it into the text.

## After editing

1. Re-run the checker on what you changed and look at anything left. It's fine for flags to remain if they're right in context.
2. Run `npm run build` if you changed any links, to catch broken internal paths. (If the build is slow or fails for an unrelated reason, say so in the report.)
3. Report to the user, per page:
   - **What changed:** 3–6 bullets, the substantive ones (structure moves, rewritten openings, links added). Skip trivial word swaps.
   - **Flags for Sharon:** anything that looked factually off, any page that needs `/develop`, any tone judgment you weren't sure about.

Don't commit unless the user asks.

## Examples

**Opening, before:**

> ## Why it helps you
>
> Having a name for it is a huge relief. It shows you that you are not broken, and that you are not alone.

**After (as part of the lead, no heading):**

> A name gives you something to search for, so you can find people who've been through it and help that fits. It also makes it clearer that what happened was done *to* you. It isn't a flaw in you.

Why: removes "huge relief" (telling the reader how to feel) and replaces the assertion with the mechanism.

**Resource blurb, before:**

> A counselor can help you build a budget that fits your real life. They won't judge you.

**After:**

> A counselor can help you build a budget that fits your real life. Seeing people who are behind on bills is their whole job.

Why: we can't promise how a stranger will act. We can say what's normal for them.

**Closing, before:**

> Pick one Topic. Just one. Take one small step toward it this week.

**After:**

> Pick one Topic and do the **Start here** step this week.

Why: same advice, no "just," no pep-talk rhythm, and it points at a real feature of the page.
