// Flags voice and structure problems described in sources/STYLE.md (Parts 1–3).
// Usage: node scripts/check-style.mjs [--summary] [--strict] [path ...]
//   With no paths, checks every page under src/content/docs.
//   --summary prints one line per file (counts by rule) instead of every hit.
//   --strict exits 1 if anything is flagged (default is advisory: always exit 0).
// This is a pointer for a human or the /tighten skill, not a judge. Some hits are fine
// in context (a quoted mission statement that says "should", a real rule that says "must").
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DOCS = 'src/content/docs';
const args = process.argv.slice(2);
const summary = args.includes('--summary');
const strict = args.includes('--strict');
const paths = args.filter((a) => !a.startsWith('--'));
const MAX_WORDS = 25;

// [rule id, regex, short reason]
const PHRASES = [
	['minimizer', /\b(just|simply|easily)\b/gi, 'implies it is easy; cut it'],
	['obvious', /\b(of course|obviously|everyone knows|basic stuff)\b/gi, 'implies the reader should already know'],
	['should', /\b(should|shouldn['’]t)\b/gi, 'prescriptive; try "you can" or "if you want"'],
	['dont-worry', /\bdon['’]t worry\b/gi, 'dismisses the worry; name it and address it'],
	['cheer', /\b(you['’]ve got this|you can do it|so can you|still counts|proud of you)\b/gi, 'cheerleading'],
	['feelings', /\b(huge relief|you['’]ll feel|you will feel)\b/gi, 'tells the reader what they feel'],
	['promise', /\b(won['’]t judge|will not judge|no one will judge)\b/gi, 'a promise we cannot keep'],
	['fault', /\b(failed to|neglected to|bad with money|irresponsible)\b/gi, 'fault-finding'],
	['label', /\bvictims?\b/gi, 'describe the situation, not a label'],
	['wordy', /\b(utilize|assist|obtain|individuals|in order to|it is important to|free of charge)\b/gi, 'plain-word swap (Part 3)'],
];
const PERMISSION = /\b(it['’]s|that['’]s|it is|that is) okay\b/gi; // flagged only past the first per page

function files(p) {
	if (statSync(p).isFile()) return [p];
	return readdirSync(p).flatMap((f) => files(join(p, f)));
}
const targets = (paths.length ? paths : [DOCS]).flatMap(files).filter((f) => /\.mdx?$/.test(f));

// Strip the parts we should not judge: link targets, inline code, quoted text.
const prose = (line) =>
	line
		.replace(/\]\([^)]*\)/g, ']')
		.replace(/`[^`]*`/g, '')
		.replace(/"[^"]*"|“[^”]*”/g, '""');

let total = 0;
for (const file of targets) {
	const lines = readFileSync(file, 'utf8').split(/\r?\n/);
	const hits = [];
	const add = (n, rule, msg, text) => hits.push({ n, rule, msg, text: text.trim().slice(0, 90) });

	let inFront = lines[0] === '---';
	let inFence = false;
	let section = '';
	let permissions = 0;
	lines.forEach((raw, i) => {
		const n = i + 1;
		if (inFront) {
			if (i > 0 && raw === '---') inFront = false;
			return;
		}
		if (raw.startsWith('```')) inFence = !inFence;
		if (inFence || raw.startsWith('import ')) return;
		if (raw.startsWith('## ')) section = raw.slice(3).trim();
		else if (raw.startsWith(':::') || raw.startsWith('<!--')) section = '';
		const line = prose(raw);

		for (const [rule, re, msg] of PHRASES) for (const m of line.matchAll(re)) add(n, rule, `"${m[0]}": ${msg}`, raw);
		for (const m of line.matchAll(PERMISSION)) if (++permissions > 1) add(n, 'permission', `"${m[0]}": more than one per page`, raw);
		if (/!(\s|$)/.test(line.replace(/!\[/g, ''))) add(n, 'exclaim', 'exclamation point', raw);

		if (!raw.startsWith('#') && !raw.startsWith(':::') && !raw.startsWith('|')) {
			for (const s of line.replace(/^\s*[-*]\s+|^\s*\d+\.\s+/, '').split(/(?<=[.?])\s+/)) {
				const words = s.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
				if (words > MAX_WORDS) add(n, 'long', `${words}-word sentence`, s);
			}
		}

		if (raw === '## If you only do one thing first') add(n, 'structure', 'move this into a :::tip[Start here] near the top (Part 2)', raw);
		// One flag per page, not one per heading: the fix is a single restructure.
		if (raw === '## What it is') add(n, 'structure', 'old page anatomy: merge "What it is" and "Why it helps you" into a lead with no heading (Part 2; /develop or /tighten)', raw);
		if (raw.startsWith('**Good to have first:**') && !raw.includes('](')) add(n, 'structure', '"Good to have first" should list linked Topics', raw);
		if (section === 'This opens up' && raw.trim() && !raw.startsWith('#') && !raw.includes(']('))
			add(n, 'structure', '"This opens up" should list linked Topics', raw);
		if (section === 'Good to have first' && raw.trim() && !raw.startsWith('#') && !raw.includes(']('))
			add(n, 'structure', '"Good to have first" should list linked Topics', raw);
	});

	if (!hits.length) continue;
	total += hits.length;
	const rel = relative('.', file).replace(/\\/g, '/');
	if (summary) {
		const counts = {};
		for (const h of hits) counts[h.rule] = (counts[h.rule] ?? 0) + 1;
		const parts = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([r, c]) => `${r} ${c}`);
		console.log(`${String(hits.length).padStart(3)}  ${rel}  (${parts.join(', ')})`);
	} else {
		for (const h of hits) console.log(`${rel}:${h.n}  [${h.rule}] ${h.msg}\n    ${h.text}`);
	}
}
console.log(`\n${total} flag(s) in ${targets.length} file(s). Advisory: read each in context before changing it.`);
process.exit(strict && total ? 1 : 0);
