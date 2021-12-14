"use strict";

var crypto = require('crypto');
/**
 * AES-256-GCM Encryption
 * @param  {Buffer} plainTextBuffer
 * @param  {Buffer} key
 * @param  {Buffer} iv
 * @returns {Object}
 */


function encrypt(plainTextBuffer, key, iv) {
  var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  return {
    encrypted: Buffer.concat([cipher.update(plainTextBuffer), cipher["final"]()]),
    authTag: cipher.getAuthTag(),
    iv: iv
  };
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
  var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv).setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher["final"]()]);
}

function walletDataEncrypt(text, walletPassword) {
  var plainTextBuffer = Buffer.from(text.toString('hex'));
  var salt = crypto.randomBytes(32);
  var KEY = crypto.scryptSync(walletPassword, salt, 32, {
    N: 1024
  });
  var IV = crypto.randomBytes(12); // 96 bits as per NIST SP 800-38D

  var _encrypt = encrypt(plainTextBuffer, KEY, IV),
      encrypted = _encrypt.encrypted,
      authTag = _encrypt.authTag;

  return "".concat(IV.toString('hex'), ":").concat(authTag.toString('hex'), ":").concat(salt.toString('hex'), ":").concat(encrypted.toString('hex'));
}

function _walletDataDecrypt(text, walletPassword) {
  var splitText = text.split(':');
  var IV = splitText[0];
  var authTag = splitText[1];
  var salt = splitText[2];
  var encrypted = splitText[3];
  var KEY = crypto.scryptSync(walletPassword, Buffer.from(salt, 'hex'), 32, {
    N: 1024
  });
  var decrypted = decrypt(Buffer.from(encrypted, 'hex'), KEY, Buffer.from(IV, 'hex'), Buffer.from(authTag, 'hex'));
  return decrypted.toString();
}

module.exports = {
  v3Wallet: function v3Wallet(json, encrypted, password) {
    var wallets = [];
    JSON.parse(json).forEach(function (wallet) {
      var newWallet = {
        mnemonic: encrypted ? walletDataEncrypt(wallet.mnemonic, password) : wallet.mnemonic,
        hexseed: encrypted ? walletDataEncrypt(wallet.hexseed, password) : wallet.hexseed,
        address: encrypted ? walletDataEncrypt(wallet.address, password) : wallet.address,
        pk: encrypted ? walletDataEncrypt(wallet.pk, password) : wallet.pk,
        version: 3,
        encrypted: true
      };
      wallets.push(newWallet);
    });
    return wallets;
  },
  walletDataDecrypt: function walletDataDecrypt(text, password) {
    return _walletDataDecrypt(text, password);
  }
};
//# sourceMappingURL=v3wallet.js.map