export default function slugify(
  text: string, 
  options?: { lower?: boolean; strict?: boolean }
): string {
  let slug = text.toString();
  
  if (options?.lower !== false) {
    slug = slug.toLowerCase();
  }
  
  slug = slug.trim();
  
  if (options?.strict) {
    // Remove non-alphanumeric, non-spaces, non-dashes
    slug = slug.replace(/[^\w\s\-]+/g, '');
  }
  
  return slug
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}
