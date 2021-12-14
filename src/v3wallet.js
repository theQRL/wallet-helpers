const crypto = require('crypto')
/**
 * AES-256-GCM Encryption
 * @param  {Buffer} plainTextBuffer
 * @param  {Buffer} key
 * @param  {Buffer} iv
 * @returns {Object}
 */
function encrypt(plainTextBuffer, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  return {
    encrypted: Buffer.concat([cipher.update(plainTextBuffer), cipher.final()]),
    authTag: cipher.getAuthTag(),
    iv,
  }
}

/**
 * AES-256-GCM Decryption
 * @param {Buffer} encrypted
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {Buffer} authTag
 * @returns {Buffer}
 */
function decrypt(encrypted, key, iv, authTag) {
  const decipher = crypto
    .createDecipheriv('aes-256-gcm', key, iv)
    .setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}

function walletDataEncrypt(text, walletPassword) {
  const plainTextBuffer = Buffer.from(text.toString('hex'))
  const salt = crypto.randomBytes(32)
  const KEY = crypto.scryptSync(walletPassword, salt, 32, { N: 1024 })
  const IV = crypto.randomBytes(12) // 96 bits as per NIST SP 800-38D
  const { encrypted, authTag } = encrypt(plainTextBuffer, KEY, IV)
  return `${IV.toString('hex')}:${authTag.toString('hex')}:${salt.toString(
    'hex'
  )}:${encrypted.toString('hex')}`
}

function walletDataDecrypt(text, walletPassword) {
  const splitText = text.split(':')
  const IV = splitText[0]
  const authTag = splitText[1]
  const salt = splitText[2]
  const encrypted = splitText[3]
  const KEY = crypto.scryptSync(walletPassword, Buffer.from(salt, 'hex'), 32, {
    N: 1024,
  })
  const decrypted = decrypt(
    Buffer.from(encrypted, 'hex'),
    KEY,
    Buffer.from(IV, 'hex'),
    Buffer.from(authTag, 'hex')
  )
  return decrypted.toString()
}

module.exports = {
  v3Wallet: function (json, encrypted, password) {
    const wallets = []
    JSON.parse(json).forEach((wallet) => {
      const newWallet = {
          mnemonic: encrypted ? walletDataEncrypt(wallet.mnemonic, password) : wallet.mnemonic,
          hexseed: encrypted ? walletDataEncrypt(wallet.hexseed, password) : wallet.hexseed,
          address: encrypted ? walletDataEncrypt(wallet.address, password) : wallet.address,
          pk: encrypted ? walletDataEncrypt(wallet.pk, password) : wallet.pk,
          version: 3,
          encrypted: true
        }
      wallets.push(newWallet)
    })
    return wallets
  },
  walletDataDecrypt: function(text, password) {
    return walletDataDecrypt(text, password)
  }
}
