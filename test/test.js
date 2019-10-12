var expect = require('chai').expect;
var assert = require('chai').assert;
var helpers = require('../index.js');

describe('> version', function() {
  it('.version should report same version as in npm package.json file (=' + process.env.npm_package_version + ')', function() {
    var result = helpers.version();
    expect(result).to.equal(process.env.npm_package_version);
  });
});

describe('> QRLAddressFromEPKHex', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.QRLAddressFromEPKHex()
    }).to.throw();
  })
  it('test ePK results in result of Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd', function () {
    var result = helpers.QRLAddressFromEPKHex(
    '000400106D0856A5198967360B6BDFCA4976A433FA48DEA2A726FDAF30EA8CD3FAD2113191DA3442686282B3D5160F25CF162A517FD2131F83FBF2698A58F9C46AFC5D'
    );
    expect(result).to.equal('Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd');
  })
  it('calling with incorrect ePK length throws an error', function () {
    expect(function() {
      helpers.QRLAddressFromEPKHex('12345678901234567890')
    }).to.throw();
  })
});

describe('> checkWeightsAndThreshold', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.checkWeightsAndThreshold()
    }).to.throw();
  });
  it('calling with single parameter throws an error', function () {
      expect(function() {
        helpers.checkWeightsAndThreshold([1, 2, 3])
      }).to.throw();
    });
  it('calling with float weights returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3.2,2,1], 4);
    expect(r.result).to.equal(false);
  });
  it('calling with an empty array returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([], 4);
    expect(r.result).to.equal(false);
  });
  it('calling with float threshold returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], 4.1);
    expect(r.result).to.equal(false);
  });
  it('calling with string threshold returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], '4');
    expect(r.result).to.equal(false);
  });
  it('calling with dangerous parameters ([4,5,6], 16) returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([4,5,6], 16);
    expect(r.result).to.equal(false);
  });
  it('calling with valid parameters ([3,2,1], 4) returns a true result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], 4);
    expect(r.result).to.equal(true);
  });
});
