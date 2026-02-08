"use strict";

const crypto = require('crypto');
const DEFAULT_SCRYPT_PARAMS = {
  N: 1 << 17,
  r: 8,
  p: 1,
  dkLen: 32,
  saltLen: 32
};
const DEFAULT_ARGON2ID_PARAMS = {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
  saltLen: 32
};
const DEFAULT_IV_LEN = 12;
function normalizeJsonInput(input) {
  if (typeof input === 'string') {
    return JSON.stringify(JSON.parse(input));
  }
  return JSON.stringify(input);
}
function scryptMaxMem(params) {
  return 128 * params.r * (params.N + params.p + 2);
}
function deriveKeyScrypt(password, salt, params) {
  const maxmem = params.maxmem || scryptMaxMem(params);
  return crypto.scryptSync(password, salt, params.dkLen, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem
  });
}
async function deriveKeyArgon2(password, salt, params) {
  let argon2;
  try {
    argon2 = require('argon2');
  } catch (err) {
    throw new Error('argon2 dependency not installed');
  }
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: params.memoryCost,
    timeCost: params.timeCost,
    parallelism: params.parallelism,
    hashLength: params.hashLength,
    salt,
    raw: true
  });
}
function encryptAead(plainTextBuffer, key, iv, aad) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  if (aad) {
    cipher.setAAD(aad);
  }
  return {
    encrypted: Buffer.concat([cipher.update(plainTextBuffer), cipher.final()]),
    authTag: cipher.getAuthTag()
  };
}
function decryptAead(encrypted, key, iv, authTag, aad) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  if (aad) {
    decipher.setAAD(aad);
  }
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
function buildAad(meta) {
  const aad = {
    version: meta.version,
    kdf: meta.kdf,
    cipher: {
      name: meta.cipher.name,
      iv: meta.cipher.iv
    }
  };
  return Buffer.from(JSON.stringify(aad), 'utf8');
}
function buildUnencryptedEnvelope(plainJson) {
  return {
    version: 3,
    encrypted: false,
    data: plainJson
  };
}
function buildEncryptedEnvelope(plainJson, password, options) {
  const kdfOptions = options.kdf || {};
  const kdfName = (kdfOptions.name || 'scrypt').toLowerCase();
  if (kdfName !== 'scrypt') {
    throw new Error('argon2id requires async API');
  }
  const params = Object.assign({}, DEFAULT_SCRYPT_PARAMS, kdfOptions.params || {});
  const salt = crypto.randomBytes(params.saltLen);
  const ivLen = options.ivLen || DEFAULT_IV_LEN;
  const iv = crypto.randomBytes(ivLen);
  const key = deriveKeyScrypt(password, salt, params);
  const meta = {
    version: 3,
    kdf: {
      name: 'scrypt',
      params: {
        N: params.N,
        r: params.r,
        p: params.p,
        dkLen: params.dkLen,
        salt: salt.toString('hex')
      }
    },
    cipher: {
      name: 'aes-256-gcm',
      iv: iv.toString('hex')
    }
  };
  const aad = buildAad(meta);
  const {
    encrypted,
    authTag
  } = encryptAead(Buffer.from(plainJson, 'utf8'), key, iv, aad);
  meta.cipher.authTag = authTag.toString('hex');
  return {
    version: 3,
    encrypted: true,
    kdf: meta.kdf,
    cipher: meta.cipher,
    data: encrypted.toString('hex')
  };
}
async function buildEncryptedEnvelopeAsync(plainJson, password, options) {
  const kdfOptions = options.kdf || {};
  const kdfName = (kdfOptions.name || 'scrypt').toLowerCase();
  if (kdfName !== 'scrypt' && kdfName !== 'argon2id') {
    throw new Error('Unsupported KDF');
  }
  if (kdfName === 'scrypt') {
    return buildEncryptedEnvelope(plainJson, password, options);
  }
  const params = Object.assign({}, DEFAULT_ARGON2ID_PARAMS, kdfOptions.params || {});
  const salt = crypto.randomBytes(params.saltLen);
  const ivLen = options.ivLen || DEFAULT_IV_LEN;
  const iv = crypto.randomBytes(ivLen);
  const key = await deriveKeyArgon2(password, salt, params);
  const meta = {
    version: 3,
    kdf: {
      name: 'argon2id',
      params: {
        memoryCost: params.memoryCost,
        timeCost: params.timeCost,
        parallelism: params.parallelism,
        hashLength: params.hashLength,
        salt: salt.toString('hex')
      }
    },
    cipher: {
      name: 'aes-256-gcm',
      iv: iv.toString('hex')
    }
  };
  const aad = buildAad(meta);
  const {
    encrypted,
    authTag
  } = encryptAead(Buffer.from(plainJson, 'utf8'), key, iv, aad);
  meta.cipher.authTag = authTag.toString('hex');
  return {
    version: 3,
    encrypted: true,
    kdf: meta.kdf,
    cipher: meta.cipher,
    data: encrypted.toString('hex')
  };
}
function decryptEnvelopeSync(envelope, password) {
  if (!envelope.encrypted) {
    return envelope.data;
  }
  if (!password) {
    throw new Error('Missing password');
  }
  if (!envelope.kdf || !envelope.cipher) {
    throw new Error('Invalid wallet envelope');
  }
  if (envelope.kdf.name !== 'scrypt') {
    throw new Error('argon2id requires async API');
  }
  const params = Object.assign({}, DEFAULT_SCRYPT_PARAMS, envelope.kdf.params || {});
  const saltHex = params.salt;
  if (!saltHex) {
    throw new Error('Missing scrypt salt');
  }
  const salt = Buffer.from(saltHex, 'hex');
  delete params.salt;
  const key = deriveKeyScrypt(password, salt, params);
  const iv = Buffer.from(envelope.cipher.iv, 'hex');
  const authTag = Buffer.from(envelope.cipher.authTag, 'hex');
  const aad = buildAad({
    version: envelope.version,
    kdf: envelope.kdf,
    cipher: {
      name: envelope.cipher.name,
      iv: envelope.cipher.iv
    }
  });
  const decrypted = decryptAead(Buffer.from(envelope.data, 'hex'), key, iv, authTag, aad);
  return decrypted.toString('utf8');
}
async function decryptEnvelopeAsync(envelope, password) {
  if (!envelope.encrypted) {
    return envelope.data;
  }
  if (!password) {
    throw new Error('Missing password');
  }
  if (!envelope.kdf || !envelope.cipher) {
    throw new Error('Invalid wallet envelope');
  }
  let key;
  switch (envelope.kdf.name) {
    case 'scrypt':
      {
        const params = Object.assign({}, DEFAULT_SCRYPT_PARAMS, envelope.kdf.params || {});
        const saltHex = params.salt;
        if (!saltHex) {
          throw new Error('Missing scrypt salt');
        }
        const salt = Buffer.from(saltHex, 'hex');
        delete params.salt;
        key = deriveKeyScrypt(password, salt, params);
        break;
      }
    case 'argon2id':
      {
        const params = Object.assign({}, DEFAULT_ARGON2ID_PARAMS, envelope.kdf.params || {});
        const saltHex = params.salt;
        if (!saltHex) {
          throw new Error('Missing argon2 salt');
        }
        const salt = Buffer.from(saltHex, 'hex');
        delete params.salt;
        key = await deriveKeyArgon2(password, salt, params);
        break;
      }
    default:
      throw new Error('Unsupported KDF');
  }
  const iv = Buffer.from(envelope.cipher.iv, 'hex');
  const authTag = Buffer.from(envelope.cipher.authTag, 'hex');
  const aad = buildAad({
    version: envelope.version,
    kdf: envelope.kdf,
    cipher: {
      name: envelope.cipher.name,
      iv: envelope.cipher.iv
    }
  });
  const decrypted = decryptAead(Buffer.from(envelope.data, 'hex'), key, iv, authTag, aad);
  return decrypted.toString('utf8');
}
function legacyWalletDataEncrypt(text, walletPassword) {
  const plainTextBuffer = Buffer.from(text.toString('hex'));
  const salt = crypto.randomBytes(32);
  const KEY = crypto.scryptSync(walletPassword, salt, 32, {
    N: 1024
  });
  const IV = crypto.randomBytes(12);
  const {
    encrypted,
    authTag
  } = encryptAead(plainTextBuffer, KEY, IV);
  return `${IV.toString('hex')}:${authTag.toString('hex')}:${salt.toString('hex')}:${encrypted.toString('hex')}`;
}
function legacyWalletDataDecrypt(text, walletPassword) {
  const splitText = text.split(':');
  if (splitText.length !== 4) {
    throw new Error('Invalid legacy payload');
  }
  const IV = splitText[0];
  const authTag = splitText[1];
  const salt = splitText[2];
  const encrypted = splitText[3];
  const KEY = crypto.scryptSync(walletPassword, Buffer.from(salt, 'hex'), 32, {
    N: 1024
  });
  const decrypted = decryptAead(Buffer.from(encrypted, 'hex'), KEY, Buffer.from(IV, 'hex'), Buffer.from(authTag, 'hex'));
  return decrypted.toString();
}
function isLegacyV3Array(wallet) {
  return Array.isArray(wallet) && wallet.length > 0 && wallet[0] && wallet[0].version === 3 && typeof wallet[0].mnemonic === 'string' && typeof wallet[0].hexseed === 'string' && typeof wallet[0].address === 'string' && typeof wallet[0].pk === 'string' && wallet[0].data === undefined;
}
function decryptLegacyV3(wallets, password) {
  return wallets.map(wallet => {
    if (!wallet.encrypted) {
      return wallet;
    }
    return Object.assign({}, wallet, {
      mnemonic: legacyWalletDataDecrypt(wallet.mnemonic, password),
      hexseed: legacyWalletDataDecrypt(wallet.hexseed, password),
      address: legacyWalletDataDecrypt(wallet.address, password),
      pk: legacyWalletDataDecrypt(wallet.pk, password)
    });
  });
}
function normalizeEnvelopeInput(input) {
  if (typeof input === 'string') {
    return JSON.parse(input);
  }
  return input;
}
module.exports = {
  v3Wallet: function (json, encrypted, password, options) {
    if (json === undefined || encrypted === undefined) {
      throw new Error('Missing parameter');
    }
    if (encrypted === true && password === undefined) {
      throw new Error('Missing password');
    }
    const plainJson = normalizeJsonInput(json);
    if (encrypted !== true) {
      return buildUnencryptedEnvelope(plainJson);
    }
    return buildEncryptedEnvelope(plainJson, password, options || {});
  },
  v3WalletAsync: async function (json, encrypted, password, options) {
    if (json === undefined || encrypted === undefined) {
      throw new Error('Missing parameter');
    }
    if (encrypted === true && password === undefined) {
      throw new Error('Missing password');
    }
    const plainJson = normalizeJsonInput(json);
    if (encrypted !== true) {
      return buildUnencryptedEnvelope(plainJson);
    }
    return buildEncryptedEnvelopeAsync(plainJson, password, options || {});
  },
  v3WalletDecrypt: function (input, password) {
    if (input === undefined) {
      throw new Error('Missing parameter');
    }
    const wallet = normalizeEnvelopeInput(input);
    if (isLegacyV3Array(wallet)) {
      return decryptLegacyV3(wallet, password);
    }
    const plainJson = decryptEnvelopeSync(wallet, password);
    return JSON.parse(plainJson);
  },
  v3WalletDecryptAsync: async function (input, password) {
    if (input === undefined) {
      throw new Error('Missing parameter');
    }
    const wallet = normalizeEnvelopeInput(input);
    if (isLegacyV3Array(wallet)) {
      return decryptLegacyV3(wallet, password);
    }
    const plainJson = await decryptEnvelopeAsync(wallet, password);
    return JSON.parse(plainJson);
  },
  walletDataDecrypt: function (text, password) {
    return legacyWalletDataDecrypt(text, password);
  },
  walletDataEncrypt: function (text, password) {
    return legacyWalletDataEncrypt(text, password);
  }
};
//# sourceMappingURL=v3wallet.js.map