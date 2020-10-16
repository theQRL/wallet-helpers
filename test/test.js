var expect = require('chai').expect
var assert = require('chai').assert
var helpers = require('../src/index.js')

var wallet1 = JSON.parse('{"addresses": [{"pk": null, "hexseed": "010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74", "mnemonic": "absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08"}, {"pk": null, "hexseed": "010600dc306de0e5e64fd952cf90c84059718ab980549e1df8ef55d98a9c7389f6b7625810acde0241d980e138d950f8832367", "mnemonic": "absorb grape sweat along tenant glow figure newly song assign dream not merit nurse fold test whiff wage style pray java partly rich catch ball sober acute brim locate beard stuffy axle lowest daisy", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q01060093e1ca84025a32577afc54725955203e72f918d268c95ff37c4bbd2fac9e706f1c95b6e1"}], "encrypted": false, "version": 1}')
var wallet2 = JSON.parse('{"addresses": [{"pk": null, "hexseed": "010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74", "mnemonic": "absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08"}], "encrypted": false, "version": 1}')
var wallet3 = JSON.parse('[{"address":"VTKTxhRCBjdvZHf3Mt9Cjap/GhmzNth4FltJQo/k7/TBEwaqnQv0qQyIx2MOPDsEzXPMxBdvGf/Z4RTS3WLcBmK2YmS9ajhmhwIjzpnoOiXpagDl+pepQ42ownm6UF4=","addressB32":"k1eBOQAnMwqnG0ewqsNlsTIdLf9XgjSKR5D3z0wprjjTdQaoaiRcjEV5mOAOPuXiQNhk01mCH1pnNppCxXR4UL5cKPIWZf3VdFqaf56rRIa4=","pk":"wj+cyK9/P8jWceTCL3xWBh33gYmCSi4Uj+VARx7XlHUPKYrGMsN6QeRx/rRkiH+xs0HsaLwJRuOKoGhfjLExNCOiFSZoZlgNW1xs644KMFZCNL8j1rGGxTYQXKlRLM3fEkuVrIqib9U5fQmJ1nyVvP0zPgaFbUQN4WkxIos6Zt2Udx0ez5BM+XAs8vG5G4+/vfBIis7b","hexseed":"4oG3LcAbeK7nl+UZyp8X94TJpBWWaIS5w+ttLws6S1WWd28aJ7ff4026OQYMtnKDaA4OwdC/8Au+1N/S2GsuGYIpGPGMIPugeruTnAuW/3Bl800mXvb0usTkrdvB2ccX7ZZyBXoAurGLPS9go6xfM4lavsv17w==","mnemonic":"z9YEawh7DanbbIf6kwVzaBXY7WragEccDjubSyuZX2CMt+z7/ISRtNSw+g8zJPItVFa13yJ+F+a7RszOVRmL4loPKN+w80QHf35EPsFJ9MCwZYysW4rufGqjQGVIXk3nPqzjGgheUZhhwga8YfJQ1uO5p4z6imN7jrbMXd5Tj5g1VaUidUFAjyiBR94sCD5yjcQIJ0FYvmppGZ97TSCpxryHlOov3ypabmq2+XbaHBSX8wnKlzaIlJiEMO9NQrfSvuh1NNE1l2A7rehl+gU7Wefx7TbdY/HA++onrKGkEJ7iCs8=","height":8,"hashFunction":1,"signatureType":0,"index":0,"encrypted":true}]')
var wallet4 = JSON.parse('[{"address":"VTKTxhRCBjdvZHf3Mt9Cjap/GhmzNth4FltJQo/k7/TBEwaqnQv0qQyIx2MOPDsEzXPMxBdvGf/Z4RTS3WLcBmK2YmS9ajhmhwIjzpnoOiXpagDl+pepQ42ownm6UF4=","addressB32":"k1eBOQAnMwqnG0ewqsNlsTIdLf9XgjSKR5D3z0wprjjTdQaoaiRcjEV5mOAOPuXi","pk":"wj+cyK9/P8jWceTCL3xWBh33gYmCSi4Uj+VARx7XlHUPKYrGMsN6QeRx/rRkiH+xs0HsaLwJRuOKoGhfjLExNCOiFSZoZlgNW1xs644KMFZCNL8j1rGGxTYQXKlRLM3fEkuVrI","hexseed":"4oG3LcAbeK7nl+UZyp8X94TJpBWWaIS5w+ttLws6S1WWd28aJ7ff4026OQYMtnKDaA4OwdC/8Au+1N/S2GsuGYIpGPGMIPugeruTnAuW/3Bl800mXvb0usTkrdvB2ccX7ZZyBXoAurGLPS9go6xfM4lavsv17w==","mnemonic":"z9YEawh7DanbbIf6kwVzaBXY7WragEccDjubSyuZX2CMt+z7/ISRtNSw+g8zJPItVFa13yJ+F+a7RszOVRmL4loPKN+w80QHf35EPsFJ9MCwZYysW4rufGqjQGVIXk3nPqzjGgheUZhhwga8YfJQ1uO5p4z6imN7jrbMXd5Tj5g1VaUidUFAjyiBR94sCD5yjcQIJ0FYvmppGZ97TSCpxryHlOov3ypabmq2+XbaHBSX8wnKlzaIlJiEMO9NQrfSvuh1NNE1l2A7rehl+gU7Wefx7TbdY/HA++onrKGkEJ7iCs8=","height":8,"hashFunction":1,"signatureType":0,"index":0,"encrypted":true}]')
var wallet5 = JSON.parse('[{"pk":null,"hexseed":"010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74","mnemonic":"absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool","height":12,"hashFunction":"shake128","signatureType":0,"index":0,"address":"Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08","encrypted":false}]')

