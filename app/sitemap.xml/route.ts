export const GET = () => {
  const pages = ['/chat', '/pricing', '/clinic', '/diet', '/privacy', '/terms']
  return new Response(pages.map(p => `'${p}'`).join('\n'))
}
