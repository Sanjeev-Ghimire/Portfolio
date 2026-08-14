// Lightweight router helper (non-invasive)
// - Normalize internal links by removing .html extensions
// - Ensure internal links use absolute root paths

window.addEventListener('DOMContentLoaded', () => {
  const anchors = Array.from(document.querySelectorAll('a[href]'));

  anchors.forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (!href) return;

      // ignore external links, mailto, tel, anchors
      if (/^(https?:|mailto:|tel:|#)/i.test(href)) return;

      // normalize ./ or relative links by resolving to absolute
      if (href.startsWith('./') || href.startsWith('../')) {
        const resolved = new URL(href, window.location.origin + window.location.pathname).pathname;
        a.setAttribute('href', resolved);
        return;
      }

      // if link ends with .html, remove the extension
      if (href.endsWith('.html')) {
        const newHref = href.replace(/\.html$/i, '');
        a.setAttribute('href', newHref.startsWith('/') ? newHref : '/' + newHref);
      }

      // ensure root-relative links start with /
      if (!href.startsWith('/') && !href.startsWith('#') && !href.includes(':')) {
        a.setAttribute('href', '/' + href);
      }

    } catch (e) {
      // ignore URL parse errors
      return;
    }
  });

  // optional: when clicking internal extensionless links, allow normal navigation
  // (This file purposely does not implement a full SPA router.)
});