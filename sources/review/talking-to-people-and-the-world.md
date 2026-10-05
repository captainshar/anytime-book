# Review: Area 7 — Talking to People and the World

Checked 2026-10-04 by Claude. Pages 7.1–7.6 are now `status: draft`. Every listed resource was opened on its own site (several .gov sites block plain fetching, so they were read in a browser tab). The records are in `sources/resources/7.1.yml` to `7.6.yml`.

**Community input (r/HomeschoolRecovery, passed on by the coordinator) for 7.3.** What checked out and is now on the page: volunteer finders (VolunteerMatch is now part of **Idealist**, plus **AmeriCorps** and Volunteer.gov) and a one-line pointer to community-college non-credit classes and parks-and-rec fee help. "Hobby groups" are covered by Meetup. Online communities got a safety bullet under "Watch out for." I found no verified national resource for neurodivergent-friendly social options, so that is a Gemini hand-off below. No users are named or quoted.

**CI note (`npm run check:resources`).** Three name clashes with other Areas are still open, and I can't fix them without editing their files:
- love is respect (7.4, 7.5) vs. 3.4.yml's name `love is respect — "What are my boundaries?" and helpline`
- Recovering from Religion (7.3) vs. 3.6.yml's name `Recovering from Religion — peer support line, chat, support groups`

The checker wants the same phone number to carry the same `name` everywhere. I recommend everyone use the plain org name ("love is respect", "Recovering from Religion"). I already renamed mine to match `Lifeline`, `Social Security Administration`, and `The Deaf Hotline`. I also moved the NAMI HelpLine number off my NAMI Connection record.

## Sharon should check

### 7.1 Phone Calls and Messages
- **Read-aloud scripts.** I put three short scripts on the page as blockquotes: booking an appointment, leaving a voicemail, and buying time. There is also a sample email in a tip box. Check the tone, and whether "Pressing 0 often reaches a person" is too hopeful. It's common, but not universal.
- **GCFGlobal is now LearnFree.org.** The old Email 101 URL returns a 404, so I linked the LearnFree Gmail series instead. Other Areas (8.1) may still link old GCFGlobal URLs.
- **711 Speech-to-Speech.** Gemini pitched this for anxiety-related breathlessness. The FCC says it is for people with a speech disability (it names stuttering as an example), so the page uses the FCC's scope. The FCC's STS page doesn't literally say "free"; the page says "Free to use." Relay calls have no added charge, but you may want to soften this.
- A box-breathing tip is on the page. It's not a medical claim, but tell me if you'd rather link to Area 3.2 instead.

### 7.2 Offices and Paperwork
- **Appeal deadlines.** The page says "Read the deadline on your letter." The only number given is Social Security's 60 days to request reconsideration, which I confirmed on ssa.gov. I gave no other program deadlines.
- **SSA in 2025–26.** The phone number 1-800-772-1213 is confirmed (Mon–Fri 8–7 local; TTY 1-800-325-0778). Field offices have been appointment-based since Jan 6 2025. SSA's 2024-11-13 letter to advocates says it "will not turn people away" who can't make an appointment, and names vulnerable people. The page paraphrases this. The online appointment tool is at ssa.gov/manage-benefits/make-an-appointment.
- **Left off on purpose.** Gemini said readers can cite SSA's internal manual (POMS SI 00601.100) at the counter to force staff to help. It also said Medicaid is "legally required" to help document citizenship. Both are rights claims that could backfire if worded wrong, and Medicaid rules are shifting under H.R. 1. Have a benefits advocate check them if you want them in the book.
- I left out HealthCare.gov navigators and SHIP; they belong in 6.5.

### 7.3 Making Friends
- **Meetup pricing.** This answers your known issue. Members can use a free plan. Organizers pay subscriptions, and a free "Starter Organizer" tier exists. Some groups charge dues ("Request to join" button), and paid events add a service fee. The app pushes a paid "Meetup+," which you can skip with "Continue with free plan." The page says all of this simply. I didn't re-check Meetup's minimum age.
- **AmeriCorps.** The site is live and lists Sept/Oct webinars. Eligibility is 17+ and US citizen, national, or permanent resident, and the application asks for two professional references. That's a real barrier for this audience, and the page says so. The program was cut back in 2025, so re-check before you promote the page.
- **Faith-optional.** Every listed option is secular or open to all, and the page says outright that no group requires shared beliefs. Recovering from Religion is listed for people leaving faith. A non-religious "community gathering" option like a congregation substitute (for example Sunday Assembly or humanist groups) is not included. See the Gemini hand-off.
- **One-thing-first** is "go to the library and ask for the adult events calendar." It says no ID is needed to walk in. That's broadly true, but it isn't verified per library.

