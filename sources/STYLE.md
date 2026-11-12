# The Anytime Book style guide

How we write, structure, and verify every page. The `/tighten` skill (`.claude/skills/tighten/`) applies Parts 1–3 to existing pages.

What goes on a page in the first place (who it's for, which questions it answers, which resources earn a spot) is decided by the editorial method in [`EDITORIAL.md`](EDITORIAL.md) and the `/develop` skill. This guide is how the result is written.

- [Part 1: Voice](#part-1-voice): who we're talking to and how we sound
- [Part 2: Structure](#part-2-structure): how pages are built so people can find what they need
- [Part 3: Mechanics](#part-3-mechanics): words, numbers, formatting
- [Part 4: Resource entries](#part-4-resource-entries): the "Where to get help" format
- [Part 5: Verification](#part-5-verification): checking every resource
- [Part 6: Things that need a human](#part-6-things-that-need-a-human)
- [Part 7: Checking your work](#part-7-checking-your-work): what the linter looks for, and how to overrule it

---

## Part 1: Voice

### The reader

Every page is for one reader: an adult with little money, maybe no ID, no family support, and little exposure to the topic. They may have been told the outside world is dangerous. Some read below a high-school level.

**This reader is not a child, and not fragile.** They have survived things most people haven't. They are often sharp, wary, and good at noticing when they're being handled. Write for someone smart who missed some information, not for someone who can't handle it.

### The voice in one line

**Compassionate, no-BS.** We take the reader's experience seriously, explain what's going on and why, and tell them the truth, including the inconvenient parts. Think of a good therapist or social worker talking to you as a peer: warm, direct, a little dry, never syrupy.

Dr. Glenn Patrick Doyle's writing on trauma recovery is the model. What to borrow:

| Do this | Not this |
| --- | --- |
| **Explain why.** Name the mechanism: why the old rule made sense, why the new skill works. Understanding beats permission. | Tell the reader how to feel, or just hand them a rule. |
| **Validate, then move.** One line acknowledging what's hard, then straight to what to do. | Pile up reassurance before getting to the point. |
| **Treat the reader as in charge.** They decide. We lay out options and tradeoffs. | Steer them toward the "right" choice, or praise them for choosing it. |
| **Be honest about effort.** Some things take months. Some offices are rude. Say so. | Promise that it will be easy, fast, or that people will be kind. |
| **Use short, plain, confident sentences.** | Hedge everything, or gush. |

### Plain is not the same as simple-minded

We aim for a 6th–8th grade reading level. That's about **sentence and word difficulty**, not idea difficulty. Adult ideas, plain words.

- Short sentences, mostly under 20 words. But vary the rhythm. A page made only of 6-word sentences sounds like a children's book, and that reads as talking down.
- **Explaining why takes a longer sentence.** "Because," "so," and "which means" join a fact to its reason. Cut every sentence to eight words and the reasons are the first thing to go. When a line reads like a list of orders, join two sentences with the word that connects them.
- Short paragraphs: 1–3 sentences.
- Talk to the reader as "you."
- Explain unfamiliar things matter-of-factly. Don't signal that the reader *should* have known, and don't signal that it's remarkable they didn't.

**Where the book is now.** Measured in November 2026, the book averages about a 4th-grade level and 9 words a sentence, and no page reaches 6th grade. Several pages average 7 words. That is below what this guide asks for. It may be right for the First Things pages, whose readers may be learning to read. For the rest, see Part 6: the target is Sharon's to confirm. `node scripts/check-style.mjs --readability` prints the table.

### Say what a word means, where it first appears

Readers told us the same thing on every page tested: the page used a word they didn't know and kept going. If a term is needed (like "SNAP" or "FAFSA"), say what it means the first time, then use it normally. Learning the real word is part of the point: it's what the office will say.

- **Explain at first use, not three lines later.** If "EBT card" is in the Cost line, the explanation is in the Cost line.
- **Short explanations go in parentheses:** "SNAP (food stamps)." Six words or fewer.
- **Longer ones get their own sentence, right after:** "Put the heel of one hand on the center of their chest. The heel is the firm part of your palm, near the wrist."
- **Abbreviations count,** including ones that feel universal: CPR, EBT, WIC, OSHA, LGBTQ+, and the names of agencies. So do ordinary American things a reader from another country, or an isolated home, may never have met: a thrift store, a front desk, Parks and Recreation, a ZIP code.
- Explain once per page. Pages are read alone, so the explanation on another page doesn't count.

### Write for someone still learning English

Many readers are reading in a second language, on a phone. Idioms and two-word verbs are the hardest part of English, and a reader may take them literally.

| Instead of | Write |
| --- | --- |
| walk away | leave |
| set off (guilt, panic) | cause, start, bring on |
| wound up | tense, on edge |
| sign-off | permission |
| heads-up | warning |
| rule of thumb | a simple rule |
| up front | before, first |
| from scratch | from the beginning |
| rip-off, ripped off | scam, cheated |
| make ends meet | pay for what you need |

The same goes for sports and weather sayings, jokes that depend on a double meaning, and metaphors that could be real ("an alarm goes off" reads as a real alarm). If you keep a metaphor, mark it: "something like an alarm."

### No brochure words, no therapy words

Readers who have been managed their whole lives hear these words as a signal that it's happening again. One test reader's note on "empowerment": "a word I distrust."

| Sounds like a brochure or a therapist | Say what it means |
| --- | --- |
| empower, empowering | (say what the person can now do) |
| self-care | rest, eating, seeing a doctor: name the thing |
| safe space | (say who is there and what the rules are) |
| trauma-informed | "taught by people who know how trauma affects people" |
| nervous system | your body, your heart rate, your breathing |
| triggered, triggering | brings back bad memories, sets off panic |
| toxic | (say what the person does) |
| healing journey, do the work | (cut) |
| resilience, thrive | (cut, or say what changes) |
| access services, navigate the system | get help, deal with offices |

When one of these is the real name of something the reader will have to search for ("empowerment self-defense"), use it once, say it's a name, and explain it.

### Nonjudgmental

- **No "should," "must," or "need to"** when describing the reader's choices. Use "You can…", "Many people start by…", "If you want X, do Y." ("Must" is fine for real rules: "You must be 18 to apply.")
- **No fault-finding words:** "failed to," "neglected to," "bad with money," "irresponsible," "admit."
- **Describe people by situation, not label:** "people leaving a high-control group," not "cult victims." "People who were homeschooled," not "homeschoolers" when it carries baggage.
- **No "everyone knows," "of course," "obviously," "basic," or "simple."** If it were obvious, they wouldn't be reading.
- Values are the reader's. Faith, family, sex, drugs, money: we give facts and safety information, not verdicts.

### Not patronizing

These are the patterns that make kind writing feel like talking down. Cut them.

| Pattern | Example | Fix |
| --- | --- | --- |
| **Stacked reassurance** (more than one in a row) | "This is a map, not a test. You can't fall behind, and you can't fail it. There is no grade at the end." | Say it once: "This is a map, not a course. Use the parts you need." |
| **Telling the reader what they feel** | "Having a name for it is a huge relief." | Say what it does: "A name makes it easier to find others who've been through it, and help that fits." |
| **Cheerleading** | "So can you." "You've got this!" "One small step still counts." | Cut it, or replace it with a fact: "Most adults who learn to read later in life do it in a few months of regular practice." (only if verified) |
| **Granting permission** ("It's okay to…") | "It's okay if your voice shakes." | State the norm: "Lots of people's voices shake on calls. The person on the other end won't care." Use "It's okay to…" at most once per page. |
| **Promises we can't keep** | "They won't judge you." | Say what they're for: "Judging you isn't their job. Helping you make a plan is." Or: "If someone is rude, you can ask for someone else." |
| **"Just" and "simply"** | "Just call 211." | "Call 211." "Just" implies it's easy. Sometimes it isn't. |
| **Diminishing the reader's experience** | "Don't worry about it." | Name it: "This part is stressful. Here's how to make it shorter." |
| **Exclamation points** | "You did it!" | None. Calm sentences carry more weight. |
| **Sentimental closers** | "You're welcome here. Come back whenever you need the map." | End on the next action or a real fact. |

### Honest, without alarm

- Name hard parts plainly: waits, paperwork, ID requirements, rude staff, scams. Then say what to do about them.
- Don't catastrophize, and don't soften danger. "This can get you hurt" is fine when it's true.
- Don't explain policy history or cite statistics unless a number changes what the reader does.

---

## Part 2: Structure

Borrow the good parts of technical documentation: the reader should always know **where they are, whether this page is for them, what to do first, and what happens next.** Don't borrow the coldness: no "the user," no passive voice, no section numbers in prose.

### Principles

1. **Lead with the answer.** The most useful action goes near the top, not after ten resources.
2. **Conditions first.** "If someone is hurting you, text START to 88788." The reader scans for their situation, so put it at the front of the sentence or heading.
3. **One idea per paragraph. One action per step.**
4. **Numbered lists for order. Bullets for options.** If the reader has to do things in sequence, number them. If they're choosing, use bullets.
5. **Headings say what you'll do or find there.** "Find a bed near you," not "Shelter resources." Front-load the key word.
6. **Say what you'll need before you start.** ID, money, internet, an address, time.
7. **Say what happens next.** "They'll mail a card in about 2 weeks." People who've been burned by systems need to know what normal looks like.
8. **Say what to do if it doesn't work.** "If 211 doesn't connect, use the website to find your local line."
9. **Link every cross-reference.** If we mention another Topic, it's a link.
10. **Give the words to say.** Scripts are the example input of this book. Use them anywhere a reader has to talk to an office, a doctor, a landlord, or a stranger.

### Topic page anatomy

A Topic is one of three kinds, and the kind decides the middle of the page. `EDITORIAL.md` (Stage 5) explains how to tell them apart.

| Kind | The reader wants to… | The middle of the page |
| --- | --- | --- |
| `service` | get something from a system | **Where to get help**, sometimes after **How it works** |
| `skill` | do something themselves | **How it works**, then **Where to get help** |
| `inner` | understand something about themselves | **What's going on**, **Things to try**, then **Where to get help** |

Keep the frontmatter as it is. The page, in order:

```markdown
(Lead: no heading. 2–4 sentences.)
What this is, in words you could say to a friend. Who often hasn't got it,
and why, in one line. What changes once you have it: an outcome, not a
promised feeling. ("You'll know where your money goes each month," not
"You'll feel more in control.")

**Good to have first:** [Linked Topic](/area/topic/). One line, only when
it's a real head start. Otherwise leave it out.

:::tip[Start here]
The single most useful first step, in 1–3 sentences, with the script if
there is one.
:::

## What's going on

For `inner` Topics; optional on the others. The mechanism: why this is hard
after the life the reader had, or how the thing works. Explain, don't reassure.

## How it works

For `skill` Topics; optional on `service`. 3–7 numbered steps, each starting
with a verb, or task-shaped ### sections. What you need, what happens, what
to do if it goes wrong. Keep it true anywhere in the US.

## Things to try

For `inner` Topics. Small experiments: free, under 15 minutes, doable alone.

## Where to get help

Grouped under task-shaped ### headings. See Part 4.

## Watch out for

Bulleted traps. See below.

## This opens up

- [Linked Topic](/area/topic/): a few words on why it's next.
```

Rules that go with it:

- **No stub sections.** A heading with less than two full sentences under it isn't a section. Fold it into the lead or cut it. (The first draft had "What it is," "Why it helps you," "Good to have first," and "This opens up" as four one-line sections at the top of every page. The lead and the **Good to have first** line replace them.)
- **The top of the page is for acting.** A reader on a phone reaches **Start here** without scrolling far: keep everything above the first `##` under about 170 words.
- **The `##` headings are the fixed set above**, so readers learn where things are. `###` headings are task-shaped and belong to the Topic.
- **Teach on the page; link for depth.** If a resource's main advice fits in three sentences, write the three sentences and link the resource for more.
- **This opens up** is Topic links only, each with a few words on why. No vague outcomes like "Peace of mind."

Pages that haven't been through `/develop` yet still have the old headings. `node scripts/check-editorial.mjs --status` shows which.

**Watch out for** items follow one pattern: **bold trap name.** How to spot it. What to do instead.

### Asides: use them consistently

Each aside type means one thing. Don't use them for decoration.

| Aside | Means | Example |
| --- | --- | --- |
| `:::caution` | Risk of real harm, or a crisis line. | "If you are in danger right now, call 911." |
| `:::tip` | The fastest or easiest path. Used for **Start here**. | "Start here: Dial 2-1-1…" |
| `:::note` | Context that changes how to use the section. | Religious shelters and what to ask. |

At most one `:::caution` at the top of a page, plus any that are truly needed inline. Too many warnings and people stop reading them.

### Front-of-book pages

The home page, "How to use this book," and Area intros work like documentation landing pages. Each one answers, in this order:

1. **What is this?** One sentence.
2. **Who is it for?** Specific. Name the starting points.
3. **What's in it?** The shape of the content.
4. **Where do I start?** A short "If X, go to Y" list.
5. **What is it not?** Limits: not legal or medical advice, not a crisis line, US only.

Area intros (`index.md` in each Area folder): 2–4 sentences on what the Area covers, who tends to need it, and where to start. Then one line per Topic, linked, saying what the reader will be able to do. No pep talk.

---

## Part 3: Mechanics

- **Capitalize** Area and Topic when they mean parts of this book.
- **Phone numbers:** write as `1-800-799-7233` and link `[1-800-799-7233](tel:18007997233)`. Vanity letters in parentheses after: `(1-800-799-SAFE)`. Text numbers: "Text START to 88788." 911 and 211 can be written `9-1-1` / `2-1-1` when telling someone to dial.
- **Times:** "9 a.m. to 5 p.m. Eastern." "Open 24/7."
- **Money:** "$10 a month." "Free." Not "free of charge" or "no cost to you."
- **Link text says where the link goes:** "the [Red Cross first aid steps](…)", never "click [here](…)". Many readers use a screen reader or skim for links.
- **Bold** for lead-ins in lists and for one key phrase per paragraph at most. Not for emphasis in running sentences.
- **Italics** for book titles and the rare word that needs stress.
- **Em dashes:** sparingly. A period is usually clearer.
- **Contractions:** common ones, yes (don't, can't, you're, it's, won't). "You don't need ID" sounds like a person; "You do not need ID" sounds like a form. Skip rarer ones (you'd, they'll, shouldn't've) that are hard for readers still learning English. Use the uncontracted "do not" for a hard safety line, where missing the "n't" would flip the meaning.
- **Plain Markdown and Starlight asides only** (`:::note`, `:::caution`, `:::tip`). The epub build converts asides; don't use MDX components in Topic pages.

### Word swaps

| Instead of | Write |
| --- | --- |
| utilize, assist, obtain, individuals | use, help, get, people |
| in order to | to |
| eligible for | can get |
| it is important to | (cut it; say the thing) |
| just, simply, easily | (cut) |
| don't worry | (name the worry and address it) |
| victim | person who was hurt / survivor (if they'd use it) |
| should | can / many people / if you want |

---

## Part 4: Resource entries

Under **Where to get help**, group resources under task-shaped `###` headings ("Find a bed near you", "If someone is hurting you"). Each resource:

```markdown
**[Resource name](https://official-url)**
One or two plain sentences on what it does.

- **Cost:** Free
- **Who can use it:** …
- **How to start:** the first concrete step (call, text, click, what to say).
- **Good to know:** ID, money, address, or internet needed; hours if limited.
```

- 3–10 resources per Topic, chosen with the gates and fit scores in `EDITORIAL.md` (Stage 4): one primary pick per job, lowest-barrier first. Prefer national, free, official, or long-running nonprofits. For things that are state- or county-run, link to an official **finder** and say how to find the local version. Never publish state-by-state phone tables.
- **A card has to give the reader something the page doesn't.** If the page already teaches what the resource says, the resource is a source: name it in a sentence ("These steps are from the National Weather Service") and skip the card. Test readers skipped every card whose blurb was "the source for the steps above."
- **Lowest barrier first** in each group: the one that needs only a phone call or a walk-in goes above the one that needs an app, an account, or money. The record's `fit.barriers` score decides, and `check-editorial.mjs` checks the order.
- **Further reading is a sentence, not a card.** A resource whose role is `deeper` gets one line with an honest note on what it asks of the reader (long, dense, sells something, uses spiritual language).
- Never call a local or single-state program national. If a strong program is regional (for example, Holding Out HELP in Utah), you can include it, but say where it serves.
- **Religious and faith-based resources are welcome.** Sometimes they are the only help nearby, and many shelters are religious. Include them when they verify, and say so plainly in **Good to know**: name the faith, quote any religious mission from their own site, and state any religious requirement (services, prayer, Bible study). If the site doesn't say whether there are requirements, tell readers to ask. Never drop a resource only because it is religious.
- **Don't vouch for people's behavior.** Say what a service is for and what it offers. Don't promise staff will be kind or nonjudgmental.
- Page frontmatter: set `status: draft` (Sharon promotes to `verified`) and `last_verified: <today's date>`.

---

## Part 5: Verification

Every resource:

1. Open the organization's **own** page (.gov or the org's domain). A directory, blog, Reddit, or Gemini's citation does not count.
2. Confirm it is operating now (2025–26 content, working contact).
3. Confirm scope: national, state, or local.
4. Phone, text, and URL match the official page exactly. Note limited hours.
5. Eligibility, cost, and ID/money prerequisites match the official page.
6. For benefits, tax, health, immigration, or college aid: check for 2025–26 law changes (H.R. 1 / "One Big Beautiful Bill Act", July 4 2025: SNAP work-rule changes effective on signing; Medicaid work rules required by Jan 1 2027 (some states earlier); 6-month Medicaid renewals from 2027; ACA enhanced subsidies expired end of 2025).
7. If you can't verify it, leave it off the page and record why in the review file.

Record each resource in `sources/resources/<topic>.yml` (see `sources/resources/SCHEMA.md`).

### Writing from what you verified

- **Name the source for safety and health steps, in the sentence:** "These are the American Red Cross's three first aid steps." "MedlinePlus says to contact a provider if you've felt tired for weeks." The reader learns whose advice it is, and the next editor knows what to check it against.
- **Stay as wide as the source and no wider.** If the source says "regular sweats," don't write "night sweats." If it says "inexperienced swimmers," don't write "everyone." Plainer words are fine. A different fact is not.
- **A number is somebody's number.** Attribute it to whoever actually states it on the page you read ("U.S. Masters Swimming says about one-third…"), not to the agency it is rumored to come from.
- **If you can't verify something the reader needs, give them the question, not a guess.** We could not find an official page on what to wear to a swim lesson, so the page gives the words to ask the pool: "What swimwear is allowed? Can I wear a full-coverage swimsuit?" A script is honest where a guess isn't.
- **One person's account is one person's account.** A first-hand story is often the best answer to "what is it like?" Say whose it is and that the reader's experience may differ.
- **Reassurance is a claim too.** "Most of these are treatable" and "it usually gets easier" need a source like any other fact, or they go.
- Every safety, health, legal, or number sentence gets an entry in `sources/claims/<topic>.yml` with the exact words from the source. `node scripts/check-facts.mjs --claims <topic>` checks each quote against the saved page.

### When a site refuses to be checked

Some official sites refuse scripted readers and only load for a person in a browser (cdc.gov, consumer.ftc.gov, ymca.org, and others). Don't work around the block, and don't drop a good resource because of it. Record `blocked_on: <date>` on the resource. `node scripts/check-resources.mjs --by-hand` lists every resource waiting for a person to open it.

**Editing for style never changes facts.** URLs, phone numbers, hours, costs, eligibility, and quoted text stay exactly as verified. If a fact looks wrong while you're editing, flag it; don't fix it in passing.

---

## Part 6: Things that need a human

Do not guess on these. Write them up in `sources/review/<area-slug>.md` instead:

- Legal or safety advice where a mistake could hurt someone (escape tactics, police interactions, immigration, protective orders). Draft it carefully and flag it for review by a DV advocate or lawyer.
- Anything you could not verify, or where official sources disagree.
- Gaps that need new research: write a ready-to-paste Gemini Deep Research prompt that follows Block A of the prompt pack.
- Judgment calls about tone, inclusion, or the book's values.
- **The reading-level target.** This guide says 6th–8th grade. The book measures about 4th, with some pages near 2nd. Either the pages are choppier than intended, or the real target is lower than the guide says, or it differs by Area. That is Sharon's call. Until she makes it, don't shorten sentences further, and don't lengthen them only to raise a number.

---

## Part 7: Checking your work

Four scripts check pages against this guide and the editorial method. None of them can tell whether a page is good. They catch what is cheap to catch, so a person's attention goes to the rest.

| Script | Checks | Fails the build? |
| --- | --- | --- |
| `check-style.mjs` | Voice, plain words, layout, mechanics, resource entry format, reading level (rules below) | No. Advisory. |
| `check-editorial.mjs` | The brief, the page anatomy, every question answered, resources vetted and in order, the reader test | Yes |
| `check-resources.mjs` | Resource records: required fields, stale checks, shared phone numbers. `--by-hand` lists blocked sites. | Yes |
| `check-facts.mjs` | Phone links dial what they show; with `--claims`, every quote is in its saved source | Yes |

### What the style linter flags

| Rule | Catches | Guide |
| --- | --- | --- |
| `minimizer`, `obvious`, `should`, `dont-worry`, `cheer`, `feelings`, `promise`, `fault`, `label`, `permission`, `exclaim` | The patterns in "Nonjudgmental" and "Not patronizing" | Part 1 |
| `long` | A sentence over 25 words | Part 1 |
| `choppy` | Four sentences in a row of six words or fewer | Part 1 |
| `grade` | A page that reads above about 8th grade | Part 1 |
| `acronym` | An abbreviation whose first use isn't explained on that line | Part 1 |
| `idiom` | Phrases a reader learning English may not know | Part 1 |
| `jargon` | Brochure and therapy words | Part 1 |
| `structure`, `watchout`, `caution` | Old page anatomy, unlinked cross-references, trap items without a bold name, too many cautions | Part 2 |
| `wordy`, `phone`, `linktext`, `emdash` | Word swaps, phone numbers that aren't links, "click here," em dashes | Part 3 |
| `entry` | A resource entry missing Cost, Who can use it, How to start, or Good to know | Part 4 |

It cannot see a buried action, a missing answer, a wrong resource, or a line that lands badly with someone who lived it. The reader test and Sharon are for those.

### Overruling a flag

Sometimes the flagged line is right: a quoted mission statement says "should," or "empowerment self-defense" is the name the reader has to search for. Say so in the page, on the line above:

```markdown
<!-- style-ok: jargon (the name of this kind of class; explained in the same line) -->
The National Women's Martial Arts Federation certifies teachers of a kind of class called empowerment self-defense.
```

The flag is then counted as accepted instead of open. Give the reason every time. An accepted flag with no reason is a flag someone got tired of. The aim is a list of open flags short enough that a new one gets read.

