# Calibration audit, October 2026

How accurate was the October 4 verification pass? On 2026-10-10, three independent agents rechecked **30 randomly chosen published resources** (fixed random seed; 6 high-risk, 13 medium, 11 low, across Areas 1–9) against each organization's own site or the responsible .gov agency, without relying on the earlier notes.

## Result

| | Resources | Details checked |
| --- | --- | --- |
| All correct | 22 | 135 correct |
| Minor issue | 8 | 9 overstated |
| Material error | **0** | 12 could not verify |

**Every phone number, text line, set of hours, and cost was right**, and every organization was active in 2026. No reader would have lost time, money, or a trip on these 30.

**Where the errors are:** in how the page is *worded*, not in the recorded facts. Several of the issues are details the resource record had right but the page left out or stretched when it was written (FAFSA's ability-to-benefit route, NFCC's fee waiver). So the risk is drift between record and page, and loose paraphrase. That's what the `/fact-check` claims log is built to catch.

**What this means for the rest of the book:** resource details from the October 4 pass can be trusted as a baseline. The fact-check pass should spend its effort on page wording and on prose claims (steps, rules, "most states"), which were never logged.

## Issues found (for Sharon)

| Topic | Resource | Issue | Suggested change |
| --- | --- | --- | --- |
| 2.1 | CDC Where to Write for Vital Records | "It shows how to order and what the state asks for" overstates it: state pages show fee, address, payment method, and a link. Fees date from a 2022 review. | "It shows the fee, where to send your request, and a link to the state's own site, which lists what they ask for." |
| 4.4 | NFCC | Cost wording is a bit absolute; leaves out that the debt-plan fee can be waived based on income. | Add: "The fee can be lowered or waived if your income is low." |
| 3.5 | CenterLink | "Look for your state" doesn't match the directory (alphabetical, use Filters). "Most activities are free or low-cost" isn't stated. | "Use the Filters to search by state." Cut or soften the cost line. |
| 3.1 | Out of the Storm | "Who can use it" leaves out that only survivors can join; others can read. | "Survivors can join. Anyone can read." |
| 9.6 | Family Caregiver Alliance | "Some programs serve only California": local programs are San Francisco Bay Area only. FCA does publish a toll-free number (800-445-8106), contrary to the record note. | "Some programs serve only the San Francisco Bay Area." Fix the record note. |
| 9.5 | All-Options Talkline | "You don't have to give your name" isn't stated; callback voicemail asks for a first name. | Cut, or "For a callback, they ask for a first name." |
| 8.4 | FAFSA / Federal Student Aid | Leaves out the **ability-to-benefit** route for people without a diploma (in the record, lost on the page). This matters for homeschooled readers. Also frames the SSN as an account issue; it's an aid requirement. | Add the ability-to-benefit route; say a valid SSN is needed to get federal aid. |
| 8.5 | State Vocational Rehabilitation | "Cost: Free": states may ask for cost-sharing on some services based on income. Proof-of-condition line is stricter than the rule (the agency gathers records; SSI/SSDI recipients are presumed eligible). | "Free for most people. Some states ask for help with some costs if your income allows." Soften the proof line. |

Small notes: I Support The Girls' link now redirects (update the URL). Settle In's tie to the International Rescue Committee is stated only in its privacy policy.

Raw results (per detail, with verbatim quotes) were kept in the session scratchpad and are not in the repo.