### 7.4 Healthy Relationships and Red Flags (have a DV advocate review)
- I confirmed every hotline number on its own site:
  - The Hotline: 1-800-799-7233, text START to 88788
  - love is respect: 1-866-331-9474, text LOVEIS to 22522
  - StrongHearts: 1-844-762-8483, call or text START
  - Deaf Hotline: VP 855-812-1001
- **The Hotline now has an AI chat ("Ruth")** for when no advocate is free, and it warns of long waits. The page tells readers they can call, text, or use live chat to reach a person. Decide whether to say more.
- **I took out a Gemini claim** that hotlines "won't call police unless you ask." It isn't on The Hotline's "What to expect" page. That page says advocates "will never make decisions for you," and the page uses that wording instead.
- **Judgment calls in "Watch out for":**
  - "Couples counseling with an abusive partner can make things worse." This is a common DV-field position, but I did not verify it on an official page this pass.
  - The "paid deprogrammers" warning.
  - The "safety apps can be used to track you" line.
- I left out Gemini's claim that *Why Does He Do That?* is "legally free as a PDF" because it is likely false. You could mention the book and suggest a library copy.
- love is respect's own page gives no age limit (Gemini said 13–26). The page says "teens, young adults, and the people who care about them."

### 7.5 Dating, Sex, and Consent (have a DV/sexual-health reviewer check)
- **RAINN changed.** The number is still 800-656-HOPE (4673), and it now also takes texts: HOPE to 64673. The page includes RAINN's mandatory-report note: if you share your name and location and are under 18 or a vulnerable adult, RAINN must report. Check the wording, since "vulnerable adult" may apply to some readers.
- **Dating-app safety** comes from NNEDV's *Swipe Safely* guide (© 2025), which is current. I didn't name Google Voice; the page gives the general tip of not sharing your real number early.
- **Title X locator.** The locator is live, but Title X funding was withheld from some clinics in 2025. The page says to call first. "Low-cost or free, based on your income" comes from Title X rules, not the locator page.
- **Crisis pregnancy centers.** The "Watch out for" line is factual and calm ("ask what services a place offers"). It's a values call for the book, so keep or cut it as you see fit.
- **Scarleteen is aimed at teens and young adults**, but its articles suit adults who missed sex ed. Its services are for ages 13+. The page says so.
- **Trevor Project** is verified but left out: it's a crisis/suicide line for LGBTQ+ young people, not dating help. A Gemini hand-off for LGBTQ+ dating resources is below.

### 7.6 Everyday Culture
- **Tone.** The page frames customs as "common patterns, not strict rules" that "differ by region, age, and community." Eye contact is softened to "many Americans see eye contact as friendly; looking near the eyes is fine." Please read the small-talk, tipping, and work boxes for stereotypes. I wrote them from general knowledge plus USAHello's communication page (last updated Sept 2022).
- **Tipping amounts.** The page says 15–20% at sit-down restaurants, says tips are "usually expected" for haircuts, delivery, and rides, and says a counter-service tip is optional and "No tip" is okay. These are common norms, not official figures. I gave no dollar amounts for hotel housekeeping or delivery.
- **VOA Learning English was dropped.** It shows no current news after the 2025 Voice of America shutdown. Pop culture is handled with a "it's okay to ask" paragraph and a pointer to the library.
- **Settle In** credits the International Rescue Committee (Gemini said CORE).

## Hand to Gemini

Paste Block A first, then one of these.

**7.3a — Neurodivergent-friendly and low-pressure social options**
> Topic: Low-pressure ways for adults to make friends who are autistic, ADHD, socially anxious, or simply new to socializing (for example, people raised in isolation or high-control groups). Find free or low-cost national organizations and finders for social groups designed for neurodivergent or anxious adults (e.g., autistic-led social groups, peer-run meetups, structured hobby clubs, library "quiet" or sensory-friendly programs). For each, say if it runs online, in person, or both, and how to find a local group. Note age limits, fees, and any diagnosis requirement. Exclude therapy-only programs and anything that charges for "social skills coaching" without credentials.

