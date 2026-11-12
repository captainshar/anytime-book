// Checks the resource records in sources/resources/*.yml (format: sources/resources/SCHEMA.md).
// Usage: node scripts/check-resources.mjs [--strict]
//   Errors (always fail): missing required fields, a phone number shared by two
//   different organizations, a non-national resource with no serves_where.
//   Warnings (fail only with --strict): checks older than 180 days (high risk)
//   or 365 days (medium/low), and draft/verified pages with no resource file.
//   --by-hand prints the resources marked blocked_on: their site refused a scripted check,
//   so a person has to open the page in a browser and confirm the record.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const DIR = 'sources/resources';
const DOCS = 'src/content/docs';
const strict = process.argv.includes('--strict');
const byHand = process.argv.includes('--by-hand');
const blocked = []; // { file, name, url, blocked_on, verified_on }
const today = new Date();
const MAX_AGE_DAYS = { high: 180, medium: 365, low: 365 };

const errors = [];
const warnings = [];
const phones = new Map(); // digits -> { name, file }

const digits = (s) => String(s).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const domain = (u) => {
	try {
		return new URL(u).hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
	} catch {
		return String(u);
	}
};
const ageDays =(d) => Math.floor((today - new Date(d)) / 864e5);

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.yml')) : [];
const topicsWithFiles = new Set();

for (const file of files) {
	const where = join(DIR, file);
	let data;
	try {
		data = parse(readFileSync(where, 'utf8'));
	} catch (e) {
		errors.push(`${where}: invalid YAML (${e.message.split('\n')[0]})`);
		continue;
	}
	if (!data?.topic) errors.push(`${where}: missing topic`);
	topicsWithFiles.add(String(data?.topic));

	for (const r of data?.resources ?? []) {
		const label = `${where}: ${r.name ?? '(no name)'}`;
		for (const key of ['name', 'url', 'scope', 'source_url', 'verified_on']) {
			if (!r[key]) errors.push(`${label}: missing ${key}`);
		}
		if (r.scope && r.scope !== 'national' && !r.serves_where) {
			errors.push(`${label}: scope is ${r.scope} but serves_where is missing`);
		}
		if (r.blocked_on) {
			if (Number.isNaN(new Date(r.blocked_on).getTime())) errors.push(`${label}: blocked_on is not a date`);
			// A check after the block clears it: verified_on is then the newer date.
			else if (r.on_page !== false && (!r.verified_on || new Date(r.verified_on) <= new Date(r.blocked_on)))
				blocked.push({ file, name: r.name, url: r.source_url ?? r.url, blocked_on: r.blocked_on, verified_on: r.verified_on });
		}
		if (r.verified_on && r.on_page !== false) {
			const limit = MAX_AGE_DAYS[r.risk] ?? 365;
			const age = ageDays(r.verified_on);
			if (age > limit) warnings.push(`${label}: last verified ${age} days ago (limit ${limit})`);
		}
		for (const key of ['phone', 'text']) {
			if (!r[key]) continue;
			const d = digits(r[key]);
			if (d.length < 5) continue; // short codes like 988 or 233733 are fine to share
			// The same org may be named differently across Topics; only flag a number
			// that two different websites claim.
			const seen = phones.get(d);
			const site = domain(r.url);
			if (seen && seen.site !== site) {
				errors.push(`${label}: ${key} ${r[key]} is also listed for ${seen.name} (${seen.site}, ${seen.file})`);
			} else if (!seen) {
				phones.set(d, { name: r.name, site, file: where });
			}
		}
	}
}

// Pages past "outline" should have a resource file behind them.
for (const area of readdirSync(DOCS, { withFileTypes: true }).filter((d) => d.isDirectory())) {
	for (const f of readdirSync(join(DOCS, area.name)).filter((f) => f.endsWith('.md') && f !== 'index.md')) {
		const fm = readFileSync(join(DOCS, area.name, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
		const topic = fm.match(/^topic:\s*"?([^"\n]+)"?/m)?.[1];
		const status = fm.match(/^status:\s*(\w+)/m)?.[1];
		if (topic && status && status !== 'outline' && !topicsWithFiles.has(topic)) {
			warnings.push(`${area.name}/${f}: status is ${status} but sources/resources/${topic}.yml is missing`);
		}
	}
}

if (byHand) {
	const day = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
	for (const b of blocked.sort((a, c) => a.file.localeCompare(c.file, 'en', { numeric: true })))
		console.log(`${b.file.replace('.yml', '').padEnd(5)} ${b.name}\n      ${b.url}\n      refused scripts on ${day(b.blocked_on)}; last read ${day(b.verified_on)}`);
	console.log(`\n${blocked.length} resource(s) to open by hand. After checking one, set verified_on to today; the blocked_on line can stay as history.`);
	process.exit(0);
}
for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`${files.length} resource files, ${errors.length} errors, ${warnings.length} warnings${blocked.length ? `, ${blocked.length} to open by hand (--by-hand lists them)` : ''}`);
process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
