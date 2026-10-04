# Review: Area 4 — Money

Drafted and checked 2026-10-04 by Claude. Every resource on the pages was opened on the organization's own site (or, where that site blocks scripts, on an official .gov page that names it). Details are in `sources/resources/4.*.yml`.

All eight pages are educational, not personal financial advice. 4.6 has a short note at the top of "Where to get help" saying so.

## Sharon should check

### Whole Area

- **Phone numbers I couldn't read on the org's own page** (the sites block scripts or load by JavaScript):
  - MyFreeTaxes 1-866-698-9435 (4.3). This matches the number you gave me and other directories, but I couldn't see it on myfreetaxes.com.
  - TransUnion freeze line 1-888-909-8872 (4.4). I confirmed it only from transunion.com search snippets, because the page returns 403.
  - AnnualCreditReport.com 1-877-322-8228 (4.4). This one is confirmed on the FTC's page.
  - Please open these three in a browser.
- **Wrong numbers in Gemini, now fixed.**
  - GreenPath's main number is **1-800-550-1961**. Gemini gave three different numbers.
  - NFCC: I used the contact-page number, 1-800-388-2227. The NFCC homepage also shows 877-360-6322 and 833-746-7578.
  - Equifax's own freeze line, 888-298-0045, is different from the Equifax number on Experian's page (888-378-4329). The page uses Equifax's own.
- **Cross-Area phone clash (not my file).** `node scripts/check-resources.mjs` fails on 8.2. That file lists 1-877-382-4357 under an IdentityTheft.gov URL. 877-382-4357 is the FTC's general and ReportFraud line. The FTC gives **1-877-438-4338** as IdentityTheft.gov's number, which is what 4.4 uses. Someone needs to fix 8.2.
- **CFPB is still working.** The complaint portal and phone line (855-411-2372, Monday to Friday, 9 to 6 ET) are live. Pages were updated in Sept 2026. The site now also mentions "debanking" complaints under an executive order. I left that off.

### 4.1 A Bank Account

