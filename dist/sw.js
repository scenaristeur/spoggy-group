importScripts("precache-manifest.fb228c5fb70c0fdd626fbdc681f6b6ab.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/* This work is licensed under the W3C Software and Document License
 * (http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document).
 */

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    // Get content from the network.
    try {
      return await fetch(event.request);
    } catch (e) {
      // Failure. Just return a 200 page, to satisfy Lighthouse.
      return new Response('You are offline :(', {status: 200});
    }
  })());
});

