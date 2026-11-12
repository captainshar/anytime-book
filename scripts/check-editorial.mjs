// Checks Topic pages against their briefs (method: sources/EDITORIAL.md, format: sources/briefs/SCHEMA.md).
// Usage: node scripts/check-editorial.mjs [--status] [--strict] [topic ...]
//   With no topics, checks every Topic that has a brief.
//   --status prints one line per Topic in the book: type, stage, and how many of the
//     reader's questions the page answers. This is the to-do list for the develop pass.
//   Errors always fail. Warnings fail only with --strict.
// What it checks:
//   Every brief: required fields, 5–9 questions, at least two "must", real Topics in not_here.
//   From stage "built": the page has the anatomy in EDITORIAL.md Stage 5 (a lead, a Start here
//     tip, no stub sections, the fixed ## headings), every must/should question points at a
//     heading that exists, and every on-page resource has a job, a role, and fit scores.
//     Warnings: resources out of lowest-barrier-first order, a long Start here, stub ### sections,
//     and no claims log yet.
//   From stage "reader-tested": the reader test is recorded question by question, and every
//     "must" question tested as answered. A page cannot be marked reader-tested on a summary.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const DOCS = 'src/content/docs';
const BRIEFS = 'sources/briefs';
const RECORDS = 'sources/resources';
const args = process.argv.slice(2);
const status = args.includes('--status');
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));

const TYPES = ['service', 'skill', 'inner'];
const STAGES = ['brief', 'built', 'reader-tested'];
const PRIORITIES = ['must', 'should', 'could'];
const ROLES = ['primary', 'backup', 'deeper'];
const FIT = ['reach', 'barriers', 'readable', 'trust', 'fits_reader', 'actionable'];
// The fixed ## headings, in page order.
const SECTIONS = ["What's going on", 'How it works', 'Things to try', 'Where to get help', 'Watch out for', 'This opens up'];
const REQUIRED_BY_TYPE = { inner: ["What's going on", 'Things to try'], skill: ['How it works'], service: ['Where to get help'] };
const LEGACY = ['What it is', 'Why it helps you', 'Good to have first', 'If you only do one thing first'];
const NON_HEADING_ANSWERS = ['Lead', 'Start here', 'Watch out for'];
const TESTED = ['answered', 'partly', 'not'];
const STUB_WORDS = 25; // a ## section shorter than this is a stub
const SUB_STUB_WORDS = 12; // same, for a ### section
const TIP_MAX_WORDS = 60; // Start here is one step, 1–3 sentences
const LEAD_MAX_WORDS = 110;
const TOP_MAX_WORDS = 170; // lead + Good to have first + Start here: about one phone screen

