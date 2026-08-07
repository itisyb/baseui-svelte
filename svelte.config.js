import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/package').PackageConfig} */
const config = {
  preprocess: vitePreprocess(),
};

export default config;
