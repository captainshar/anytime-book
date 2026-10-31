// Rechecks the links lychee reported as broken, in a real browser.
// Usage: node scripts/recheck-links.mjs <lychee.json> <report.md>
//   <lychee.json> is lychee's --format json output; the markdown report is written to <report.md>.
// Why: lychee's plain HTTP client gets 404s from sites that only serve real browsers
// (consumer.ftc.gov is one), and it counts a page that now redirects to a homepage as fine.
// This loads every failed URL in headless Chromium and sorts it into three piles:
//   still failing   404, 410, 5xx, no response, a navigation error, or a redirect to the homepage
//   blocked         401, 403, or 429: the site refuses automated clients. Nobody can check these
//                   except a person in a browser, so they are listed for the next human review
//                   and do not count as failures (the same policy as lychee's --accept 403,429).
//   loaded          anything else under 400
// Exit codes: 0 nothing still fails, 1 some links still fail, 2 the recheck could not run
// (Playwright or Chromium missing: run `npm ci && npx playwright install --with-deps chromium`).
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	console.error('Usage: node scripts/recheck-links.mjs <lychee.json> <report.md>');
	process.exit(2);
}

const INSTALL = 'npm ci && npx playwright install --with-deps chromium';
const CONCURRENCY = 3;
const TIMEOUT_MS = 30_000;
const BLOCKED = new Set([401, 403, 429]);

const giveUp = (/** @type {string} */ why) => {
	writeFileSync(output, `# Link recheck\n\nThe browser recheck could not run: ${why}\n\nRun \`${INSTALL}\` and try again.\n`);
	console.error(`${why}\nRun: ${INSTALL}`);
	process.exit(2);
};

// url -> { pages: Set<string>, lychee: string }
const failed = new Map();
const stats = JSON.parse(readFileSync(input, 'utf8'));
for (const [page, entries] of Object.entries(stats.fail_map ?? {})) {
	for (const e of entries ?? []) {
		const url = e.url ?? e.uri;
		if (!url) continue;
		const text = typeof e.status === 'string' ? e.status : (e.status?.text ?? 'failed');
		const f = failed.get(url) ?? { pages: new Set(), lychee: text };
		f.pages.add(page);
		failed.set(url, f);
	}
}
if (!failed.size) {
	writeFileSync(output, '# Link recheck\n\nlychee reported no failed links; nothing to recheck.\n');
	console.log('No failed links to recheck.');
	process.exit(0);
}

let chromium;
try {
	({ chromium } = await import('playwright'));
} catch {
	giveUp('the playwright package is not installed.');
}
let browser;
try {
	browser = await chromium.launch();
} catch (e) {
	giveUp(`Chromium could not start (${e instanceof Error ? e.message.split('\n')[0] : e}).`);
}
const context = await browser.newContext();

const pathOf = (/** @type {string} */ u) => {
	try {
		return new URL(u).pathname.replace(/\/+$/, '');
	} catch {
		return '';
	}
};

// url -> { kind: 'ok' | 'blocked' | 'fail', detail: string, finalUrl: string }
const results = new Map();
async function check(/** @type {string} */ url) {
	const page = await context.newPage();
	try {
		const res = await page.goto(url, { timeout: TIMEOUT_MS, waitUntil: 'domcontentloaded' });
		const status = res?.status();
		const finalUrl = page.url();
		let kind = 'fail';
		let detail = status ? `HTTP ${status}` : 'no response';
		if (status && BLOCKED.has(status)) kind = 'blocked';
		else if (status && status < 400) {
			// A deep link that lands on the homepage is a page that is gone, not a page that loaded.
			if (pathOf(url) && !pathOf(finalUrl)) detail = `HTTP ${status}, but it redirects to the homepage, so the page is probably gone`;
			else kind = 'ok';
		}
		results.set(url, { kind, detail, finalUrl });
	} catch (e) {
		results.set(url, { kind: 'fail', detail: (e instanceof Error ? e.message : String(e)).split('\n')[0], finalUrl: url });
	} finally {
		await page.close();
	}
}
const queue = [...failed.keys()];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
	while (queue.length) await check(queue.shift());
}));
await browser.close();

const pile = (/** @type {string} */ kind) => [...failed].filter(([u]) => results.get(u).kind === kind);
const still = pile('fail');
const blocked = pile('blocked');
const loaded = pile('ok');
const moved = (/** @type {string} */ u) => (results.get(u).finalUrl !== u ? ` (now at <${results.get(u).finalUrl}>)` : '');
const byPage = (/** @type {[string, {pages: Set<string>}][]} */ list) => {
	const m = new Map();
	for (const [u, f] of list) for (const p of f.pages) (m.get(p) ?? m.set(p, []).get(p)).push(u);
	return [...m].sort();
};

const lines = [
	'# Link recheck',
	'',
	`lychee reported ${failed.size} failed link(s). Each was loaded in headless Chromium.`,
	'',
	'| | Count |',
	'| --- | --- |',
	`| Checked | ${failed.size} |`,
	`| Still failing | ${still.length} |`,
	`| Blocked for automated checks (check by hand) | ${blocked.length} |`,
	`| Loaded in a browser (ignored) | ${loaded.length} |`,
	'',
];
if (still.length) {
	lines.push('## Still failing', '');
	for (const [p, urls] of byPage(still)) {
		lines.push(`### ${p}`, '');
		for (const u of urls) lines.push(`- <${u}> — ${results.get(u).detail}; lychee: ${failed.get(u).lychee}${moved(u)}`);
		lines.push('');
	}
}
if (blocked.length) {
	lines.push(
		'## Blocked for automated checks',
		'',
		'These sites refuse anything that is not a person in a browser, so no script can tell whether the page is still there. Open each one when you next review its page.',
		'',
	);
	for (const [p, urls] of byPage(blocked)) {
		lines.push(`### ${p}`, '');
		for (const u of urls) lines.push(`- <${u}> — ${results.get(u).detail} in a browser; lychee: ${failed.get(u).lychee}`);
		lines.push('');
	}
}
if (loaded.length) {
	lines.push('<details>', `<summary>Loaded in a browser (ignored): ${loaded.length}</summary>`, '');
	for (const [u, f] of loaded) lines.push(`- <${u}> — ${results.get(u).detail}; lychee said: ${f.lychee}${moved(u)}`);
	lines.push('', '</details>', '');
}
writeFileSync(output, lines.join('\n'));

console.log(`${failed.size} rechecked: ${still.length} still failing, ${blocked.length} blocked, ${loaded.length} loaded. Report: ${output}`);
process.exit(still.length ? 1 : 0);
