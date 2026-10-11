// Checks Topic pages against their verification logs (used by the /fact-check skill).
// Usage: node scripts/check-facts.mjs [--claims] [--strict] [topic | page.md ...]
//   With no topics, checks every Topic page.
//   Always: every phone link dials the number it shows, and every phone number and
//     resource on the page matches sources/resources/<topic>.yml.
//   --claims: also checks sources/claims/<topic>.yml (format: sources/claims/SCHEMA.md):
//     required fields, that each claim is still on the page, and that every quote
//     appears word for word in the saved source (.cache/sources, made by fetch-source.mjs).
//   Errors always fail. Warnings fail only with --strict.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { cachePath, normalize } from './lib/source-text.mjs';

const DOCS = 'src/content/docs';
const args = process.argv.slice(2);
const withClaims = args.includes('--claims');
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));

const VERDICTS = ['confirmed', 'corrected', 'unsupported', 'conflicting', 'blocked', 'needs-human', 'not-checkable'];
const NEEDS_QUOTE = ['confirmed', 'corrected', 'conflicting'];
const KINDS = ['resource', 'active', 'number', 'procedure', 'rule', 'health', 'safety', 'general'];
const MAX_AGE_DAYS = { high: 180, medium: 365, low: 365 };

const digits = (s) => String(s).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const bareUrl = (u) => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/[#?].*$/, '').replace(/\/$/, '').toLowerCase();
const ageDays = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 864e5);

// Topic pages: { topic, file }
const pages = [];
for (const area of readdirSync(DOCS, { withFileTypes: true }).filter((d) => d.isDirectory())) {
	for (const f of readdirSync(join(DOCS, area.name)).filter((f) => f.endsWith('.md'))) {
		const file = join(DOCS, area.name, f).replace(/\\/g, '/');
		const topic = readFileSync(file, 'utf8').match(/^topic:\s*"?([^"\r\n]+)"?/m)?.[1];
		if (topic) pages.push({ topic, file });
	}
}
const selected = targets.length
	? targets.map((t) => pages.find((p) => p.topic === t || p.file.endsWith(t.replace(/\\/g, '/'))) ?? { missing: t })
	: pages;

// Numbers and links verified in any Topic's record count everywhere: pages often point to
// another Topic's resource (for example, the domestic violence hotline).
const allRecords = readdirSync('sources/resources')
	.filter((f) => f.endsWith('.yml'))
	.flatMap((f) => parse(readFileSync(join('sources/resources', f), 'utf8'))?.resources ?? []);
const numbersAnywhere = new Set(allRecords.flatMap((r) => [r.phone, r.text].filter(Boolean).map(digits)));
const urlsAnywhere = new Set(allRecords.flatMap((r) => [r.url, r.source_url].filter(Boolean).map(bareUrl)));

let errorCount = 0;
let warningCount = 0;

