// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Sentinel',
      description: 'Lint everything but your code.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com' },
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [{ label: 'What is Sentinel?', slug: 'index' }],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Getting started', slug: 'guides/getting-started' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
});
