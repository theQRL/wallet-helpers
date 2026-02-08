# wallet-helpers

![Build Status](https://github.com/theqrl/wallet-helpers/actions/workflows/build-and-test.yml/badge.svg?branch=main)
 [![Coverage Status](https://coveralls.io/repos/github/theQRL/wallet-helpers/badge.svg?branch=master)](https://coveralls.io/github/theQRL/wallet-helpers?branch=master) [![npm version](https://badge.fury.io/js/%40theqrl%2Fwallet-helpers.svg)](https://badge.fury.io/js/%40theqrl%2Fwallet-helpers)

A helper library for front end interfaces to the QRL

## Installation

  `npm install @theqrl/wallet-helpers`

## Usage

### v3 wallet envelope (scrypt + AES-256-GCM)

```js
const helpers = require('@theqrl/wallet-helpers')

const walletJson = JSON.stringify([{
  address: 'Q010400abcdef',
  pk: '010400deadbeef',
  hexseed: '010400feedface',
  mnemonic: 'sample mnemonic',
  height: 0,
  encrypted: false,
  version: 3,
}])

const password = 'correct horse battery staple'
const envelope = helpers.v3Wallet(walletJson, true, password)
const wallets = helpers.v3WalletDecrypt(envelope, password)
```

### Async argon2id (requires optional dependency)

```js
const helpers = require('@theqrl/wallet-helpers')

const envelope = await helpers.v3WalletAsync(walletJson, true, password, {
  kdf: {
    name: 'argon2id',
    params: {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
      hashLength: 32,
      saltLen: 32,
    },
  },
})
const wallets = await helpers.v3WalletDecryptAsync(envelope, password)
```

Install the optional dependency when you want argon2id:

  `npm install argon2`

### Unencrypted v3 envelope

```js
const envelope = helpers.v3Wallet(walletJson, false)
```

### Legacy per-field helpers

```js
const encrypted = helpers.walletDataEncrypt('secret', password)
const plain = helpers.walletDataDecrypt(encrypted, password)
```

### Wallet type detection

```js
const type = helpers.getWalletFileType(walletJson)
// => 'PYTHON-NODE' | 'WEB-WALLET' | 'CONVERTED-WEB-WALLET' | 'UNKNOWN'
```

### Convert any supported wallet to v3

```js
const envelope = helpers.convertWalletToV3(walletJson, true, password)
const wallets = helpers.v3WalletDecrypt(envelope, password)
```

For async (argon2id) flows, use `convertWalletToV3Async`.

## Browser usage

This package relies on Node's `crypto` module (including scrypt). For a plain browser demo, run `npm run build` to generate `example/bundle.js`, then open `example/index.html`. The bundle uses WebCrypto AES-GCM and `scrypt-js`.

## Example

`example/index.html` shows a minimal HTML usage of the v3 wallet helpers.

## Tests

  `npm test`

## Coverage

  `npm run cover`
