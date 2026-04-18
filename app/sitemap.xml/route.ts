export const GET = () => {
  const pages = ['/chat', '/pricing', '/clinic', '/diet', '/privacy', '/terms'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `<url><loc>https://ayura.ai${page}</loc></url>`).join('\n  ')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
};
