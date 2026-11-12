# Topic briefs

One file per Topic: `sources/briefs/<topic>.yml` (for example `10.2.yml`). The brief says who the page is for and what it has to do, **before** any resource is looked at. The method is in `sources/EDITORIAL.md`. `node scripts/check-editorial.mjs` checks briefs against pages.

```yaml
topic: "10.2"
page: src/content/docs/fun-rest-and-being-you/resting-without-guilt.md
type: inner              # service | skill | inner (EDITORIAL.md, Stage 5)
also: skill              # optional second type
stage: brief             # brief → built → reader-tested
reader: >                # the moment that brings them here, 1–2 sentences
  They sat down on a day off and felt guilty, restless, or scared.
outcome: >               # what they can do afterward; something you could watch
  They can rest for a short time on purpose, and know what the guilt is.
start_here: "Set a timer for five minutes and do one restful thing."
constraints: [no money, no private space, wary of religious framing]
harms:
  - "Stillness can bring up panic or memories for trauma survivors."
not_here:
  - what: "How to fall asleep"
    topic: "1.5"
questions:
  - id: q1
    ask: "Why do I feel guilty when I stop?"   # in the reader's words
    priority: must                              # must | should | could
    from: editor            # lived | practitioner | search | outline | editor
    was: missing            # audit of the page before this pass: answered | partly | missing
    answered_in: "What's going on"   # a heading on the page; filled in at build
audit: >                 # optional: what the page did and didn't do before this pass
  Seven resources, three of them about sleep and screening. No explanation of rest.
reader_test:             # filled in after the test
  date: 2026-11-12
  by: claude (fresh session)
  result: pass           # pass | fail
  notes: "2 of 3 readers named Start here. Fixed: 'nervous system' unexplained."
```

Rules:

- 5 to 9 questions. At least two `must`.
- `from: editor` means nobody has checked the question against a real reader. Sharon, or a reader, can change it to `lived`.
- `answered_in` must match a `##` or `###` heading on the page exactly, or be `Lead`, `Start here`, or `Watch out for`. The checker enforces this from `stage: built` on.
- `not_here` topics must exist. The page should link each one.
- Quote YAML strings that contain colons.

## Fields this adds to resource records

For a Topic with a brief, each `on_page` resource in `sources/resources/<topic>.yml` also carries:

```yaml
    job: [q3]              # the brief question(s) this resource answers
    role: primary          # primary | backup | deeper
    fit:                   # 0–2 each; the table is in EDITORIAL.md, Stage 4
      reach: 2
      barriers: 1
      readable: 2
      trust: 2
      fits_reader: 1
      actionable: 2
      note: "Needs a smartphone. Best free first aid reference; reads steps aloud."
```