- I didn't name single banks. The page points to the Bank On list instead, which includes Chase, Capital One, Wells Fargo, and others. Do you want one or two named examples?
- I described Bank On fees as "low or no monthly fee" and "$25 or less" to open. The 2025-26 standard allows up to $5 a month, or up to $10 if the fee can be waived.
- The address workarounds (shelter letter, friend's address) are general, from FDIC and bank practice. The ACP sentence says banks are "allowed" to accept the address; Gemini wrongly said "must". The page points to 9.2 for ACPs. Please make sure 9.2 covers ACPs.
- The ID help is not repeated here. The page sends readers to "Proof That You Exist." The I Am Here hotline is verified and noted in the YAML, if 2.x needs it.

### 4.3 Your Paycheck and Taxes

- **Dependent / SSN misuse section.** Please read this carefully; it's the most delicate part.
  - Under-19 or student-under-24 rule: from the IRS dependents FAQ.
  - "If your e-filed return is rejected, you can mail a paper return": from the IRS e-file reject FAQ, which covers an SSN used as "filer, spouse, or dependent" on another return.
  - "If you get a CP87B and really aren't their dependent, you don't need to do anything": from the IRS CP87B page.
  - I did **not** say an IP PIN lets you e-file past this kind of reject. The IRS says that for duplicate *dependents*, not clearly for an adult who was claimed. The page only says to get an IP PIN for next year.
  - A tax professional or VITA coordinator should look this over.
- No dollar figures appear on the page. The YAML records VITA's "about $70,244" and Free File's $89,000 AGI, both for tax year 2025.
- Direct File is described as "isn't available right now."
- I left out Trump Accounts entirely. Gemini's section was for parents of newborns. Say if you want a one-line mention.
- The ITIN section was dropped this pass (see Hand to Gemini).

### 4.4 Credit and Debt

- The "Hard choices when it's family" bullet tells readers they can freeze credit first, with no police report, and then talk to legal aid. That's a judgment call on safety and tone. An advocate should check it.
- I removed secured cards and credit-builder loans as named products. The page explains the idea only through the "pay in full" tip. Do you want a short, non-product explainer on building credit from zero? That's a gap; see the Gemini prompt below.

### 4.5 Saving and an Emergency Fund

- The SSI asset-limit warning is phrased generally ("ask your caseworker or legal aid"). Check that it fits Area 6.5.
- "Open a savings account next to your checking" is phrased as a suggestion, not advice. Check the tone.
- **Thrivent's Money Canvas** was dropped. I couldn't load the page, and Thrivent is a Christian membership organization, which matters for readers leaving high-control religion. Please make a values call before anyone re-adds it.

### 4.6 Growing Your Money

- This is the page most likely to read as advice.
  - "If you only do one thing first" asks the reader to ask HR about a match. It says "many people choose" to save enough to get it. It does not tell them to.
  - The "Investing money you'll need soon" bullet uses "many people" framing too.
  - Please check the tone.
- Saver's Match: the page says it starts with tax year 2027, first claimed in 2028, and excludes anyone claimed as a dependent. That last part ties back to the 4.3 parent-claim problem.

### 4.7 Money Traps to Avoid

- The MLM bullet compares MLMs to "the group you left." That fits the book's readers, but it's a values and tone call.
- Gemini's "99% of MLM participants lose money" figure is not from the FTC, so I didn't use it. The FTC says "most make little or no money; some lose money."

### 4.8 Shopping Smart

- The click-to-cancel status comes from law-firm summaries of the July 8, 2025 Eighth Circuit ruling. I found no FTC page stating the current status. Check whether the FTC has restarted rulemaking in 2026.
- Cooling-Off Rule: it's $25+ at home and **$130+** at temporary locations. Gemini said $25 for both.

## Hand to Gemini

Paste Block A first, then one of these.

**1. Parents who misused an adult child's identity (4.3 / 4.4)**

> Topic: Recovering when a parent or family member has misused your identity. Find free, official guidance for adults (18–25 especially) whose parents opened credit cards, utilities, or loans in their name; kept claiming them as a tax dependent after they became independent; used their Social Security number for work or benefits; or hold their documents. Cover: IdentityTheft.gov steps when the thief is a family member (is a police report required, and what are the alternatives?); disputing accounts opened while the person was a minor; credit freezes; IRS steps when a parent wrongly claims you (paper filing, CP87B, IP PIN); checking your Social Security earnings record for work you didn't do; and free legal aid or victim advocates who handle family identity theft. Address safety: what happens to the parent if you report, and how to proceed if reporting feels unsafe. Official .gov and established nonprofit sources only.

**2. Building credit from zero, safely (4.4)**

> Topic: Building a first credit history with no credit file, low income, and possibly an ITIN instead of an SSN. Find free, non-commercial explanations of secured credit cards, credit-builder loans from credit unions or CDFIs, being added as an authorized user (and the risks if the other person is controlling), and rent or utility reporting. For each, say what it costs, what's needed to start, and what to watch out for. Include how to find a local credit union or CDFI that offers credit-builder loans, and whether any credit-builder lending-circle programs serve people nationwide (state where each program actually operates). Avoid listing specific commercial card products unless a government or nonprofit source names them.

**3. Matched savings (IDAs) in 2026 (4.5)**

> Topic: Matched savings programs (Individual Development Accounts) for low-income adults in 2026. The Prosperity Now IDA map no longer works. Find how a person can locate an active IDA or matched-savings program today, nationwide: current federal or state funding, which kinds of organizations run them (community action agencies, CDFIs, tribal programs), and any working national or state directories. For each, give eligibility, match rate, what savings can be used for, and whether savings affect SSI, SNAP, or Medicaid. Note clearly if a program is in only one state or city.

**4. Getting an ITIN safely (4.3)**

> Topic: Getting an ITIN (Individual Taxpayer Identification Number) without mailing away original documents. Find current 2026 IRS guidance on Form W-7, IRS Taxpayer Assistance Centers that check documents in person (and how to book), Certifying Acceptance Agents (including free ones at VITA sites), and what an ITIN can and can't be used for (banking, taxes, credits). Include scams that target ITIN applicants, and free nonprofit help. Official IRS pages first. Note anything that changed in 2025–26.

## Could not verify

| Topic | Resource | Why it was dropped |
|---|---|---|
| 4.2 | EveryDollar | The pricing page returns 404, so I couldn't confirm the free tier. |
| 4.2, 4.8 | GCFGlobal / LearnFree | The site is mid-rebrand. Old links 404, and the new "Money Basics" series page has no lessons. Recheck later. The 8.1 owner should know. |
| 4.2 | Mint | Shut down in 2024. |
| 4.4 | Mission Asset Fund Lending Circles | Couldn't confirm where it serves. Some programs are Bay Area only. |
| 4.5 | Prosperity Now IDA map | The URL now redirects to the homepage. |
| 4.5 | Thrivent Money Canvas | The page didn't load. There's also a values concern (see above). |
| 4.6 | Khan Academy Personal Finance | Bot challenge; I couldn't see the course. It's probably fine, but check by hand. |
| 4.8 | Consumer Action Handbook (USA.gov) | usa.gov/handbook returns 404. It looks discontinued. |
| 4.3 | CP53E direct-deposit rule change | Only sourced from a Taxpayer Advocate blog. I couldn't confirm it on an IRS page. |
| 4.3 | ITIN details, including the TAC line 844-545-5640 | Not checked this pass. |
| 4.5 | Commercial high-yield savings accounts | Rates change constantly, and Gemini's table came from one bank's marketing blog. |

The YAML files also list resources I left off for scope reasons (verified or not): I Am Here hotline, NACAP, Fraud.org, NACA, Privacy.com, Keepa, FakeFind, and Google Shopping.