describe('> version', function() {
  it('.version should report same version as in npm package.json file (=' + process.env.npm_package_version + ')', function() {
    var result = helpers.version()
    expect(result).to.equal(process.env.npm_package_version)
  })
})

describe('> QRLAddressFromEPKHex', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.QRLAddressFromEPKHex()
    }).to.throw()
  })
  it('test ePK results in result of Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd', function () {
    var result = helpers.QRLAddressFromEPKHex(
    '000400106D0856A5198967360B6BDFCA4976A433FA48DEA2A726FDAF30EA8CD3FAD2113191DA3442686282B3D5160F25CF162A517FD2131F83FBF2698A58F9C46AFC5D'
    )
    expect(result).to.equal('Q000400846365cd097082ce4404329d143959c8e4557d19b866ce8bf5ad7c9eb409d036651f62bd')
  })
  it('calling with incorrect ePK length throws an error', function () {
    expect(function() {
      helpers.QRLAddressFromEPKHex('12345678901234567890')
    }).to.throw()
  })
})

describe('> checkWeightsAndThreshold', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.checkWeightsAndThreshold()
    }).to.throw()
  })
  it('calling with single parameter throws an error', function () {
      expect(function() {
        helpers.checkWeightsAndThreshold([1, 2, 3])
      }).to.throw()
    })
  it('calling with float weights returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3.2,2,1], 4)
    expect(r.result).to.equal(false)
  })
  it('calling with an empty array returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([], 4)
    expect(r.result).to.equal(false)
  })
  it('calling with float threshold returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], 4.1)
    expect(r.result).to.equal(false)
  })
  it('calling with string threshold returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], '4')
    expect(r.result).to.equal(false)
  })
  it('calling with dangerous parameters ([4,5,6], 16) returns a false result', function () {
    var r = helpers.checkWeightsAndThreshold([4,5,6], 16)
    expect(r.result).to.equal(false)
  })
  it('calling with valid parameters ([3,2,1], 4) returns a true result', function () {
    var r = helpers.checkWeightsAndThreshold([3,2,1], 4)
    expect(r.result).to.equal(true)
  })
})

describe('> getWalletFileType', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.getWalletFileType()
    }).to.throw()
  })
  it('wallet1 JSON is from QRL Python Node', function () {
    var result = helpers.getWalletFileType(wallet1)
    expect(result).to.equal('PYTHON-NODE')
  })
  it('wallet2 JSON is from QRL Python Node', function () {
    var result = helpers.getWalletFileType(wallet2)
    expect(result).to.equal('PYTHON-NODE')
  })
  it('wallet3 JSON is from web wallet', function () {
    var result = helpers.getWalletFileType(wallet3)
    expect(result).to.equal('WEB-WALLET')
  })
  it('unknown wallet JSONSTRING returns UNKNOWN', function () {
    var result = helpers.getWalletFileType('{"hello":"random"}')
    expect(result).to.equal('UNKNOWN')
  })
  it('unknown wallet JSON returns UNKNOWN', function () {
    var result = helpers.getWalletFileType({"hello":"random"})
    expect(result).to.equal('UNKNOWN')
  })
  it('unknown wallet array JSON returns UNKNOWN', function () {
    var result = helpers.getWalletFileType([{"hello":"random"}])
    expect(result).to.equal('UNKNOWN')
  })
  it('wallet5 JSON is from converted web wallet', function () {
    var result = helpers.getWalletFileType(wallet5)
    expect(result).to.equal('CONVERTED-WEB-WALLET')
  })
})

describe('> isWalletFileDeprecated', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.isWalletFileDeprecated()
    }).to.throw()
  })
  it('wallet1 JSON is a depreciated wallet format (not encrypted)', function () {
    var result = helpers.isWalletFileDeprecated(wallet1)
    expect(result).to.equal(true)
  })
  it('wallet2 JSON is a depreciated wallet format (not encrypted)', function () {
    var result = helpers.isWalletFileDeprecated(wallet2)
    expect(result).to.equal(true)
  })
  it('wallet3 JSON is not a depreciated wallet format', function () {
    var result = helpers.isWalletFileDeprecated(wallet3)
    expect(result).to.equal(false)
  })
  it('wallet4 JSON is a depreciated wallet format (not encrypted)', function () {
    var result = helpers.isWalletFileDeprecated(wallet4)
    expect(result).to.equal(true)
  })
  it('returns false if the input is not a wallet', function () {
    var result = helpers.isWalletFileDeprecated([{}])
    expect(result).to.equal(false)
  })
})

describe('> pythonNodeToWebWallet', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.pythonNodeToWebWallet()
    }).to.throw()
  })
  it('wallet1 can be converted to web-wallet format', function () {
    var result = helpers.pythonNodeToWebWallet(wallet1)
    expect(result.length).to.equal(2)
    expect(result[0].address).to.equal('Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08')
    expect(result[1].address).to.equal('Q01060093e1ca84025a32577afc54725955203e72f918d268c95ff37c4bbd2fac9e706f1c95b6e1')
    expect(helpers.getWalletFileType(result)).to.equal('CONVERTED-WEB-WALLET')
  })
  it('wallet2 can be converted to web-wallet format', function () {
    var result = helpers.pythonNodeToWebWallet(wallet2)
    expect(result.length).to.equal(1)
    expect(result[0].address).to.equal('Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08')
    expect(helpers.getWalletFileType(result)).to.equal('CONVERTED-WEB-WALLET')
  })
})