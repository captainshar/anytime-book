// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const areas = [
	'First Things',
	'Safety and Getting Started',
	'Your Mind and Feelings',
	'Money',
	'A Home and Daily Life',
	'Health and Your Body',
	'Talking to People and the World',
	'Learning and Work',
	'Big Life Decisions',
	'Fun, Rest, and Being You',
];

const slugify = (/** @type {string} */ s) =>
	s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// https://astro.build/config
export default defineConfig({
	site: 'https://anytimebook.org',
	integrations: [
		starlight({
			title: 'The Anytime Book',
			description: 'A free map to everyday adult life — at any time, from any starting point. United States Edition.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/captainshar/anytime-book' },
			],
			editLink: {
				baseUrl: 'https://github.com/captainshar/anytime-book/edit/main/',
			},
			lastUpdated: true,
			components: {
				// Footer dates: facts checked, read by a person, then git's last updated.
				LastUpdated: './src/components/ReviewDates.astro',
			},
			sidebar: [
				{ label: 'How to use this book', slug: 'how-to-use' },
				{ label: 'How this book was made', slug: 'how-this-book-was-made' },
				...areas.map((label, i) => ({
					label: `${i + 1}. ${label}`,
					collapsed: true,
					items: [{ autogenerate: { directory: slugify(label) } }],
				})),
				{ label: 'A last word', slug: 'a-last-word' },
			],
		}),
	],
});
