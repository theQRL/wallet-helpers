import { scrypt } from 'scrypt-js'

const DEFAULT_SCRYPT_PARAMS = {
  N: 1 << 17,
  r: 8,
  p: 1,
  dkLen: 32,
  saltLen: 32,
}

const DEFAULT_IV_LEN = 12
const TAG_LEN = 16

function getCrypto() {
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    throw new Error('WebCrypto is not available in this context')
  }
  return globalThis.crypto
}

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  getCrypto().getRandomValues(bytes)
  return bytes
}

function bytesToHex(bytes) {
  var hex = ''
  for (var i = 0; i < bytes.length; i++) {
    var value = bytes[i].toString(16)
    hex += value.length === 1 ? '0' + value : value
  }
  return hex
}

function hexToBytes(hex) {
  var length = hex.length / 2
  var bytes = new Uint8Array(length)
  for (var i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

function encodeUtf8(text) {
  return new TextEncoder().encode(text)
}

function decodeUtf8(bytes) {
  return new TextDecoder().decode(bytes)
}

function normalizeJsonInput(input) {
  if (typeof input === 'string') {
    return JSON.stringify(JSON.parse(input))
  }
  return JSON.stringify(input)
}

function buildAad(meta) {
  return encodeUtf8(JSON.stringify({
    version: meta.version,
    kdf: meta.kdf,
    cipher: {
      name: meta.cipher.name,
      iv: meta.cipher.iv,
    },
  }))
}

function buildUnencryptedEnvelope(plainJson) {
  return {
    version: 3,
    encrypted: false,
    data: plainJson,
  }
}

async function deriveKeyScrypt(password, salt, params) {
  var passwordBytes = typeof password === 'string' ? encodeUtf8(password) : new Uint8Array(password)
  return scrypt(passwordBytes, salt, params.N, params.r, params.p, params.dkLen)
}

async function encryptAead(plainBytes, keyBytes, iv, aad) {
  const key = await getCrypto().subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt'])
  const algorithm = {
    name: 'AES-GCM',
    iv: iv,
    tagLength: TAG_LEN * 8,
  }
  if (aad) {
    algorithm.additionalData = aad
  }
  const cipherBuffer = await getCrypto().subtle.encrypt(algorithm, key, plainBytes)
  const cipherBytes = new Uint8Array(cipherBuffer)
  const authTag = cipherBytes.slice(cipherBytes.length - TAG_LEN)
  const encrypted = cipherBytes.slice(0, cipherBytes.length - TAG_LEN)
  return { encrypted, authTag }
}

async function decryptAead(encrypted, authTag, keyBytes, iv, aad) {
  const key = await getCrypto().subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt'])
  const combined = new Uint8Array(encrypted.length + authTag.length)
  combined.set(encrypted, 0)
  combined.set(authTag, encrypted.length)
  const algorithm = {
    name: 'AES-GCM',
    iv: iv,
    tagLength: authTag.length * 8,
  }
  if (aad) {
    algorithm.additionalData = aad
  }
  const plainBuffer = await getCrypto().subtle.decrypt(algorithm, key, combined)
  return new Uint8Array(plainBuffer)
}

async function buildEncryptedEnvelope(plainJson, password, options) {
  const kdfOptions = options.kdf || {}
  const kdfName = (kdfOptions.name || 'scrypt').toLowerCase()

  if (kdfName !== 'scrypt') {
    throw new Error('Unsupported KDF')
  }

  const params = Object.assign({}, DEFAULT_SCRYPT_PARAMS, kdfOptions.params || {})
  const salt = randomBytes(params.saltLen)
  const ivLen = options.ivLen || DEFAULT_IV_LEN
  const iv = randomBytes(ivLen)

  const key = await deriveKeyScrypt(password, salt, params)

  const meta = {
    version: 3,
    kdf: {
      name: 'scrypt',
      params: {
        N: params.N,
        r: params.r,
        p: params.p,
        dkLen: params.dkLen,
        salt: bytesToHex(salt),
      },
    },
    cipher: {
      name: 'aes-256-gcm',
      iv: bytesToHex(iv),
    },
  }

  const aad = buildAad(meta)
  const { encrypted, authTag } = await encryptAead(encodeUtf8(plainJson), key, iv, aad)

  meta.cipher.authTag = bytesToHex(authTag)

  return {
    version: 3,
    encrypted: true,
    kdf: meta.kdf,
    cipher: meta.cipher,
    data: bytesToHex(encrypted),
  }
}

async function decryptEnvelope(envelope, password) {
  if (!envelope.encrypted) {
    return envelope.data
  }
  if (!password) {
    throw new Error('Missing password')
  }
  if (!envelope.kdf || !envelope.cipher) {
    throw new Error('Invalid wallet envelope')
  }
  if (envelope.kdf.name !== 'scrypt') {
    throw new Error('Unsupported KDF')
  }

  const params = Object.assign({}, DEFAULT_SCRYPT_PARAMS, envelope.kdf.params || {})
  const saltHex = params.salt
  if (!saltHex) {
    throw new Error('Missing scrypt salt')
  }
  const salt = hexToBytes(saltHex)
  delete params.salt

  const key = await deriveKeyScrypt(password, salt, params)
  const iv = hexToBytes(envelope.cipher.iv)
  const authTag = hexToBytes(envelope.cipher.authTag)
  const aad = buildAad({
    version: envelope.version,
    kdf: envelope.kdf,
    cipher: { name: envelope.cipher.name, iv: envelope.cipher.iv },
  })

  const decrypted = await decryptAead(hexToBytes(envelope.data), authTag, key, iv, aad)
  return decodeUtf8(decrypted)
}

export async function v3WalletAsync(json, encrypted, password, options) {
  if (json === undefined || encrypted === undefined) {
    throw new Error('Missing parameter')
  }
  if (encrypted === true && password === undefined) {
    throw new Error('Missing password')
  }
  const plainJson = normalizeJsonInput(json)
  if (encrypted !== true) {
    return buildUnencryptedEnvelope(plainJson)
  }
  return buildEncryptedEnvelope(plainJson, password, options || {})
}

export async function v3WalletDecryptAsync(input, password) {
  if (input === undefined) {
    throw new Error('Missing parameter')
  }
  const envelope = typeof input === 'string' ? JSON.parse(input) : input
  const plainJson = await decryptEnvelope(envelope, password)
  return JSON.parse(plainJson)
}
