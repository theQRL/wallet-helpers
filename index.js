var sha256 = require('js-sha256');

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join('');
}

function hashPKandformat(ePK){
  var h = hexToBytes(ePK);
  return sha256(h);
}

function doConvert(ePK) {
  var a = hashPKandformat(ePK);
  var qx = sha256(hexToBytes('000400' + a));
  var qm = qx.slice(56, 64);
  return 'Q' + bytesToHex([0,4,0]) + a + qm;
}

function isArrayOfInts(arr) {
  var result = 0;
  arr.forEach(function(element) {
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
  if (arr.length === 0 ) {
    return {result: false, error: 'Array has length 0'};
  }
  // check each element in array, then threshold, is an integer
  if (!isArrayOfInts(arr)) {
    return {result: false, error: 'Array has non-integer values'};
  }
  if (threshold !== parseInt(threshold, 10)) {
    return {result: false, error: 'Threshold is not an integer'};
  }
  // check threshold can actually be reacher
  var sum = arr.reduce(function(accumulator, currentValue) {
    return accumulator + currentValue;
  });
  if (threshold > sum) {
    return {result: false, error: 'Threshold can never be reached with these weights'};
  }
  return {result: true};
}

module.exports = {
 /**
  * Reports the current module version
  * @return {string} version
  */
  version: function() {
    return '2.0.0'
  },
  QRLAddressFromEPKHex: function (ePK) {
    if (ePK === undefined) {
      throw new Error('No ePK parameter')
    }
    if (ePK.length !== 134) {
      throw new Error('ePK length invalid')
    }
    return doConvert(ePK)
  },
  checkWeightsAndThreshold: function(arr, threshold) {
    if (arr === undefined || threshold === undefined) {
      throw new Error('Missing parameter')
    }
    return checkWeightsAndThreshold(arr, threshold)
  }
};