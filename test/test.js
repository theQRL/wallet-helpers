var expect = require('chai').expect;
var assert = require('chai').assert;
var helpers = require('../index.js');

describe('#deploy', function() {
  it(`.version should report same version as in npm package.json file (=${process.env.npm_package_version})`, function() {
    var result = helpers.version();
    expect(result).to.equal(process.env.npm_package_version);
  });
});

describe('#QRLAddressFromEPKHex', function() {
  it('calling with no parameter throws an error', function () {
    expect(() => {
      helpers.QRLAddressFromEPKHex()
    }).to.throw();
  })
});

describe('#QRLAddressFromEPKHex', function() {
  it('test ePK results in result of Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd', function () {
    var result = helpers.QRLAddressFromEPKHex(
    '000400106D0856A5198967360B6BDFCA4976A433FA48DEA2A726FDAF30EA8CD3FAD2113191DA3442686282B3D5160F25CF162A517FD2131F83FBF2698A58F9C46AFC5D'
    );
    expect(result).to.equal('Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd');
  })
});