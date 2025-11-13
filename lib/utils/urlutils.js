// Utility to resolve relative asset paths (e.g., "/uploads/...")
// to absolute URLs using NEXT_PUBLIC_API_URL.
// If the provided URL is already absolute, it is returned as-is.
export function toPublicAssetUrl(url) {
  if (!url) return '';
  const isAbsolute = /^https?:\/\//i.test(url);
  if (isAbsolute) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  if (!base) return url;
  const needsSlash = url.startsWith('/') ? '' : '/';
  return `${base}${needsSlash}${url}`;
}

