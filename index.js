var sha256 = require("js-sha256");

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
  return hex.join("");
}

function hashPKandformat(ePK){
  const h = hexToBytes(ePK);
  return sha256(h);
}

function doConvert(ePK) {
  const a = hashPKandformat(ePK);
  const qx = sha256(hexToBytes('000400' + a));
  const qm = qx.slice(56, 64);
  return `Q${bytesToHex([0,4,0])}${a}${qm}`;
}

module.exports = {
 /**
  * Reports the current module version
  * @return {string} version
  */
  version: function() {
    return '1.0.0'
  },
  QRLAddressFromEPKHex: function (ePK) {
    if (ePK === undefined) {
      throw new Error('No ePK parameter')
    }
    if (ePK.length !== 134) {
      throw  new Error('ePK length invalid')
    }
    return doConvert(ePK)
  }
};