# Claims logs

One file per Topic: `sources/claims/<topic>.yml` (for example `2.1.yml`). It is the fact-check log for **everything checkable on the page**, not just the resources: steps, rules, numbers, timelines, health and safety statements, and generalizations like "most states." The `/fact-check` skill writes it. `node scripts/check-facts.mjs --claims <topic>` validates it.

`sources/resources/<topic>.yml` stays the record for each resource's details (phone, hours, eligibility). This file records whether each *sentence* on the page is backed by a source, with the exact words.

```yaml
topic: "2.1"
page: src/content/docs/safety-and-getting-started/proof-that-you-exist.md
claims:
  - id: c07
    section: "First, a safe place to get mail"   # the page heading it's under
    text: "Mail is held for up to 30 days."       # copied exactly from the page
    kind: number          # see "Kinds" below
    risk: medium          # high | medium | low (how bad it is for a reader if this is wrong)
    verdict: confirmed    # see "Verdicts" below
    source_url: https://faq.usps.com/s/article/What-is-General-Delivery
    quote: "<the sentence from the source, copied exactly>"   # copied exactly from the saved source
    more:                 # optional extra sources, same shape
      - source_url: https://...
        quote: "..."
    fix: "..."            # corrected only: the replacement page text
    note: "..."           # anything the reviewer should know
    checked_on: 2026-10-10
    checked_by: haiku     # haiku | claude | sharon | <name>
    reviewed_by: claude   # set by the review pass; omit until reviewed
    review: agreed        # agreed | changed: <old verdict> -> <new verdict>, with why in note
```

## Kinds

| Kind | What it covers | Example |
| --- | --- | --- |
| `resource` | A statement about a named organization or service: what it does, who it serves, cost, how to reach it | "They pay the fees." |
| `active` | One per resource: evidence it is operating now (dated 2025–26 content, a recent update, no closure notice) | VoteRiders' 2026–2028 plan |
| `number` | Any figure: days, dollars, ages, counts, percentages | "about 5 to 10 business days" |
| `procedure` | How a process works: steps, order, what to bring, what happens next | "They take originals only." |
| `rule` | Law, regulation, or official policy | "It can't be used alone to fly." |
| `health` | Medical or body facts | "Poison Help is open 24/7." |
| `safety` | Advice where a mistake could get someone hurt (abuse, police, immigration, overdose) | escape planning |
| `general` | Generalizations and everyday claims | "Most states ask for ID to order a copy." |

## Verdicts

| Verdict | Meaning | Needs |
| --- | --- | --- |
| `confirmed` | An acceptable source says the same thing | `source_url` + `quote` |
| `corrected` | An acceptable source says something different | `source_url` + `quote` showing the true fact, and `fix` |
| `conflicting` | Acceptable sources disagree | at least two sources (`more`) |
| `unsupported` | No acceptable source found after a real search | `note` saying where you looked |
| `blocked` | The source exists but couldn't be fetched (needs a browser) | `source_url` |
| `needs-human` | Legal or safety advice, or a judgment call | `note` |
| `not-checkable` | Opinion, encouragement, or framing with no factual claim | nothing |

Rules:

- `quote` must appear **word for word** in the saved copy of `source_url` (`node scripts/fetch-source.mjs <url>` saves it to `.cache/sources/`). The checker fails any quote it can't find. This is what stops a made-up quote from passing.
- `text` must appear on the page. If the page changes, the checker flags the claim as no longer on the page, and it gets rechecked.
- High-risk claims are rechecked after 180 days, everything else after 365.
