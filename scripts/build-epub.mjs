// Builds the epub from the same Markdown the website uses.
// Usage: node scripts/build-epub.mjs [version]   (requires pandoc on PATH)
// Output: dist-epub/anytime-book-<version>.epub
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const DOCS = 'src/content/docs';
const OUT = 'dist-epub';
const version = process.argv[2] ?? process.env.BOOK_VERSION ?? 'dev';

// Keep in sync with the sidebar order in astro.config.mjs.
const AREA_DIRS = [
	'first-things',
	'safety-and-getting-started',
	'your-mind-and-feelings',
	'money',
	'a-home-and-daily-life',
	'health-and-your-body',
	'talking-to-people-and-the-world',
	'learning-and-work',
	'big-life-decisions',
	'fun-rest-and-being-you',
];

function parse(path) {
	const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
	const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!m) throw new Error(`No frontmatter in ${path}`);
	const fm = m[1];
	const get = (key) => fm.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^"|"$/g, '');
	return {
		title: get('title'),
		topic: get('topic'),
		order: Number(get('order') ?? 0),
		body: m[2].trim(),
	};
}

// Starlight asides (:::note[Title] ... :::) → plain blockquotes pandoc understands.
const convertAsides = (md) =>
	md.replace(/^:::(\w+)(?:\[(.+?)\])?\n([\s\S]*?)\n:::$/gm, (_, type, title, inner) => {
		const label = title ?? type[0].toUpperCase() + type.slice(1);
		return inner
			.split('\n')
			.map((l, i) => `> ${i === 0 ? `**${label}:** ` : ''}${l}`)
			.join('\n');
	});

// Push every heading down one level so page titles can be level 1/2.
const demote = (md, by) => md.replace(/^(#{1,5}) /gm, (h) => '#'.repeat(h.trim().length + by) + ' ');

// Site-relative links don't work inside an epub; keep the text, point to the website.
const absolutizeLinks = (md) => md.replace(/\]\(\/(?!\/)/g, '](https://anytimebook.org/');

const parts = [];
const addPage = (page, level) =>
	parts.push(`${'#'.repeat(level)} ${page.title}\n\n${demote(page.body, level)}`);

addPage(parse(join(DOCS, 'how-to-use.md')), 1);
addPage(parse(join(DOCS, 'how-this-book-was-made.md')), 1);

for (const dir of AREA_DIRS) {
	const area = parse(join(DOCS, dir, 'index.md'));
	addPage(area, 1);
	const topics = readdirSync(join(DOCS, dir))
		.filter((f) => f.endsWith('.md') && f !== 'index.md')
		.map((f) => parse(join(DOCS, dir, f)))
		.sort((a, b) => a.order - b.order);
	for (const t of topics) addPage({ ...t, title: `${t.topic} ${t.title}` }, 2);
}

addPage(parse(join(DOCS, 'a-last-word.md')), 1);

const book = absolutizeLinks(convertAsides(parts.join('\n\n')));

mkdirSync(OUT, { recursive: true });
const mdPath = join(OUT, 'book.md');
writeFileSync(mdPath, book);

const outFile = join(OUT, `anytime-book-${version}.epub`);
const args = [
	mdPath,
	'--from=markdown',
	'--to=epub3',
	'--toc',
	'--toc-depth=2',
	'--split-level=1',
	`--metadata=title:The Anytime Book, United States Edition`,
	`--metadata=subtitle:A map for joining the world — at any age, from any starting point.`,
	`--metadata=lang:en-US`,
	`--metadata=date:${new Date().toISOString().slice(0, 10)}`,
	`--metadata=version:${version}`,
	'--output',
	outFile,
];
if (existsSync('epub/style.css')) args.push('--css=epub/style.css');
if (existsSync('epub/cover.png')) args.push('--epub-cover-image=epub/cover.png');

execFileSync('pandoc', args, { stdio: 'inherit' });
console.log(`Built ${outFile}`);
