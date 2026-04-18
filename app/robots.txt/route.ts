export const GET = () => {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://ayura.ai/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
};
