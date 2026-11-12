// Downloads a source page and saves its visible text, so fact-check quotes can be checked word for word.
// Usage:
//   node scripts/fetch-source.mjs <url>                 fetch, save, and print where the text went
//   node scripts/fetch-source.mjs --save <url> < file   save text you got another way (for example, a browser)
//   node scripts/fetch-source.mjs --path <url>          print where the text for <url> is (or would be) saved
// Text goes to .cache/sources/<hash>.txt (gitignored). Read or search that file; quote from it exactly.
// Exit codes: 0 saved, 1 bad usage or network error, 2 the site refused (use a browser, then --save).
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CACHE_DIR, cachePath, htmlToText } from './lib/source-text.mjs';

// Behind a proxy (cloud sessions set HTTPS_PROXY), Node's fetch only uses it when NODE_USE_ENV_PROXY
// is set. Run again with it set, so nobody has to remember the prefix.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
	const again = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
	process.exit(again.status ?? 1);
}

const args = process.argv.slice(2);
const mode = args[0] === '--save' || args[0] === '--path' ? args.shift() : 'fetch';
const url = args[0];
if (!url || !/^https?:\/\//.test(url)) {
	console.error('Usage: node scripts/fetch-source.mjs [--save | --path] <https://...>');
	process.exit(1);
}
const out = cachePath(url);
if (mode === '--path') {
	console.log(`${out}${existsSync(out) ? '' : ' (not saved yet)'}`);
	process.exit(0);
}
mkdirSync(CACHE_DIR, { recursive: true });

const save = (/** @type {string} */ text, /** @type {string} */ how) => {
	const stamp = `SOURCE: ${url}\nSAVED: ${new Date().toISOString().slice(0, 10)} (${how})\n\n`;
	writeFileSync(out, stamp + text);
	const words = text.split(/\s+/).length;
	console.log(`Saved ${words} words to ${out}`);
	if (words < 150) console.log('Warning: very little text. The page may need JavaScript or may be a block page. Try a browser, then --save.');
};

if (mode === '--save') {
	const text = readFileSync(0, 'utf8');
	if (!text.trim()) {
		console.error('Nothing on stdin to save.');
		process.exit(1);
	}
	save(text.trim(), 'browser');
	process.exit(0);
}

try {
	const res = await fetch(url, {
		redirect: 'follow',
		signal: AbortSignal.timeout(30_000),
		headers: {
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
			accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5',
		},
	});
	if ([401, 403, 429, 503].includes(res.status)) {
		console.error(`BLOCKED: ${url} returned ${res.status}. Open it in a browser, copy the page text, and run --save.`);
		process.exit(2);
	}
	if (!res.ok) {
		console.error(`HTTP ${res.status} for ${url}${res.status === 404 ? ' (page not found: the source may have moved or closed)' : ''}`);
		process.exit(1);
	}
	if (res.url !== url) console.log(`Redirected to ${res.url}`);
	const type = res.headers.get('content-type') ?? '';
	if (type.includes('pdf') || /\.pdf$/i.test(new URL(res.url).pathname)) {
		// pdftotext ships with Git for Windows and poppler-utils.
		// The Windows build can't read a PDF from stdin, so go through a temp file.
		const tmp = join(tmpdir(), `fetch-source-${process.pid}.pdf`);
		writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
		const text = spawnSync('pdftotext', ['-layout', tmp, '-'], { maxBuffer: 64 * 1024 * 1024 });
		rmSync(tmp, { force: true });
		if (text.status !== 0) {
			console.error(`PDF: ${url} is a PDF and pdftotext is not available. Read it with a PDF tool, then pipe the text to --save.`);
			process.exit(2);
		}
		save(text.stdout.toString('utf8'), `fetched PDF, HTTP ${res.status}`);
		process.exit(0);
	}
	const body = await res.text();
	save(type.includes('html') || /^\s*</.test(body) ? htmlToText(body) : body, `fetched, HTTP ${res.status}`);
} catch (e) {
	console.error(`Could not fetch ${url}: ${e instanceof Error ? e.message : e}`);
	process.exit(1);
}
