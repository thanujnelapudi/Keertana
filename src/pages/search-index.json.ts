import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search-index';

export const prerender = true;

export const GET: APIRoute = () => {
  const index = buildSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
