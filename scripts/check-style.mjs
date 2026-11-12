// Flags voice, wording, and layout problems described in sources/STYLE.md.
// Usage: node scripts/check-style.mjs [--summary] [--readability] [--strict] [path ...]
//   With no paths, checks every page under src/content/docs.
//   --summary      one line per file (flag counts by rule, plus reading level).
//   --readability  a table of every page's reading level, hardest first, and nothing else.
//   --strict       exit 1 if anything is flagged (default is advisory: always exit 0).
// This is a pointer for a person or the /tighten skill, not a judge. Some hits are fine in
// context (a quoted mission statement that says "should", a real rule that says "must").
// To keep a flagged line as it is, put `<!-- style-ok: rule (reason) -->` on the line above it.
// Accepted flags are counted, not hidden, so the list of open flags can reach zero.
//
// Rules, and where each comes from in STYLE.md:
//   Part 1 voice:    minimizer, obvious, should, dont-worry, cheer, feelings, promise, fault,
//                    label, permission, exclaim, long, choppy, grade
//   Part 1 plain:    idiom, jargon, acronym
//   Part 2 layout:   structure, watchout, caution
//   Part 3 mechanics: wordy, phone, linktext, emdash
//   Part 4 entries:  entry
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DOCS = 'src/content/docs';
const args = process.argv.slice(2);
const summary = args.includes('--summary');
const readability = args.includes('--readability');
const strict = args.includes('--strict');
const paths = args.filter((a) => !a.startsWith('--'));
const MAX_WORDS = 25; // longest sentence before a flag
const MAX_GRADE = 8.5; // the guide asks for 6th–8th grade
const SHORT_WORDS = 6; // a "short" sentence
const SHORT_RUN = 4; // this many short sentences in a row reads as talking down (Part 1)
const MAX_EMDASH = 2; // "sparingly" (Part 3)
const MAX_CAUTIONS = 2; // one at the top plus one inline, at most

