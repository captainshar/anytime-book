// Hands you one page at a time to read, and records when you have read it.
// Usage:
//   node scripts/review-next.mjs                      pick the next page, print its URL, open it in your browser
//   node scripts/review-next.mjs --done 4.2           stamp human_reviewed: <today> on that page and commit
//   node scripts/review-next.mjs --done 4.2 --note "..."   also queue the note in sources/review/<area>.md
//   node scripts/review-next.mjs --status             every page with its dates, next up first
// Options: --local (open http://localhost:4321 instead of the live site), --no-open, --no-commit
//
// Which page comes next: pages no person has read yet, with the safety, health, and big-decisions
// Areas first, then the other Topics in order, then Area intros and front-of-book pages. After
// that, the page read longest ago. Pages are named by Topic number ("4.2") or slug ("how-to-use").
// Notes are queued for a later /tighten or /fact-check pass; this script never edits page text.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const DOCS = 'src/content/docs';
const REVIEW = 'sources/review';
const SITE = 'https://anytimebook.org';
const LOCAL = 'http://localhost:4321';
const PRIORITY_AREAS = ['safety-and-getting-started', 'health-and-your-body', 'big-life-decisions'];

const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const value = (name) => {
	const i = args.indexOf(name);
	return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};
const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

// ---- pages ---------------------------------------------------------------

const walk = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
		e.isDirectory() ? walk(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [join(dir, e.name)] : [],
	);

function page(file) {
	const raw = readFileSync(file, 'utf8');
	const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	const field = (k) =>
		fm
			.match(new RegExp(`^${k}:[ \\t]*(.+)$`, 'm'))?.[1]
			.trim()
			.replace(/^(["'])(.*)\1$/, '$2');
	const rel = relative(DOCS, file).replace(/\\/g, '/');
	const slug = rel.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
	const inArea = rel.includes('/');
	const topic = field('topic');
	return {
		file: file.replace(/\\/g, '/'),
		title: field('title') ?? slug,
		topic,
		slug,
		id: topic ?? (slug || 'home'),
		area: inArea ? slug.split('/')[0] : 'front-of-book',
		kind: topic ? 'topic' : inArea ? 'area' : 'front',
		checked: field('last_verified'),
		read: field('human_reviewed'),
		url: (site) => `${site}/${slug ? slug + '/' : ''}`,
	};
}

const key = (p) => [
	p.read ? 1 : 0,
	p.read ?? '',
	p.kind === 'topic' ? (PRIORITY_AREAS.includes(p.area) ? 0 : 1) : p.kind === 'area' ? 2 : 3,
	...(p.topic ? p.topic.split('.').map(Number) : [0, 0]),
	p.slug,
];
const byNext = (a, b) => {
	const ka = key(a);
	const kb = key(b);
	for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] < kb[i] ? -1 : 1;
	return 0;
};

const pages = walk(DOCS).map(page).sort(byNext);
const readCount = pages.filter((p) => p.read).length;
const find = (id) => pages.find((p) => p.id === id || p.slug === id || p.topic === id);

// ---- actions -------------------------------------------------------------

function open(url) {
	const [cmd, cmdArgs] =
		process.platform === 'win32'
			? ['cmd', ['/c', 'start', '', url]]
			: process.platform === 'darwin'
				? ['open', [url]]
				: ['xdg-open', [url]];
	spawnSync(cmd, cmdArgs, { stdio: 'ignore' });
}

function stamp(p) {
	const raw = readFileSync(p.file, 'utf8');
	const m = raw.match(/^---(\r?\n)([\s\S]*?)\r?\n---/);
	if (!m) throw new Error(`${p.file}: no frontmatter`);
	const nl = m[1];
	let fm = m[2];
	const line = `human_reviewed: ${today}`;
	if (/^human_reviewed:.*$/m.test(fm)) fm = fm.replace(/^human_reviewed:.*$/m, line);
	else if (/^last_verified:.*$/m.test(fm)) fm = fm.replace(/^(last_verified:.*)$/m, `$1${nl}${line}`);
	else if (/^status:.*$/m.test(fm)) fm = fm.replace(/^(status:.*)$/m, `$1${nl}${line}`);
	else fm = `${fm}${nl}${line}`;
	writeFileSync(p.file, `---${nl}${fm}${nl}---${raw.slice(m[0].length)}`);
}

function queueNote(p, note) {
	const file = join(REVIEW, `${p.area}.md`);
	const heading = "## Sharon's reading notes";
	const areaTitle = p.area.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
	let text = existsSync(file) ? readFileSync(file, 'utf8') : `# Review: ${areaTitle}\n`;
	if (!text.includes(heading)) {
		text =
			text.trimEnd() +
			`\n\n${heading}\n\nFrom reading pages one at a time (\`npm run review\`). Each line is a fix to queue for a later pass, not a change already made.\n`;
	}
	writeFileSync(file, `${text.trimEnd()}\n- **${today}, ${p.id} ${p.title}:** ${note}\n`);
	return file.replace(/\\/g, '/');
}

function commit(files, subject, body) {
	const git = (...a) => spawnSync('git', a, { stdio: 'inherit' });
	git('add', '--', ...files);
	const msg = body ? ['-m', subject, '-m', body] : ['-m', subject];
	if (git('commit', '--quiet', ...msg).status !== 0) console.error('Commit failed; the files are still changed on disk.');
}

// ---- main ----------------------------------------------------------------

if (has('--status')) {
	const w = Math.max(...pages.map((p) => p.id.length));
	console.log(`${'page'.padEnd(w)}  read by a person  facts checked  title`);
	for (const [i, p] of pages.entries()) {
		console.log(
			`${p.id.padEnd(w)}  ${(p.read ?? (i === 0 ? 'next up' : '-')).padEnd(16)}  ${(p.checked ?? '-').padEnd(13)}  ${p.title}`,
		);
	}
	console.log(`\n${readCount} of ${pages.length} pages read by a person.`);
} else if (has('--done')) {
	const id = value('--done');
	const p = id && find(id);
	if (!p) {
		console.error(`No page called "${id ?? ''}". Use a Topic number like 4.2 or a slug like how-to-use (see --status).`);
		process.exit(1);
	}
	const note = value('--note');
	stamp(p);
	const files = [p.file];
	if (note) files.push(queueNote(p, note));
	console.log(`Marked ${p.id} ${p.title} as read by a person on ${today}.${note ? ` Note queued in ${files[1]}.` : ''}`);
	if (!has('--no-commit')) commit(files, `Read ${p.id} ${p.title}`, note);
	const next = pages.filter((q) => q !== p).sort(byNext)[0];
	console.log(`${readCount + (p.read ? 0 : 1)} of ${pages.length} pages read. Next up: ${next.id} ${next.title}`);
} else {
	const p = pages[0];
	const url = p.url(has('--local') ? LOCAL : SITE);
	const state = p.read ? `last read by a person ${p.read}` : 'never read by a person';
	console.log(`Next: ${p.id} ${p.title}  (facts checked ${p.checked ?? 'never'}, ${state})`);
	console.log(url);
	console.log(`\n${readCount} of ${pages.length} pages read. When you have read this one:`);
	console.log(`  npm run review -- --done ${p.id}`);
	console.log(`  npm run review -- --done ${p.id} --note "what to fix"`);
	if (!has('--no-open')) open(url);
}
