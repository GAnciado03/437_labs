export function slugify(value?: string, fallback = 'item'): string {
  if (!value) return fallback;
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug && slug.length ? slug : fallback;
}