for (const page of selected) {
	if ('missing' in page) {
		console.error(`error: no Topic page found for "${page.missing}"`);
		errorCount++;
		continue;
	}
	const errors = [];
	const warnings = [];
	const raw = readFileSync(page.file, 'utf8');
	const body = raw.replace(/^---[\s\S]*?\n---/, '');
	const visible = body.replace(/\]\([^)]*\)/g, ']'); // drop link targets

	// 1. Phone links dial the number they show.
	for (const m of body.matchAll(/\[([^\]]+)\]\((tel|sms):([^)]+)\)/g)) {
		const [, label, kind, target] = m;
		if (/\d{3}/.test(label) && digits(label) !== digits(target)) {
			errors.push(`${kind} link shows "${label}" but dials ${target}`);
		}
	}

	// 2. Phone numbers and resources match the resource record.
	const recordFile = `sources/resources/${page.topic}.yml`;
	const record = existsSync(recordFile) ? parse(readFileSync(recordFile, 'utf8')) : null;
	if (!record) warnings.push(`no resource record (${recordFile})`);
	const resources = (record?.resources ?? []).filter((r) => r.on_page !== false);
	const knownUrls = new Set(urlsAnywhere);

	const claimsFile = `sources/claims/${page.topic}.yml`;
	const claimsLog = existsSync(claimsFile) ? parse(readFileSync(claimsFile, 'utf8')) : null;
	const claims = claimsLog?.claims ?? [];
	for (const c of claims) for (const s of [c, ...(c.more ?? [])]) if (s.source_url) knownUrls.add(bareUrl(s.source_url));

	if (record) {
		for (const m of visible.matchAll(/(?:\b1[-.\s])?\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g)) {
			if (!numbersAnywhere.has(digits(m[0]))) warnings.push(`phone ${m[0]} is on the page but in no resource record`);
		}
		for (const r of resources) {
			// A resource can appear as a link, by name, or by its number (988 is often plain text).
			const shown =
				(r.url && body.includes(r.url.replace(/\/$/, ''))) ||
				(r.name && body.includes(r.name.split(/ [—(:-] | \(/)[0])) ||
				[r.phone, r.text].filter(Boolean).some((n) => digits(visible).includes(digits(n)));
			if (!shown) warnings.push(`${r.name}: on_page is true but it is not on the page`);
		}
	}
	for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
		if (!knownUrls.has(bareUrl(m[1]))) warnings.push(`link ${m[1]} is in no resource record or checked claim`);
	}

	// 3. Claims log.
	if (withClaims) {
		if (!claimsLog) {
			warnings.push(`no claims log (${claimsFile})`);
		} else {
			const pageText = normalize(visible.replace(/[*_`>#]/g, ''));
			const ids = new Set();
			for (const c of claims) {
				const label = `claim ${c.id ?? '(no id)'}`;
				for (const key of ['id', 'text', 'kind', 'risk', 'verdict', 'checked_on', 'checked_by']) {
					if (!c[key]) errors.push(`${label}: missing ${key}`);
				}
				if (ids.has(c.id)) errors.push(`${label}: duplicate id`);
				ids.add(c.id);
				if (c.kind && !KINDS.includes(c.kind)) errors.push(`${label}: kind "${c.kind}" is not one of ${KINDS.join(', ')}`);
				if (c.verdict && !VERDICTS.includes(c.verdict)) errors.push(`${label}: verdict "${c.verdict}" is not one of ${VERDICTS.join(', ')}`);
				if (c.verdict === 'corrected' && !c.fix) errors.push(`${label}: corrected but no fix`);
				if (c.text && !pageText.includes(normalize(c.text.replace(/[*_`]/g, '')))) {
					warnings.push(`${label}: text is no longer on the page (edited since the check?)`);
				}
				if (NEEDS_QUOTE.includes(c.verdict)) {
					for (const s of [c, ...(c.more ?? [])]) {
						if (!s.source_url || !s.quote) {
							errors.push(`${label}: ${c.verdict} needs source_url and quote`);
							continue;
						}
						const saved = cachePath(s.source_url);
						if (!existsSync(saved)) {
							errors.push(`${label}: source not saved; run node scripts/fetch-source.mjs ${s.source_url}`);
						} else if (!normalize(readFileSync(saved, 'utf8')).includes(normalize(s.quote))) {
							errors.push(`${label}: quote not found word for word in the saved source (${saved})`);
						}
					}
				}
				const limit = MAX_AGE_DAYS[c.risk] ?? 365;
				if (c.checked_on && ageDays(c.checked_on) > limit) warnings.push(`${label}: checked ${ageDays(c.checked_on)} days ago (limit ${limit})`);
			}
			const counts = Object.fromEntries(VERDICTS.map((v) => [v, claims.filter((c) => c.verdict === v).length]).filter(([, n]) => n));
			console.log(`${page.topic}: ${claims.length} claims ${JSON.stringify(counts)}`);
		}
	}

	for (const w of warnings) console.warn(`warning: ${page.file}: ${w}`);
	for (const e of errors) console.error(`error: ${page.file}: ${e}`);
	errorCount += errors.length;
	warningCount += warnings.length;
}

console.log(`${selected.length} page(s), ${errorCount} errors, ${warningCount} warnings`);
process.exit(errorCount || (strict && warningCount) ? 1 : 0);
