"use strict";

var sha256 = require('js-sha256');
function sameKeys(expected, actual) {
  if (expected.length !== actual.length) return false;
  var set = new Set(actual);
  return expected.every(function (k) {
    return set.has(k);
  });
}
var v3WalletHelpers = require('./v3wallet');
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join('');
}
function hashPKandformat(ePK) {
  var h = hexToBytes(ePK);
  return sha256(h);
}
function doConvert(ePK) {
  var a = hashPKandformat(ePK);
  var qx = sha256(hexToBytes('000400' + a));
  var qm = qx.slice(56, 64);
  return 'Q' + bytesToHex([0, 4, 0]) + a + qm;
}
function isArrayOfInts(arr) {
  var result = 0;
  arr.forEach(function (element) {
    if (element === parseInt(element, 10)) {
      result += 1;
    }
  });
  if (result === arr.length) {
    return true;
  }
  return false;
}
function checkWeightsAndThreshold(arr, threshold) {
  // check length > 0
  if (arr.length === 0) {
    return {
      result: false,
      error: 'Array has length 0'
    };
  }
  // check each element in array, then threshold, is an integer
  if (!isArrayOfInts(arr)) {
    return {
      result: false,
      error: 'Array has non-integer values'
    };
  }
  if (threshold !== parseInt(threshold, 10)) {
    return {
      result: false,
      error: 'Threshold is not an integer'
    };
  }
  // check threshold can actually be reacher
  var sum = arr.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  });
  if (threshold > sum) {
    return {
      result: false,
      error: 'Threshold can never be reached with these weights'
    };
  }
  return {
    result: true
  };
}
function getWalletFileType(wallet) {
  // determines source of wallet file
  const webWallet = ['address', 'addressB32', 'pk', 'hexseed', 'mnemonic', 'height', 'hashFunction', 'signatureType', 'index', 'encrypted'];
  const pythonNode = ['addresses', 'encrypted', 'version'];
  const convertedWebWallet = ['pk', 'hexseed', 'mnemonic', 'height', 'hashFunction', 'signatureType', 'index', 'address', 'encrypted'];
  if (sameKeys(pythonNode, Object.keys(wallet))) {
    return 'PYTHON-NODE';
  }
  if (wallet instanceof Array) {
    if (sameKeys(webWallet, Object.keys(wallet[0]))) {
      return 'WEB-WALLET';
    }
    if (sameKeys(convertedWebWallet, Object.keys(wallet[0]))) {
      return 'CONVERTED-WEB-WALLET';
    }
  }
  return 'UNKNOWN';
}
function isWalletFileDeprecated(wallet) {
  if (getWalletFileType(wallet) === 'PYTHON-NODE') return true;
  // There are three characteristics that describe a deprecated encrypted wallet file
  // 1: The encrypted field is true and
  // 2: The addressB32 field is unencrypted and
  // 3: The pk field is unencrypted.
  // Whilst neither of these fields risk funds being lost, they do reveal a users public
  // address if their wallet file is stolen. This is a privacy concern.
  // We can determine if they are unencrypted by checking their lengths.
  // If addressB32 field is 64 characters in length, and pk field is 134 characters in length.
  if (typeof wallet[0].encrypted !== 'undefined' && typeof wallet[0].addressB32 !== 'undefined' && typeof wallet[0].pk !== 'undefined') {
    if (wallet[0].encrypted === true && wallet[0].addressB32.length === 64 && wallet[0].pk.length === 134) {
      return true;
    }
  }
  return false;
}
function pythonNodeToWebWallet(wallet) {
  const output = [];
  wallet.addresses.forEach(element => {
    const e = element;
    e.encrypted = wallet.encrypted;
    output.push(e);
  });
  return output;
}
function normalizeWalletInput(input) {
  if (typeof input === 'string') {
    return JSON.parse(input);
  }
  return input;
}
function isV3Envelope(wallet) {
  return wallet && typeof wallet === 'object' && !Array.isArray(wallet) && wallet.version === 3 && typeof wallet.encrypted === 'boolean' && typeof wallet.data === 'string';
}
function isLegacyV3Array(wallet) {
  return Array.isArray(wallet) && wallet.length > 0 && wallet[0] && wallet[0].version === 3 && typeof wallet[0].mnemonic === 'string' && typeof wallet[0].hexseed === 'string' && typeof wallet[0].address === 'string' && typeof wallet[0].pk === 'string' && wallet[0].data === undefined;
}
function convertWalletToV3(input, encrypted, password, options) {
  if (input === undefined || encrypted === undefined) {
    throw new Error("Missing parameter");
  }
  if (encrypted === true && password === undefined) {
    throw new Error("Missing password");
  }
  const wallet = normalizeWalletInput(input);
  if (isV3Envelope(wallet)) {
    return wallet;
  }
  let payload = wallet;
  if (isLegacyV3Array(wallet)) {
    payload = v3WalletHelpers.v3WalletDecrypt(wallet, password);
  } else {
    const walletType = getWalletFileType(wallet);
    if (walletType === 'PYTHON-NODE') {
      payload = pythonNodeToWebWallet(wallet);
    } else if (walletType !== 'WEB-WALLET' && walletType !== 'CONVERTED-WEB-WALLET') {
      throw new Error("Unsupported wallet format");
    }
  }
  return v3WalletHelpers.v3Wallet(payload, encrypted, password, options);
}
async function convertWalletToV3Async(input, encrypted, password, options) {
  if (input === undefined || encrypted === undefined) {
    throw new Error("Missing parameter");
  }
  if (encrypted === true && password === undefined) {
    throw new Error("Missing password");
  }
  const wallet = normalizeWalletInput(input);
  if (isV3Envelope(wallet)) {
    return wallet;
  }
  let payload = wallet;
  if (isLegacyV3Array(wallet)) {
    payload = await v3WalletHelpers.v3WalletDecryptAsync(wallet, password);
  } else {
    const walletType = getWalletFileType(wallet);
    if (walletType === 'PYTHON-NODE') {
      payload = pythonNodeToWebWallet(wallet);
    } else if (walletType !== 'WEB-WALLET' && walletType !== 'CONVERTED-WEB-WALLET') {
      throw new Error("Unsupported wallet format");
    }
  }
  return v3WalletHelpers.v3WalletAsync(payload, encrypted, password, options);
}
module.exports = {
  /**
   * Reports the current module version
   * @return {string} version
   */
  version: function () {
    return "4.0.0";
  },
  QRLAddressFromEPKHex: function (ePK) {
    if (ePK === undefined) {
      throw new Error("No ePK parameter");
    }
    if (ePK.length !== 134) {
      throw new Error("ePK length invalid");
    }
    return doConvert(ePK);
  },
  checkWeightsAndThreshold: function (arr, threshold) {
    if (arr === undefined || threshold === undefined) {
      throw new Error("Missing parameter");
    }
    return checkWeightsAndThreshold(arr, threshold);
  },
  isWalletFileDeprecated: function (wallet) {
    if (wallet === undefined) {
      throw new Error("Missing parameter");
    }
    return isWalletFileDeprecated(wallet);
  },
  getWalletFileType: function (wallet) {
    if (wallet === undefined) {
      throw new Error("Missing parameter");
    }
    return getWalletFileType(wallet);
  },
  pythonNodeToWebWallet: function (wallet) {
    if (wallet === undefined) {
      throw new Error("Missing parameter");
    }
    return pythonNodeToWebWallet(wallet);
  },
  convertWalletToV3: function (wallet, encrypted, password, options) {
    return convertWalletToV3(wallet, encrypted, password, options);
  },
  convertWalletToV3Async: function (wallet, encrypted, password, options) {
    return convertWalletToV3Async(wallet, encrypted, password, options);
  },
  v3Wallet: function (json, encrypted, password, options) {
    if (json === undefined || encrypted === undefined) {
      throw new Error("Missing parameter");
    }
    if (encrypted === true && password === undefined) {
      throw new Error("Missing password");
    }
    return v3WalletHelpers.v3Wallet(json, encrypted, password, options);
  },
  v3WalletAsync: function (json, encrypted, password, options) {
    return v3WalletHelpers.v3WalletAsync(json, encrypted, password, options);
  },
  v3WalletDecrypt: function (input, password) {
    return v3WalletHelpers.v3WalletDecrypt(input, password);
  },
  v3WalletDecryptAsync: function (input, password) {
    return v3WalletHelpers.v3WalletDecryptAsync(input, password);
  },
  walletDataDecrypt: function (text, password) {
    return v3WalletHelpers.walletDataDecrypt(text, password);
  },
  walletDataEncrypt: function (text, password) {
    return v3WalletHelpers.walletDataEncrypt(text, password);
  }
};
//# sourceMappingURL=index.js.map