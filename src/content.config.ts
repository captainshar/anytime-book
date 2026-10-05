import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Topic number from the outline, e.g. "4.6".
				topic: z.string().optional(),
				// Editorial state: outline → draft → verified.
				status: z.enum(['outline', 'draft', 'verified']).optional(),
				// Date the resources on this page were last checked (YYYY-MM-DD).
				last_verified: z.coerce.date().optional(),
			}),
		}),
	}),
};
