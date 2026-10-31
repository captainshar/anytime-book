// Shared helpers for saved source pages (used by fetch-source.mjs and check-facts.mjs).
import { createHash } from 'node:crypto';
import { join } from 'node:path';

export const CACHE_DIR = '.cache/sources';

/** Where the saved text for a URL lives. The fragment (#...) is ignored. */
export const cachePath = (/** @type {string} */ url) =>
	join(CACHE_DIR, createHash('sha1').update(url.split('#')[0].trim()).digest('hex').slice(0, 16) + '.txt');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', copy: '©', reg: '®', trade: '™' };

/** Turns an HTML page into its visible text, one block per line. */
export function htmlToText(/** @type {string} */ html) {
	return html
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<(br|hr)\b[^>]*>/gi, '\n')
		.replace(/<\/?(p|div|li|ul|ol|h[1-6]|tr|td|th|table|section|article|header|footer|nav|main|aside|blockquote|dt|dd|figcaption|title)\b[^>]*>/gi, '\n')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
		.split('\n')
		.map((l) => l.replace(/[ \t ]+/g, ' ').trim())
		.filter(Boolean)
		.join('\n');
}

/** Loose form for comparing a quote to saved text: same words, ignoring case, spacing, curly quotes, and dash styles. */
export const normalize = (/** @type {string} */ s) =>
	String(s)
		.toLowerCase()
		.replace(/[‘’ʼ`]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/[‐-―−]/g, '-')
		.replace(/…/g, '...')
		.replace(/\s+/g, ' ')
		.trim();
