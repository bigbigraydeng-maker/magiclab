import { hiddenRoutes } from '@/lib/seo';

export async function GET() {
  const robots = `User-agent: *
Allow: /
${hiddenRoutes.map((route) => `Disallow: ${route}`).join('\n')}

Sitemap: https://magiclab.nz/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