const plain = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();
const words = (s) => s.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
const bareUrl = (u) => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/[#?].*$/, '').replace(/\/$/, '').toLowerCase();

// Every Topic page: topic -> { file, title }
const pages = new Map();
for (const area of readdirSync(DOCS, { withFileTypes: true }).filter((d) => d.isDirectory())) {
	for (const f of readdirSync(join(DOCS, area.name)).filter((f) => f.endsWith('.md'))) {
		const file = join(DOCS, area.name, f).replace(/\\/g, '/');
		const fm = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
		const topic = fm.match(/^topic:\s*"?([^"\r\n]+)"?/m)?.[1];
		if (topic) pages.set(topic, { file, title: fm.match(/^title:\s*"?([^"\r\n]+)"?/m)?.[1] ?? '' });
	}
}

/** Splits a page body into the top (before the first ##) and its ## sections. */
function readPage(file) {
	const body = readFileSync(file, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
	const lines = body.split(/\r?\n/);
	const top = [];
	const sections = []; // { name, lines, subs: [name], subWords: {name: n}, groups: [{ name, urls }] }
	for (const line of lines) {
		const h2 = line.match(/^## (.+)$/);
		if (h2) sections.push({ name: plain(h2[1]), lines: [], subs: [], subWords: {}, groups: [{ name: '', urls: [] }] });
		else if (!sections.length) top.push(line);
		else {
			const h3 = line.match(/^### (.+)$/);
			const sec = sections.at(-1);
			if (h3) {
				sec.subs.push(plain(h3[1]));
				sec.subWords[plain(h3[1])] = 0;
				sec.groups.push({ name: plain(h3[1]), urls: [] });
			} else {
				sec.lines.push(line);
				if (sec.subs.length) sec.subWords[sec.subs.at(-1)] += words(line);
				const entry = line.match(/^\*\*\[[^\]]+\]\((https?:[^)]+)\)\*\*\s*$/);
				if (entry) sec.groups.at(-1).urls.push(entry[1]);
			}
		}
	}
	const topText = top.join('\n');
	const tip = topText.match(/^:::tip\[Start here\]\r?\n([\s\S]*?)\r?\n:::/m);
	const lead = topText
		.replace(/^:::[\s\S]*?^:::\s*$/gm, '')
		.split('\n')
		.filter((l) => l.trim() && !/^\*\*Good to have first:\*\*/.test(l) && !l.startsWith('<!--'))
		.join(' ');
	return { body, topText, lead, tip: tip?.[1] ?? null, sections };
}

const topicOrder = (a, b) => a.split('.').map(Number).reduce((d, n, i) => d || n - Number(b.split('.')[i]), 0);
const briefFiles = existsSync(BRIEFS) ? readdirSync(BRIEFS).filter((f) => f.endsWith('.yml')) : [];
const briefs = new Map();
const errors = [];
const warnings = [];

for (const f of briefFiles) {
	const where = join(BRIEFS, f);
	try {
		const b = parse(readFileSync(where, 'utf8'));
		briefs.set(String(b?.topic ?? f.replace(/\.yml$/, '')), { ...b, where });
	} catch (e) {
		errors.push(`${where}: invalid YAML (${e.message.split('\n')[0]})`);
	}
}
for (const t of targets) if (!pages.has(t)) errors.push(`No Topic page with topic "${t}"`);

const board = [];
for (const [topic, b] of [...briefs].sort((a, b) => topicOrder(a[0], b[0]))) {
	if (targets.length && !targets.includes(topic)) continue;
	const err = (m) => errors.push(`${b.where}: ${m}`);
	const warn = (m) => warnings.push(`${b.where}: ${m}`);

	// --- The brief itself ---
	for (const key of ['topic', 'page', 'type', 'stage', 'reader', 'outcome', 'start_here', 'questions']) if (!b[key]) err(`missing ${key}`);
	if (b.type && !TYPES.includes(b.type)) err(`type "${b.type}" is not one of ${TYPES.join(', ')}`);
	if (b.also && !TYPES.includes(b.also)) err(`also "${b.also}" is not one of ${TYPES.join(', ')}`);
	if (b.stage && !STAGES.includes(b.stage)) err(`stage "${b.stage}" is not one of ${STAGES.join(', ')}`);
	const page = pages.get(topic);
	if (!page) err(`no Topic page has topic "${topic}"`);
	else if (b.page && b.page !== page.file) err(`page is ${b.page} but Topic ${topic} lives at ${page.file}`);

	const qs = Array.isArray(b.questions) ? b.questions : [];
	const ids = new Set();
	for (const q of qs) {
		if (!q.id || !q.ask) err(`a question is missing id or ask`);
		if (ids.has(q.id)) err(`question id ${q.id} is used twice`);
		ids.add(q.id);
		if (!PRIORITIES.includes(q.priority)) err(`${q.id}: priority "${q.priority}" is not one of ${PRIORITIES.join(', ')}`);
	}
	const musts = qs.filter((q) => q.priority === 'must');
	if (qs.length && (qs.length < 5 || qs.length > 9)) warn(`${qs.length} questions (aim for 5 to 9)`);
	if (qs.length && musts.length < 2) err(`only ${musts.length} "must" question(s); a page needs at least two`);
	for (const n of b.not_here ?? []) if (!pages.has(String(n.topic))) err(`not_here points to Topic ${n.topic}, which does not exist`);

	const built = STAGES.indexOf(b.stage) >= 1;
	let answered = qs.filter((q) => q.was === 'answered').length;
	let mustAnswered = musts.filter((q) => q.was === 'answered').length;
	let onPage = null;

	// --- The page, once it has been built from the brief ---
	if (built && page) {
		const p = readPage(page.file);
		const perr = (m) => errors.push(`${page.file}: ${m}`);
		const pwarn = (m) => warnings.push(`${page.file}: ${m}`);
		const names = p.sections.map((s) => s.name);

		// Top of the page
		const sentences = p.lead.split(/(?<=[.?])\s+/).filter((s) => words(s) > 2).length;
		if (sentences < 2) perr(`no lead: the page needs 2–4 sentences before the first heading (found ${sentences})`);
		if (words(p.lead) > LEAD_MAX_WORDS) pwarn(`lead is ${words(p.lead)} words (aim for under ${LEAD_MAX_WORDS})`);
		if (!p.tip) perr('no :::tip[Start here] before the first ## heading');
		else if (words(p.tip) > TIP_MAX_WORDS) pwarn(`Start here is ${words(p.tip)} words (aim for under ${TIP_MAX_WORDS}: one step, with the words to say)`);
		const topWords = words(p.topText.replace(/^:::.*$/gm, ''));
		if (topWords > TOP_MAX_WORDS) pwarn(`${topWords} words before the first section; Start here may be below the first phone screen`);

		// Sections
		for (const name of names.filter((n) => LEGACY.includes(n))) perr(`"## ${name}" is the old anatomy: fold it into the lead, the Good to have first line, or Start here`);
		for (const name of names.filter((n) => !SECTIONS.includes(n) && !LEGACY.includes(n))) pwarn(`"## ${name}" is not one of the standard sections (${SECTIONS.join(', ')})`);
		for (const need of [...new Set([...(REQUIRED_BY_TYPE[b.type] ?? []), ...(REQUIRED_BY_TYPE[b.also] ?? [])])]) {
			if (!names.includes(need)) perr(`a ${b.type}${b.also ? `/${b.also}` : ''} page needs a "## ${need}" section`);
		}
		const order = names.filter((n) => SECTIONS.includes(n)).map((n) => SECTIONS.indexOf(n));
		if (order.some((n, i) => i && n < order[i - 1])) pwarn(`sections are out of order (expected: ${SECTIONS.join(' → ')})`);
		for (const s of p.sections) {
			const text = s.lines.join(' ');
			if (s.name === 'This opens up') {
				if (s !== p.sections.at(-1)) pwarn('"This opens up" should be the last section');
				const items = s.lines.filter((l) => l.trim());
				if (!items.length || items.some((l) => !/^- \[[^\]]+\]\(\/[^)]+\)/.test(l))) perr('"This opens up" should be a list where every item starts with a linked Topic');
			} else if (words(text) < STUB_WORDS) perr(`"## ${s.name}" is a stub (${words(text)} words): fold it into another section or cut it`);
			for (const [sub, count] of Object.entries(s.subWords)) if (count < SUB_STUB_WORDS) pwarn(`"### ${sub}" has only ${count} words under it: fold it into its neighbor`);
		}

		// Questions point at real places on the page
		const headings = new Set([...names, ...p.sections.flatMap((s) => s.subs), ...NON_HEADING_ANSWERS]);
		answered = 0;
		mustAnswered = 0;
		for (const q of qs) {
			const where = q.answered_in ? [q.answered_in].flat().map(plain) : [];
			const missing = where.filter((w) => !headings.has(w));
			if (!where.length) {
				if (q.priority !== 'could') perr(`${q.id} (${q.priority}) "${q.ask}" has no answered_in in the brief`);
			} else if (missing.length) perr(`${q.id} says it is answered in "${missing.join('", "')}", which is not a heading on the page`);
			else {
				answered++;
				if (q.priority === 'must') mustAnswered++;
			}
		}
		for (const n of b.not_here ?? []) {
			const target = pages.get(String(n.topic));
			if (target && !p.body.includes(`(${target.file.replace(DOCS, '').replace(/\.md$/, '/')}`)) pwarn(`does not link to Topic ${n.topic} (${n.what}), which the brief says is covered there`);
		}

		if (!existsSync(join('sources/claims', `${topic}.yml`))) pwarn(`no claims log yet (sources/claims/${topic}.yml): new teaching text needs its sources recorded, and /fact-check has not run`);

		// Resources carry their vetting
		const recordFile = join(RECORDS, `${topic}.yml`);
		if (!existsSync(recordFile)) perr(`no resource record at ${recordFile}`);
		else {
			const on = (parse(readFileSync(recordFile, 'utf8'))?.resources ?? []).filter((r) => r.on_page !== false);
			onPage = on.length;
			if (on.length < 3 || on.length > 10) warnings.push(`${recordFile}: ${on.length} resources on the page (aim for 3 to 10)`);
			const unscored = []; // resources whose own page could not be read on this pass
			for (const r of on) {
				const rerr = (m) => errors.push(`${recordFile}: ${r.name}: ${m}`);
				const jobs = [r.job ?? []].flat();
				if (!jobs.length) rerr('no job (which brief question does it answer?)');
				for (const j of jobs) if (!ids.has(j)) rerr(`job ${j} is not a question in the brief`);
				if (!ROLES.includes(r.role)) rerr(`role "${r.role}" is not one of ${ROLES.join(', ')}`);
				if (!r.fit) rerr('no fit scores');
				else {
					for (const k of FIT) if (r.fit[k] !== null && ![0, 1, 2].includes(r.fit[k])) rerr(`fit.${k} should be 0, 1, or 2`);
					if (FIT.some((k) => r.fit[k] === null)) unscored.push(r.name);
					if (!r.fit.note) rerr('fit has no note');
				}
			}
			if (unscored.length) warnings.push(`${recordFile}: ${unscored.length} resource(s) not fully scored because their page was not read on this pass: ${unscored.join('; ')}`);
			// Lowest barrier first within each group (EDITORIAL.md, Stage 4).
			const barrierOf = new Map(on.filter((r) => r.url && typeof r.fit?.barriers === 'number').map((r) => [bareUrl(r.url), r.fit.barriers]));
			for (const g of p.sections.find((s) => s.name === 'Where to get help')?.groups ?? []) {
				const scores = g.urls.map((u) => barrierOf.get(bareUrl(u))).filter((b) => b !== undefined);
				if (scores.some((b, i) => i && b > scores[i - 1])) pwarn(`"${g.name || 'Where to get help'}": resources are not lowest-barrier first (barriers scores in page order: ${scores.join(', ')})`);
			}
			if (on.length && !on.some((r) => r.fit?.barriers === 2)) warnings.push(`${recordFile}: no resource scores barriers: 2 (a way in that needs nothing but a phone call)`);
		}
	}

	// The reader test is recorded per question, so "pass" is something the checker can see.
	for (const q of qs) if (q.tested && !TESTED.includes(q.tested)) err(`${q.id}: tested "${q.tested}" is not one of ${TESTED.join(', ')}`);
	const untested = qs.filter((q) => !q.tested).map((q) => q.id);
	const weakMusts = musts.filter((q) => q.tested && q.tested !== 'answered').map((q) => `${q.id} (${q.tested})`);
	const weakOthers = qs.filter((q) => q.priority !== 'must' && q.tested && q.tested !== 'answered').map((q) => `${q.id} (${q.tested})`);
	if (b.stage === 'reader-tested') {
		if (!b.reader_test?.date || !b.reader_test?.result) err('stage is reader-tested but reader_test has no date or result');
		if (untested.length) err(`stage is reader-tested but these questions have no tested result: ${untested.join(', ')}`);
		if (weakMusts.length) err(`stage is reader-tested but a cold reader could not fully answer these "must" questions from the page: ${weakMusts.join(', ')}. Fix the page and re-test, or set the stage back to built.`);
		if (b.reader_test?.result && b.reader_test.result !== 'pass') err(`stage is reader-tested but reader_test.result is "${b.reader_test.result}"`);
	} else if (b.reader_test && weakMusts.length) warn(`reader test: "must" questions not fully answered yet: ${weakMusts.join(', ')}`);
	if (weakOthers.length) warn(`reader test: partly answered: ${weakOthers.join(', ')}`);

	const editorOnly = qs.filter((q) => q.from === 'editor').length;
	board.push({ topic, type: b.also ? `${b.type}+${b.also}` : b.type, stage: b.stage, q: `${answered}/${qs.length}`, must: `${mustAnswered}/${musts.length}`, res: onPage ?? '', guess: `${editorOnly}/${qs.length}` });
}

if (status) {
	const rows = [...pages.keys()].sort(topicOrder).map((t) => {
		const row = board.find((r) => r.topic === t);
		const title = pages.get(t).title;
		return row
			? [t, title, row.type, row.stage, row.must, row.q, String(row.res), row.guess]
			: [t, title, '', 'no brief', '', '', '', ''];
	});
	const head = ['Topic', 'Title', 'Type', 'Stage', 'Must', 'All', 'Res', 'Guessed'];
	const width = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
	const fmt = (r) => r.map((c, i) => c.padEnd(width[i])).join('  ').trimEnd();
	console.log(fmt(head));
	console.log(width.map((w) => '-'.repeat(w)).join('  '));
	for (const r of rows) console.log(fmt(r));
	const count = (s) => board.filter((r) => r.stage === s).length;
	console.log(`\n${pages.size} Topics: ${count('reader-tested')} reader-tested, ${count('built')} built, ${count('brief')} briefed, ${pages.size - board.length} with no brief.`);
	console.log('Must / All = questions the page answers. Before a page is built, this is the audit of the old page.');
	console.log('Guessed = questions marked "from: editor": nobody has checked them against a real reader yet.\n');
}

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`${board.length} brief(s) checked, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
