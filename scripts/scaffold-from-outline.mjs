// One-time scaffold: splits sources/outline.md into Starlight pages.
// Usage: node scripts/scaffold-from-outline.mjs [--force]
// Without --force, existing pages are left alone so edited content is never overwritten.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const force = process.argv.includes('--force');
const DOCS = 'src/content/docs';
const md = readFileSync('sources/outline.md', 'utf8').replace(/\r\n/g, '\n');

const slugify = (s) =>
	s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const yamlStr = (s) => JSON.stringify(s);

function write(path, content) {
	if (existsSync(path) && !force) {
		console.log(`skip  ${path}`);
		return;
	}
	mkdirSync(join(path, '..'), { recursive: true });
	writeFileSync(path, content);
	console.log(`write ${path}`);
}

// Split into level-2 sections.
const sections = md.split(/^## /m).slice(1).map((block) => {
	const [heading, ...rest] = block.split('\n');
	return { heading: heading.trim(), body: rest.join('\n').trim() };
});

const byName = Object.fromEntries(sections.map((s) => [s.heading, s.body]));

write(
	join(DOCS, 'how-to-use.md'),
	`---\ntitle: How to use this book\nsidebar:\n  order: 1\n---\n\n${byName['How to use this book']}\n`,
);

write(
	join(DOCS, 'a-last-word.md'),
	`---\ntitle: A last word\nsidebar:\n  order: 99\n---\n\n${byName['A last word']}\n`,
);

const FIELD_HEADINGS = {
	'What it is': 'What it is',
	'Why it helps you': 'Why it helps you',
	'Good to have first': 'Good to have first',
	'This opens up': 'This opens up',
};

for (const s of sections) {
	const m = s.heading.match(/^Area (\d+) — (.+)$/);
	if (!m) continue;
	const [, areaNum, areaTitle] = m;
	const areaSlug = slugify(areaTitle);
	const [intro, ...topicBlocks] = s.body.split(/^### /m);

	write(
		join(DOCS, areaSlug, 'index.md'),
		`---\ntitle: ${yamlStr(`Area ${areaNum}: ${areaTitle}`)}\nsidebar:\n  label: About this Area\n  order: 0\n---\n\n${intro.trim()}\n`,
	);

	for (const tb of topicBlocks) {
		const [headLine, ...lines] = tb.split('\n');
		const tm = headLine.match(/^(\d+)\.(\d+) (.+)$/);
		if (!tm) throw new Error(`Bad topic heading: ${headLine}`);
		const [, , minor, title] = tm;
		const id = `${tm[1]}.${minor}`;

		const fields = {};
		for (const line of lines) {
			const fm = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
			if (fm && FIELD_HEADINGS[fm[1]]) fields[fm[1]] = fm[2].trim();
		}

		const body = Object.keys(FIELD_HEADINGS)
			.filter((k) => fields[k])
			.map((k) => `## ${FIELD_HEADINGS[k]}\n\n${fields[k]}`)
			.join('\n\n');

		write(
			join(DOCS, areaSlug, `${slugify(title)}.md`),
			`---
title: ${yamlStr(title)}
description: ${yamlStr(fields['What it is'] ?? '')}
topic: "${id}"
status: outline
sidebar:
  order: ${Number(minor)}
  label: ${yamlStr(`${id} ${title}`)}
---

${body}

## Where to get help

:::note[Coming soon]
We are checking every resource for this Topic before we list it. Check back soon.
:::
`,
		);
	}
}
