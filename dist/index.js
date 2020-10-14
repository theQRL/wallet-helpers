"use strict";

var sha256 = require('js-sha256');

Array.prototype.equals = function (array, strict) {
  if (!array) return false;
  if (arguments.length == 1) strict = true;
  if (this.length != array.length) return false;

  for (var i = 0; i < this.length; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i], strict)) return false;
    } else if (strict && this[i] != array[i]) {
      return false;
    } else if (!strict) {
      return this.sort().equals(array.sort(), true);
    }
  }

  return true;
};

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

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

function _checkWeightsAndThreshold(arr, threshold) {
  // check length > 0
  if (arr.length === 0) {
    return {
      result: false,
      error: 'Array has length 0'
    };
  } // check each element in array, then threshold, is an integer


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
  } // check threshold can actually be reacher


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

function _getWalletFileType(wallet) {
  // determines source of wallet file
  var webWallet = ['address', 'addressB32', 'pk', 'hexseed', 'mnemonic', 'height', 'hashFunction', 'signatureType', 'index', 'encrypted'];
  var pythonNode = ['addresses', 'encrypted', 'version'];
  var convertedWebWallet = ['pk', 'hexseed', 'mnemonic', 'height', 'hashFunction', 'signatureType', 'index', 'address', 'encrypted'];

  if (pythonNode.equals(Object.keys(wallet), false)) {
    return 'PYTHON-NODE';
  }

  if (webWallet.equals(Object.keys(wallet[0]), false)) {
    return 'WEB-WALLET';
  }

  if (convertedWebWallet.equals(Object.keys(wallet[0]), false)) {
    return 'CONVERTED-WEB-WALLET';
  }

  return 'UNKNOWN';
}

function _isWalletFileDeprecated(wallet) {
  if (_getWalletFileType(wallet) === 'PYTHON-NODE') return true; // There are three characteristics that describe a deprecated encrypted wallet file
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

function _pythonNodeToWebWallet(wallet) {
  var output = [];
  wallet.addresses.forEach(function (element) {
    var e = element;
    e.encrypted = wallet.encrypted;
    output.push(e);
  });
  return output;
}

module.exports = {
  /**
   * Reports the current module version
   * @return {string} version
   */
  version: function version() {
    return '2.1.0';
  },
  QRLAddressFromEPKHex: function QRLAddressFromEPKHex(ePK) {
    if (ePK === undefined) {
      throw new Error('No ePK parameter');
    }

    if (ePK.length !== 134) {
      throw new Error('ePK length invalid');
    }

    return doConvert(ePK);
  },
  checkWeightsAndThreshold: function checkWeightsAndThreshold(arr, threshold) {
    if (arr === undefined || threshold === undefined) {
      throw new Error('Missing parameter');
    }

    return _checkWeightsAndThreshold(arr, threshold);
  },
  isWalletFileDeprecated: function isWalletFileDeprecated(wallet) {
    if (wallet === undefined) {
      throw new Error('Missing parameter');
    }

    return _isWalletFileDeprecated(wallet);
  },
  getWalletFileType: function getWalletFileType(wallet) {
    if (wallet === undefined) {
      throw new Error('Missing parameter');
    }

    return _getWalletFileType(wallet);
  },
  pythonNodeToWebWallet: function pythonNodeToWebWallet(wallet) {
    if (wallet === undefined) {
      throw new Error('Missing parameter');
    }

    return _pythonNodeToWebWallet(wallet);
  }
};
//# sourceMappingURL=index.js.map