// [rule id, regex, short reason]. Checked against prose with quotes and link targets removed.
const PHRASES = [
	['minimizer', /\b(just|simply|easily)\b/gi, 'implies it is easy; cut it'],
	['obvious', /\b(of course|obviously|everyone knows|basic stuff)\b/gi, 'implies the reader should already know'],
	['should', /\b(should|shouldn['’]t)\b/gi, 'prescriptive; try "you can" or "if you want"'],
	['dont-worry', /\bdon['’]t worry\b/gi, 'dismisses the worry; name it and address it'],
	// "You can do it." is cheering. "You can do it alone" is a fact, so the phrase has to end the sentence.
	['cheer', /\b(you['’]ve got this|so can you|still counts|proud of you)\b|\byou can do (?:it|this)(?=\s*[.!]|\s*$)/gi, 'cheerleading'],
	['feelings', /\b(huge relief|you['’]ll feel|you will feel)\b/gi, 'tells the reader what they feel'],
	['promise', /\b(won['’]t judge|will not judge|no one will judge|non-?judgmental|judgment-free|friendly staff|caring staff|will be kind|always kind|safe and welcoming)\b/gi, 'vouches for how people will act; say what the service is for (Parts 1, 4)'],
	['fault', /\b(failed to|neglected to|bad with money|irresponsible)\b/gi, 'fault-finding'],
	['label', /\bvictims?\b/gi, 'describe the situation, not a label'],
	['wordy', /\b(utilize|assist|obtain|individuals|in order to|it is important to|free of charge)\b/gi, 'plain-word swap (Part 3)'],
];
// Checked with link text removed too, so a resource's own name ("Empowerment Self-Defense") doesn't trip them.
const PLAIN = [
	// Phrases a reader learning English may take literally, or not know at all.
	['idiom', /\b(walk(?:s|ed|ing)? away|set(?:s|ting)? off|wound up|sign-off|heads[- ]up|rule of thumb|ballpark|red tape|from scratch|on the fly|touch(?:ing)? base|out of pocket|through the cracks|ball rolling|back on your feet|make ends meet|ripped? off|rip-off|under the table|piece of cake|hang in there|bottom line|catch-22|a ton of|in a pinch|up front|on the spot|at the end of the day)\b/gi, 'idiom: hard for readers still learning English; say it plainly'],
	// Words that sound like a therapist or a brochure. Readers who have been managed notice them.
	['jargon', /\b(hold(?:ing)? space|your truth|healing journey|wellness journey|self-care|inner child|safe space|do the work|doing the work|trauma-informed|nervous system|empower(?:s|ed|ing|ment)?|toxic|trigger(?:ed|ing)|holistic|resilien(?:t|ce)|thriv(?:e|ing)|wraparound|navigat(?:e|ing) the system|access(?:ing)? services)\b/gi, 'sounds like a therapist or a brochure; say what it means in plain words'],
];
const PERMISSION = /\b(it['’]s|that['’]s|it is|that is) okay\b/gi; // flagged only past the first per page
const VAGUE_LINK = /\[(click here|here|this link|link|this page|read more|learn more|more info)\]\(/gi;
const PHONE = /(?<![\w-])(?:1[-.\s])?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g;
const ENTRY_FIELDS = ['Cost', 'Who can use it', 'How to start', 'Good to know'];

// All-caps tokens that need no explanation, or are not abbreviations at all.
const KNOWN_CAPS = new Set(
	'US USA ID TV OK DC UK PDF ZIP AM PM ET PT CT MT II III IV AND OR NOT DO NO ALL FREE YES NEVER ALWAYS ONLY STOP FAQ'.split(' '),
);
// Words on the same line that show the term is being explained.
const EXPLAINS = /\(|\bmeans\b|\bstands for\b|\bis an?\b|\bis the\b|\bis when\b|\bis pushing\b|\bcalled\b|, or |, an? |, the /i;

function files(p) {
	if (statSync(p).isFile()) return [p];
	return readdirSync(p).flatMap((f) => files(join(p, f)));
}
const targets = (paths.length ? paths : [DOCS]).flatMap(files).filter((f) => /\.mdx?$/.test(f));

// Strip what we should not judge: link targets, inline code, quoted text. A quote that ends a
// sentence keeps its full stop, so the next sentence is not counted as part of this one.
const prose = (line) =>
	line
		.replace(/\]\([^)]*\)/g, ']')
		.replace(/`[^`]*`/g, '')
		.replace(/"([^"]*)"|“([^”]*)”/g, (_, a, b) => (/[.?!]$/.test((a ?? b).trim()) ? '"".' : '""'));
const noLinkText = (line) => line.replace(/\[[^\]]*\]/g, '');
// Full stops inside abbreviations are not sentence ends: U.S., a.m., p.m., e.g., Dr., St.
const noAbbrevStops = (line) => line.replace(/\b(U\.S|a\.m|p\.m|e\.g|i\.e)\./gi, (m) => m.replace(/\./g, '')).replace(/\b(Dr|Mr|Ms|Mrs|St|vs|No)\.(?=\s)/g, '$1');
const wordCount = (s) => s.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;

/** Rough syllable count; good enough to rank pages against each other. */
function syllables(word) {
	const w = word.toLowerCase().replace(/[^a-z]/g, '');
	if (!w) return 0;
	if (w.length <= 3) return 1;
	const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
	return Math.max(1, groups?.length ?? 1);
}

const report = [];
let total = 0;
let accepted = 0; // flags a person has looked at and kept, with a style-ok comment
for (const file of targets) {
	const lines = readFileSync(file, 'utf8').split(/\r?\n/);
	const hits = [];

	let inFront = lines[0] === '---';
	let inFence = false;
	let section = '';
	let permissions = 0;
	let dashes = 0;
	let cautions = 0;
	let entry = null; // the resource entry being read: { n, name, seen:Set }
	const seenCaps = new Set();
	let run = 0; // short sentences in a row, across paragraphs; a heading or a list starts the count again
	const read = { sentences: 0, words: 0, syllables: 0 };
	const closeEntry = () => {
		if (!entry) return;
		const missing = ENTRY_FIELDS.filter((f) => !entry.seen.has(f));
		// A lone bold link with no fields at all is a mention, not an entry.
		if (entry.seen.size && missing.length) hits.push({ n: entry.n, rule: 'entry', msg: `resource entry is missing: ${missing.join(', ')} (Part 4)`, text: entry.name });
		entry = null;
	};

	lines.forEach((raw, i) => {
		const n = i + 1;
		// `<!-- style-ok: jargon, idiom (why) -->` on the line above accepts those rules for this line.
		const ok = lines[i - 1]?.match(/^<!--\s*style-ok:\s*([a-z, -]+)/)?.[1].split(',').map((r) => r.trim()) ?? [];
		const add = (line, rule, msg, text) => {
			if (line === n && ok.includes(rule)) return void accepted++;
			hits.push({ n: line, rule, msg, text: text.trim().slice(0, 90) });
		};
		if (inFront) {
			if (i > 0 && raw === '---') inFront = false;
			return;
		}
		if (raw.startsWith('```')) inFence = !inFence;
		if (inFence || raw.startsWith('import ')) return;
		if (raw.startsWith('## ')) {
			closeEntry();
			section = raw.slice(3).trim();
		} else if (raw.startsWith('### ')) closeEntry();
		else if (raw.startsWith(':::') || raw.startsWith('<!--')) {
			if (section === 'This opens up' || section === 'Good to have first') section = '';
			if (raw.startsWith(':::caution') && ++cautions > MAX_CAUTIONS) add(n, 'caution', `more than ${MAX_CAUTIONS} cautions on the page; readers stop seeing them (Part 2)`, raw);
		}
		const isHeading = raw.startsWith('#');
		const isList = /^\s*([-*]|\d+\.)\s/.test(raw);
		if (isHeading || isList || raw.startsWith(':::')) run = 0;
		const line = prose(raw);
		const plain = noLinkText(line);

		// --- wording ---
		for (const [rule, re, msg] of PHRASES) for (const m of line.matchAll(re)) add(n, rule, `"${m[0]}": ${msg}`, raw);
		for (const [rule, re, msg] of PLAIN) for (const m of plain.matchAll(re)) add(n, rule, `"${m[0]}": ${msg}`, raw);
		for (const m of line.matchAll(PERMISSION)) if (++permissions > 1) add(n, 'permission', `"${m[0]}": more than one per page`, raw);
		if (/!(\s|$)/.test(line.replace(/!\[/g, ''))) add(n, 'exclaim', 'exclamation point', raw);
		for (const m of raw.matchAll(VAGUE_LINK)) add(n, 'linktext', `link text "${m[1]}" does not say where it goes`, raw);
		dashes += (line.match(/—/g) ?? []).length;
		if (dashes > MAX_EMDASH && /—/.test(line) && !hits.some((h) => h.rule === 'emdash')) add(n, 'emdash', `more than ${MAX_EMDASH} em dashes on the page; a full stop is usually clearer (Part 3)`, raw);

		// Abbreviations: the first time one appears in running text, the line should explain it.
		if (!isHeading && !raw.startsWith(':::')) {
			for (const m of plain.matchAll(/(?<![-\w])[A-Z]{2,6}(?![-\w])/g)) {
				const cap = m[0];
				if (KNOWN_CAPS.has(cap) || seenCaps.has(cap)) continue;
				seenCaps.add(cap);
				const before = plain.slice(0, m.index);
				if (/\b[Tt]ext\s+$/.test(before)) continue; // "Text START to 88788" is a keyword, not an abbreviation
				if (!EXPLAINS.test(plain)) add(n, 'acronym', `"${cap}": first use, and the line does not say what it is`, raw);
			}
		}

		// Phone numbers are tap-to-call links (Part 3).
		for (const m of raw.replace(/\[[^\]]*\]\([^)]*\)/g, '').matchAll(PHONE)) add(n, 'phone', `${m[0]} is not a tap-to-call link`, raw);

		// --- sentence length and reading level ---
		if (!isHeading && !raw.startsWith(':::') && !raw.startsWith('|') && raw.trim() && !/^\*\*\[[^\]]+\]\([^)]+\)\*\*\s*$/.test(raw)) {
			const text = noAbbrevStops(line).replace(/^\s*[-*]\s+|^\s*\d+\.\s+/, '');
			for (const s of text.split(/(?<=[.?])\s+/)) {
				const words = wordCount(s);
				if (words > MAX_WORDS) add(n, 'long', `${words}-word sentence`, s);
			}
			// Reading level counts what the reader actually reads, quoted scripts included. Field labels
			// ("Cost:") and list fragments are not sentences, so they are left out of the count.
			const full = noAbbrevStops(raw)
				.replace(/\]\([^)]*\)/g, ']')
				.replace(/^\s*[-*]\s+|^\s*\d+\.\s+/, '')
				.replace(/^\*\*[^*]+:\*\*\s*/, '')
				.replace(/[*_`[\]>#]/g, '');
			for (const s of full.split(/(?<=[.?!]["”]?)\s+/)) {
				const words = s.split(/\s+/).filter((w) => /[a-z]/i.test(w));
				if (words.length < 3 && !/[.?!]["”]?$/.test(s.trim())) continue;
				if (!words.length) continue;
				read.sentences++;
				read.words += words.length;
				read.syllables += words.reduce((sum, w) => sum + syllables(w), 0);
				run = !isList && words.length <= SHORT_WORDS ? run + 1 : 0; // list items are short on purpose
				if (run === SHORT_RUN && !isList) add(n, 'choppy', `${SHORT_RUN} sentences in a row of ${SHORT_WORDS} words or fewer; join two so it does not read like a children's book (Part 1)`, raw);
			}
		}

		// --- layout ---
		if (raw === '## If you only do one thing first') add(n, 'structure', 'move this into a :::tip[Start here] near the top (Part 2)', raw);
		// One flag per page, not one per heading: the fix is a single restructure.
		if (raw === '## What it is') add(n, 'structure', 'old page anatomy: merge "What it is" and "Why it helps you" into a lead with no heading (Part 2; /develop or /tighten)', raw);
		if (raw.startsWith('**Good to have first:**') && !raw.includes('](')) add(n, 'structure', '"Good to have first" should list linked Topics', raw);
		if (section === 'This opens up' && raw.trim() && !isHeading && !raw.includes(']('))
			add(n, 'structure', '"This opens up" should list linked Topics', raw);
		if (section === 'Good to have first' && raw.trim() && !isHeading && !raw.includes(']('))
			add(n, 'structure', '"Good to have first" should list linked Topics', raw);
		if (section === 'Watch out for' && /^- /.test(raw) && !/^- \*\*[^*]+\*\*/.test(raw))
			add(n, 'watchout', 'start each item with the trap in bold: **Trap name.** How to spot it. What to do instead.', raw);

		// --- resource entries (Part 4) ---
		if (section === 'Where to get help') {
			const head = raw.match(/^\*\*\[([^\]]+)\]\(https?:[^)]+\)\*\*\s*$/);
			if (head) {
				closeEntry();
				entry = { n, name: head[1], seen: new Set() };
			} else if (entry) {
				const field = raw.match(/^- \*\*([^:*]+):\*\*\s*(.*)$/);
				if (field) {
					entry.seen.add(field[1]);
					if (field[1] === 'How to start' && /^(You can|You may|You could|They|There|It is|It's|Their)\b/.test(field[2]))
						add(n, 'entry', '"How to start" begins with the action: a verb, not "You can" (Part 4)', raw);
				} else if (/^(:::|\*\*\[)/.test(raw)) closeEntry();
			}
		}
	});
	closeEntry();

	const grade = read.sentences && read.words ? 0.39 * (read.words / read.sentences) + 11.8 * (read.syllables / read.words) - 15.59 : 0;
	const perSentence = read.sentences ? read.words / read.sentences : 0;
	if (grade > MAX_GRADE && read.words > 150) hits.push({ n: 1, rule: 'grade', msg: `reads at about grade ${grade.toFixed(1)} (aim for 6 to 8): shorter sentences and shorter words`, text: '' });

	const rel = relative('.', file).replace(/\\/g, '/');
	report.push({ rel, grade, perSentence, words: read.words, hits });
	total += hits.length;
	if (readability || !hits.length) continue;
	if (summary) {
		const counts = {};
		for (const h of hits) counts[h.rule] = (counts[h.rule] ?? 0) + 1;
		const parts = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([r, c]) => `${r} ${c}`);
		console.log(`${String(hits.length).padStart(3)}  grade ${grade.toFixed(1).padStart(4)}  ${rel}  (${parts.join(', ')})`);
	} else {
		for (const h of hits) console.log(`${rel}:${h.n}  [${h.rule}] ${h.msg}${h.text ? `\n    ${h.text}` : ''}`);
	}
}

if (readability) {
	console.log('Grade  Words/sentence  Words  Page');
	for (const r of report.filter((r) => r.words > 150).sort((a, b) => b.grade - a.grade))
		console.log(`${r.grade.toFixed(1).padStart(5)}  ${r.perSentence.toFixed(1).padStart(14)}  ${String(r.words).padStart(5)}  ${r.rel}`);
	console.log('\nGrade is a Flesch-Kincaid estimate. It measures sentence and word length, not whether ideas are clear. Aim for 6 to 8.');
} else {
	console.log(`\n${total} flag(s) in ${targets.length} file(s)${accepted ? `, plus ${accepted} accepted with a style-ok comment` : ''}. Advisory: read each in context before changing it.`);
}
process.exit(strict && total ? 1 : 0);
