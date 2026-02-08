# Example

This example uses a browser bundle built from `example/browser.js`.

Steps:
1) Run `npm install`
2) Run `npm run build` (or `npm run build:example`)
3) Open `example/index.html` in a browser

`bundle.js` is generated into `example/` and loaded by the page. The bundle uses WebCrypto for AES-GCM and `scrypt-js` for key derivation.