**7.3b — Faith-optional community gatherings**
> Topic: Secular or faith-optional communities that offer what a congregation does — regular gatherings, shared meals, service projects, life-event support — for adults who left a religion or high-control group and want community without belief requirements. Include national networks (humanist, secular, interfaith-optional, Unitarian-style "all beliefs welcome," Sunday Assembly-type groups) and how to find a local chapter. Flag which are actually active in 2026, which charge dues, and which have any belief or membership requirements. Warn about groups that recruit lonely ex-members.

**7.3c — Safer online communities for people leaving isolation**
> Topic: Moderated online communities and forums where adults leaving isolation, abusive homeschooling, or high-control religion can find peers safely. Find options run by established nonprofits (not anonymous social-media groups), and describe each one's moderation, privacy features (nicknames, no real-name requirement), and cost. Include a short, plain safety checklist for joining any online group (nicknames, not sharing location, meeting in public, spotting recruiters and scammers). Note any that require an ID or a phone number.

**7.5a — LGBTQ+ dating and relationship help for adults of any age**
> Topic: Free, shame-free resources for LGBTQ+ adults (any age, including people coming out later in life after a religious or isolated upbringing) on dating, healthy relationships, and consent. Include national helplines that serve adults over 25 (not only youth), peer-support chat lines, dating-safety guides that address outing threats, and how to find local LGBTQ+ community centers. For each, give current phone, text, and hours, and any age limits.

**7.6a — Pop-culture and current-events catch-up in plain language**
> Topic: Free, plain-language ways for adults who were cut off from mainstream media for years to catch up on current events, recent history, and pop culture without feeling overwhelmed. Find active (2026) news sources written at an easy reading level, library services (e.g., free streaming like Kanopy/Hoopla, magazine apps), and gentle "what did I miss" style explainers from reputable outlets. Note which need a library card, an app, or an account. Avoid partisan or sensational sources.

## Could not verify / dropped

| Topic | Resource | Why |
|---|---|---|
| 7.1 | GCFLearnFree "Email Basics" | Old URL 404s after the GCFGlobal → LearnFree rebrand. Replaced with LearnFree's Gmail series. |
| 7.1 | National Literacy Directory | Live, but it is an adult-ed finder (better in 1.1/8.x), and the site doesn't say who runs it or that it's free. |
| 7.1 | Crisis Text Line, MHA tools | Not checked; they belong in Area 3. |
| 7.2 | SSA POMS "must help you" claim; CMS Medicaid citizenship help | Legal/rights claims not verified on official pages; Medicaid rules are changing. |
| 7.2 | 211 "text ZIP to 898-211" | Not national; texting varies by local 211. |
| 7.2 | HealthCare.gov navigators, SHIP | Out of scope (6.5). |
| 7.3 | Samaritan Scout | Real nonprofit, but its own About page says nationwide coverage is a future goal. |
| 7.3 | VolunteerMatch | Merged into Idealist (listed under that name). |
| 7.3 | MHA affiliates, Secular Therapy Project | Not verified; they fit Area 3. |
| 7.3 | Parks & rec fee waivers ("75–100%") | Single-city sources only. Kept as a general tip. |
| 7.4 | *Why Does He Do That?* "free legal PDF" | Likely false; it's an in-copyright book. |
| 7.4 | Power and Control Wheel | Canonical source (DAIP Duluth) not opened. |
| 7.4 | SAMHSA helpline / FindTreatment.gov | Not re-verified here; Area 3/6.7. |
| 7.5 | Trevor Project | Verified, but it is a youth crisis line, not dating help. Off the page. |
| 7.5 | Google Voice; Google intimate-image removal form | Not verified on Google's pages (Gemini's source for the form was Reddit). |
| 7.5 | VAWA 2022 civil-claim and deepfake law claims | Legal claim; not verified on DOJ's page. |
| 7.6 | VOA Learning English | No current news content after the 2025 VOA shutdown. |
| 7.6 | CRHE alumni guides | Live, but they're about education; better in 8.3/1.1. |
| 7.6 | Pew/AARP tipping articles | Research or magazine pieces, not help resources. |
