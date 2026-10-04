# Review: Area 2 — Safety and Getting Started

Drafted and verified 2026-10-04 by Claude. Pages are `status: draft`. Resource logs are in `sources/resources/2.1.yml` through `2.5.yml`.

## Sharon should check

### Whole Area

- **CI phone-name clashes with other Areas.** `scripts/check-resources.mjs` treats the same phone number under two different names as an error. Three clashes involve this Area. The other agents should rename theirs, or you can pick one name for each:
  - `800-234-9473`: **Lifeline** (2.4) vs "Lifeline (FCC phone and internet discount)" (7.1)
  - `1-800-772-1213`: **Social Security Administration** (2.1) vs "Social Security Administration (SSA) phone and appointments" (7.2)
  - `855-812-1001`: **The Deaf Hotline** (2.2, the org's own name on thedeafhotline.org) vs "National Deaf Domestic Violence Hotline (ADWAS)" (7.4)
  - Names this Area uses that others should copy exactly: `211 (United Way)` (matches 5.1), `National Domestic Violence Hotline`, `National Runaway Safeline`, `LawHelp.org` (matches 5.1).
- **USDA agency rename.** USDA's Food and Nutrition Service is now the **Food and Nutrition Administration (FNA)**. `fns.usda.gov` redirects to `fna.usda.gov`. The pages use fna.usda.gov links. Other Areas (6.5 benefits, 5.3 cooking) may still link to fns.usda.gov.
- **Safety wording needs a DV advocate's review.** These parts give safety advice. A mistake could hurt someone:
  - 2.2 opening: "You do not need ID or money to call any of these lines."
  - 2.2 "Watch out for": the advice to use a library computer or a friend's phone if someone checks yours.
  - 2.4 caution box ("Think before you turn things off"): says a tracker may notice when sharing stops, and suggests talking to an advocate first or using a new phone. This follows NNEDV's Safety Net tech safety plan. Apple's page does not say whether people get notified when you stop sharing.
  - 2.4 Safe Connections: the list of accepted documents is from the FCC page. Check whether "I'm requesting a line separation under the Safe Connections Act" is the right script.
  - 2.5: the sentence about adults getting travel help through a DV program.

### 2.1 Proof That You Exist

- **The order of steps** (mail address, then birth certificate, then SSN, then state ID) is a general pattern. In some states the order is different. For example, some DMVs issue an ID before you have an SSN if you bring a letter from SSA. The page says "A helper can tell you the order that works in your state." Is that enough?
- **VoteRiders eligibility.** The helpline page says nothing about who qualifies. Its mission is helping eligible voters. I wrote "US citizens who are (or soon will be) old enough to vote." Please confirm with VoteRiders, or soften it. Also, their page offers "a copy of your Social Security card" (a replacement). It is not clear they help someone get a **first-time** SSN.
- **I Am Here hotline age range.** The page says "any young person" and gives no upper age. Gemini said under 25. I wrote "Young people... Call to ask if you qualify."
- **SSA identity documents.** These come from ssa.gov and POMS RM 10210.420 (dated 07/31/2026). Religious and immunization records are **not** accepted as proof of identity for adults. Gemini listed religious records, which is wrong. A school record only counts if it is from the **current** school year, and that rarely helps an adult. Most adults will need a certified medical record, a health insurance or Medicaid card that shows a photo or birth date, or a work ID. Check whether the page should say this more strongly.
- **"Many states" claims I did not check state by state:** (a) a shelter or agency letter can prove where you live at the DMV; (b) some states let a helper such as a case manager or lawyer order a birth certificate for you; (c) many states have a free or reduced-fee ID. All three are worded "many" or "some." The old note that a shelter letter is a "McKinney-Vento" rule was wrong and is not on the page.
- **Delayed birth registration steps** are written generically. Each state's rules differ (for example, how much older a person signing a statement must be). Please read for accuracy and tone.
- **Standard ID and flying:** "It can't be used alone to fly." That is true since REAL ID enforcement began in May 2025. Check that you are happy with the wording.

### 2.2 A Safe Place to Sleep Tonight

- **Who the National Domestic Violence Hotline serves.** The Hotline's site frames its work as relationship abuse. Gemini claimed it serves people leaving cults or controlling families. I did not find that on the Hotline's site. I wrote "someone close to them" and "If you're not sure your situation 'counts,' you can still call." Please decide whether that is honest enough. Should the book promise more or less?
- **Holding Out HELP's cost is not stated** on its site. The page says "Not listed on their site. Ask when you call." Their phone line is open only Monday to Thursday, 9 to 4 Mountain time. The page points to 211 and the Hotline for other times.
- **Covenant House** is listed as regional. Ages are 18 to 24 (Gemini said 16 to 24). The 1-800 number is their general and donor line, open weekdays 8:30 to 5 Eastern. The page says so.
- **Faith-based shelters.** Gemini noted that some missions require chapel or have strict rules, which may upset people leaving high-control religion. The page only says "If a shelter doesn't feel right for you, ask 211 about other choices." Do you want a gentler, more explicit line?
- **"Sober home" scam warning.** The 2.2 "Watch out for" bullets follow Gemini's points, which drew on Arizona AHCCCS and ACFE. I did not open those pages. The wording is general on purpose.

### 2.3 Food Right Now

- **SNAP work rules: official sources disagree.** USDA FNA's own consumer pages (the work-requirements page updated Jul 16 2026 and the eligibility page updated Oct 1 2026) **still list** veterans, people experiencing homelessness, and former foster youth as excused from the time limit. Both pages carry a banner saying H.R. 1 guidance is coming. FNA's implementation memo (issued Oct 3, 2025, listed on the usda.gov guidance portal) and state manuals (MD, NM, CA counties) say H.R. 1 **removed** those exceptions. The memo also raised the age to 64, limited the child exception to children under 14, and added an exception for Native Americans. **The page follows the law and the memo.** I could not open the memo PDF itself: it returned a 403 error or a download. Please confirm the caution box wording. Note that areas with waivers may differ, and states may have phased in the changes.
- **Noncitizen SNAP rules also changed under H.R. 1.** FNA's banner says so. The page only says "US citizens and some people who are not citizens." This needs its own check, and it matters for readers from very different cultures (see the Hand to Gemini section).
- **"Many pantries don't need ID, but some do"** is a general statement. Feeding America's page does not mention ID.
- **"Ask the SNAP office what to use for an address if you don't have a home"**: federal rules let homeless households apply. I did not find a current FNA consumer page that says this, so the page does not promise it.
- **Skimming:** the page does **not** promise that stolen SNAP benefits will be replaced. Federal replacement authority lapsed in Dec 2024, unless Congress has renewed it since. I did not check this.

### 2.4 A Phone and an Email Address

- **FCC typo:** the FCC Safe Connections page gives the DV Hotline as "1-888-799-SAFE (7233)." The real number is 1-800-799-7233. The book uses the correct number. You may want to report the typo to the FCC.
- **Gmail vs. Proton.** I listed Gmail first because job sites and offices expect a mainstream address, and Proton second as a privacy option. Is that the order you want? Gemini warned against Gmail because of ad scanning and phone verification.
- **Library guest computer use without a card.** This varies by library. The page says "rules differ, so ask." I did not check any library's policy.
- **"Some phone companies offer a Lifeline plan that costs nothing each month."** The FCC's rule ("If your provider does not charge... you must use it at least once every 30 days") implies such plans exist. I did not name any carrier.

### 2.5 Getting Around

- **Reduced fares** are described generally ("Many transit agencies..."). No state or agency is named, per STYLE.md.
- **"A regular ride usually doesn't need ID"** and **"the driver usually can't make change"** are general transit facts. They are not checked against any one agency.
- **"Buy Here, Pay Here"** warning: softened from Gemini's version. Gemini's sources were a vendor blog and a law-firm article.

## Hand to Gemini

Paste Block A first, then one of these.

### 1. Getting a state ID when you have never had an SSN (2.1)

> Topic: The "no SSN, no ID" loop for US-born adults who were never issued a Social Security number (born at home, off-grid, or in a high-control group). Find, from official SSA and state DMV pages only: (1) whether SSA will issue a first-time SSN to an adult who has a birth certificate but no photo ID, and exactly which identity documents work for that adult under the May 2025 changes to SSA's identity-evidence list (EM-25031, POMS RM 10210.420); (2) how state DMVs handle a first state ID for an adult who has never had an SSN (for example, an SSA letter saying no number was ever assigned); (3) general rules on proving where you live at the DMV with a shelter or agency letter. Do NOT build a 50-state table. Instead, describe the common patterns and give the official page where each state lists its ID document rules. Flag anything you can't confirm on a .gov page. Note any 2025–26 changes.

### 2. Delayed birth registration for adults (2.1)

> Topic: Delayed registration of birth for US-born adults whose birth was never recorded. From official state vital records pages and the CDC/NCHS only, explain: the usual steps (asking for a "no record" letter, the delayed registration application, what evidence states accept, rules for sworn statements from older relatives or witnesses), how long it takes, typical fees and fee waivers, and when a court order is needed. Name free legal help that does this nationwide (legal aid, law school clinics). Describe patterns across states rather than a state-by-state table. Flag paid "document service" companies and scams.

### 3. SNAP rules for people who are not US citizens, after H.R. 1 (2.3)

> Topic: SNAP (food stamps) eligibility for noncitizens in 2026, after the One Big Beautiful Bill Act (H.R. 1, signed July 4, 2025). From USDA Food and Nutrition Administration (fna.usda.gov) and official state SNAP pages only, explain in plain language who among refugees, asylees, green card holders, and other lawfully present immigrants can still get SNAP, what changed and when, whether mixed-status households can still get SNAP for citizen children, and public-charge facts. Include free immigration legal help finders (for example, the DOJ-recognized legal service providers list). Flag any point where official sources disagree.

### 4. Shelters and housing for people leaving high-control groups (2.2)

> Topic: Emergency and transitional housing for adults leaving cults, high-control religious groups, or closed communities (for example, polygamous groups, closed Anabaptist communities, or controlling family groups). Find programs that actually provide beds, host homes, or transitional housing. These are often regional, like Holding Out HELP in Utah. For each, give the area served, eligibility, cost, how to contact, and whether it is faith-based or secular. Also find whether domestic violence shelters accept adults fleeing abuse by parents or a group rather than a partner, and cite official statements from national DV organizations. Only include programs active in 2026.

### 5. Free phones for survivors and people leaving groups (2.4)

> Topic: Free phones (the device, not only the service) for survivors of abuse and people leaving controlling families or groups. Verify on each organization's own site: More Than a Phone, Cell Phones for Soldiers (veterans), and any other national nonprofit that gives free phones. For each, give how a person gets one (directly or only through a shelter), eligibility, and what service comes with it. Also explain how to check a used phone for stalkerware or tracking, citing NNEDV Safety Net, Apple, Google, or the Coalition Against Stalkerware. Flag carrier marketing sites.

## Could not verify

| Resource | Topic | Why dropped |
|---|---|---|
| Homeless ID Project | 2.1 | Serves only the Phoenix and Tucson, AZ areas. Gemini said all 50 states. |
| Bread for the City | 2.1 | DC only. Found in a news article, not checked on the org's own site. |
| State fee-waiver table (PA, CA, DC, NY) | 2.1 | State tables aren't allowed. The page points readers to their own DMV instead. |
| "McKinney-Vento" DMV residency claim | 2.1 | Wrong. These rules are set by each state's DMV. |
| National Safe Place code 69866 | 2.2 | Not on the official page. Only 4HELP (44357) is listed. |
| National Runaway Safeline text code 66008 | 2.2 / 2.5 | Not on the official site. Texts go to 1-800-786-2929. |
| Deaf Hotline email (nationaldeafhotline@adwas.org) | 2.2 | Not shown on the site. |
| Recovering from Religion, Dare to Doubt, Olive Leaf Network, ICSA | 2.2 | They don't provide shelter, and I didn't check them this round. They fit better in Area 3 or 9.2. |
| HUD Resource Locator | 2.2 | The USA.gov page already covers it. |
| FoodFinder, AmpleHarvest | 2.3 | FoodFinder wasn't checked on its own site. AmpleHarvest is mainly for donors. Other finders cover both. |
| Little Free Pantry map, Food Not Bombs | 2.3 | No way to confirm that a listing is stocked or a chapter is active. |
| SUN Bucks | 2.3 | Only for families with school-age kids. Gemini's dollar amount and public-charge claims weren't checked. |
| WIC 30-day self-declaration | 2.3 | Not found on a federal page. |
| Gemini SNAP exemptions (homeless, veterans, foster youth) | 2.3 | Out of date after H.R. 1. |
| Assurance Wireless, SafeLink, TAG Mobile, Life Wireless | 2.4 | Commercial carriers, and their plan details change often. The page uses the official Companies Near Me finder instead. |
| More Than a Phone, Cell Phones for Soldiers | 2.4 | Not checked on their own sites. Gemini's sources were a press release and an Alibaba blog. Handed to Gemini (prompt 5). |
| Tuta, Bitwarden, DuckDuckGo | 2.4 | Not checked. They fit better in 8.2 Staying Safe Online. |
| Affordable Connectivity Program | 2.4 | Ended June 1, 2024. It appears only as a scam warning. |
| Transit app, Google Maps offline | 2.5 | Commercial app or general tip, not checked. They fit better in 8.1. |
| Eldercare Locator | 2.5 | The phone number is real, but the page I opened didn't show hours, ages served, or transportation help. |
| Travelers Aid | 2.5 | Only at a few hubs. Bus tickets only in the DC area. |
| Families to Freedom | 2.5 | Texas only, and not checked. |
| Lyft Up / Uber Health | 2.5 | Riders can't sign up directly. It only works through partner agencies. |
| Mercy Medical Angels / Angel Flight | 2.5 | Not checked, and too niche. |

## Tool notes

- ssa.gov, fna.usda.gov, fcc.gov, and usda.gov block WebFetch (403). I read them in the Browser pane instead.
- The Browser pane's default tab was shared with other agents and jumped to their pages partway through. I switched to my own tab.
- Opening the USDA memo PDF made the browser show a **save-file dialog** to Sharon. No file was saved on purpose. If a dialog appeared, it can be dismissed.
