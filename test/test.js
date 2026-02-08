var expect = require('chai').expect
var assert = require('chai').assert
var helpers = require('../src/index')
var v3 = require('../src/v3wallet')
var Module = require('module')
var wallet1 = JSON.parse('{"addresses": [{"pk": null, "hexseed": "010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74", "mnemonic": "absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08"}, {"pk": null, "hexseed": "010600dc306de0e5e64fd952cf90c84059718ab980549e1df8ef55d98a9c7389f6b7625810acde0241d980e138d950f8832367", "mnemonic": "absorb grape sweat along tenant glow figure newly song assign dream not merit nurse fold test whiff wage style pray java partly rich catch ball sober acute brim locate beard stuffy axle lowest daisy", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q01060093e1ca84025a32577afc54725955203e72f918d268c95ff37c4bbd2fac9e706f1c95b6e1"}], "encrypted": false, "version": 1}')
var wallet2 = JSON.parse('{"addresses": [{"pk": null, "hexseed": "010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74", "mnemonic": "absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool", "height": 12, "hashFunction": "shake128", "signatureType": 0, "index": 0, "address": "Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08"}], "encrypted": false, "version": 1}')
var wallet3 = JSON.parse('[{"address":"VTKTxhRCBjdvZHf3Mt9Cjap/GhmzNth4FltJQo/k7/TBEwaqnQv0qQyIx2MOPDsEzXPMxBdvGf/Z4RTS3WLcBmK2YmS9ajhmhwIjzpnoOiXpagDl+pepQ42ownm6UF4=","addressB32":"k1eBOQAnMwqnG0ewqsNlsTIdLf9XgjSKR5D3z0wprjjTdQaoaiRcjEV5mOAOPuXiQNhk01mCH1pnNppCxXR4UL5cKPIWZf3VdFqaf56rRIa4=","pk":"wj+cyK9/P8jWceTCL3xWBh33gYmCSi4Uj+VARx7XlHUPKYrGMsN6QeRx/rRkiH+xs0HsaLwJRuOKoGhfjLExNCOiFSZoZlgNW1xs644KMFZCNL8j1rGGxTYQXKlRLM3fEkuVrIqib9U5fQmJ1nyVvP0zPgaFbUQN4WkxIos6Zt2Udx0ez5BM+XAs8vG5G4+/vfBIis7b","hexseed":"4oG3LcAbeK7nl+UZyp8X94TJpBWWaIS5w+ttLws6S1WWd28aJ7ff4026OQYMtnKDaA4OwdC/8Au+1N/S2GsuGYIpGPGMIPugeruTnAuW/3Bl800mXvb0usTkrdvB2ccX7ZZyBXoAurGLPS9go6xfM4lavsv17w==","mnemonic":"z9YEawh7DanbbIf6kwVzaBXY7WragEccDjubSyuZX2CMt+z7/ISRtNSw+g8zJPItVFa13yJ+F+a7RszOVRmL4loPKN+w80QHf35EPsFJ9MCwZYysW4rufGqjQGVIXk3nPqzjGgheUZhhwga8YfJQ1uO5p4z6imN7jrbMXd5Tj5g1VaUidUFAjyiBR94sCD5yjcQIJ0FYvmppGZ97TSCpxryHlOov3ypabmq2+XbaHBSX8wnKlzaIlJiEMO9NQrfSvuh1NNE1l2A7rehl+gU7Wefx7TbdY/HA++onrKGkEJ7iCs8=","height":8,"hashFunction":1,"signatureType":0,"index":0,"encrypted":true}]')
var wallet4 = JSON.parse('[{"address":"VTKTxhRCBjdvZHf3Mt9Cjap/GhmzNth4FltJQo/k7/TBEwaqnQv0qQyIx2MOPDsEzXPMxBdvGf/Z4RTS3WLcBmK2YmS9ajhmhwIjzpnoOiXpagDl+pepQ42ownm6UF4=","addressB32":"k1eBOQAnMwqnG0ewqsNlsTIdLf9XgjSKR5D3z0wprjjTdQaoaiRcjEV5mOAOPuXi","pk":"wj+cyK9/P8jWceTCL3xWBh33gYmCSi4Uj+VARx7XlHUPKYrGMsN6QeRx/rRkiH+xs0HsaLwJRuOKoGhfjLExNCOiFSZoZlgNW1xs644KMFZCNL8j1rGGxTYQXKlRLM3fEkuVrI","hexseed":"4oG3LcAbeK7nl+UZyp8X94TJpBWWaIS5w+ttLws6S1WWd28aJ7ff4026OQYMtnKDaA4OwdC/8Au+1N/S2GsuGYIpGPGMIPugeruTnAuW/3Bl800mXvb0usTkrdvB2ccX7ZZyBXoAurGLPS9go6xfM4lavsv17w==","mnemonic":"z9YEawh7DanbbIf6kwVzaBXY7WragEccDjubSyuZX2CMt+z7/ISRtNSw+g8zJPItVFa13yJ+F+a7RszOVRmL4loPKN+w80QHf35EPsFJ9MCwZYysW4rufGqjQGVIXk3nPqzjGgheUZhhwga8YfJQ1uO5p4z6imN7jrbMXd5Tj5g1VaUidUFAjyiBR94sCD5yjcQIJ0FYvmppGZ97TSCpxryHlOov3ypabmq2+XbaHBSX8wnKlzaIlJiEMO9NQrfSvuh1NNE1l2A7rehl+gU7Wefx7TbdY/HA++onrKGkEJ7iCs8=","height":8,"hashFunction":1,"signatureType":0,"index":0,"encrypted":true}]')
var wallet5 = JSON.parse('[{"pk":null,"hexseed":"010600dc926efe441f16ddb09bf1fcc603a4cb64a2b57b1a6a7cffce8f1f654ae2fe592f80a6dfa05e32d28071fec4cad41d74","mnemonic":"absorb grape swift champ yarn dull bill sunny oslo bumpy shine denial slid excise rescue react his soothe soften verb harp queen yeah nadir loan ideal patron thing splash alpine yogurt famous stage stool","height":12,"hashFunction":"shake128","signatureType":0,"index":0,"address":"Q010600beb663d164df6a4d984155df86ba2a938d5a57a364033a39e34ae47ec642d8f3ee900e08","encrypted":false}]')


var example = '[{"address":"Q010400b2784ee8eda70c6b5011eb359f0cf58f7fc3b70590fb8145abb3aa5e8603be97c64f8374","pk":"010400de1f8b3257404ac8d8f592c7222d4de85dbaad0dd8e426ef3495889058ce0e0d162ecacca30736e4c574b8c3b9342137a7a439f11f526c7cf402a018894019b7","hexseed":"010400ab277d64891062362bd6d0598086552027cf08c2d835e896b4b4f3ce1169fbd4a5e2df43ad1acd4a325602b8f3124e21","mnemonic":"absorb drank prone knack hand movie group guess stint alice load harry bureau lens animal coca cyclic median remove fiance sock bid wolf exempt they vision purely pupil excite casual adjust mood basic thank","height":8,"encrypted":false, "version":3}]'
var password = 'My Secret Password'
var fastKdf = { kdf: { params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } } }
var argon2Available = false
try {
  require('argon2')
  argon2Available = true
} catch (err) {
  argon2Available = false
}

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

describe('> convertWalletToV3', function() {
  it('calling with no parameter throws an error', function () {
    expect(function() {
      helpers.convertWalletToV3()
    }).to.throw()
  })
  it('rejects encrypted conversion without password', function () {
    expect(function() {
      helpers.convertWalletToV3(wallet1, true)
    }).to.throw(/Missing password/)
  })
  it('converts python node wallets to v3 envelopes', function () {
    const envelope = helpers.convertWalletToV3(wallet1, true, password, fastKdf)
    const decrypted = helpers.v3WalletDecrypt(envelope, password)
    expect(envelope.encrypted).to.equal(true)
    expect(decrypted[0].address).to.equal(wallet1.addresses[0].address)
  })
  it('accepts JSON string input', function () {
    const envelope = helpers.convertWalletToV3(JSON.stringify(wallet5), true, password, fastKdf)
    const decrypted = helpers.v3WalletDecrypt(envelope, password)
    expect(decrypted[0].address).to.equal(wallet5[0].address)
  })
  it('converts converted web wallets to v3 envelopes', function () {
    const envelope = helpers.convertWalletToV3(wallet5, true, password, fastKdf)
    const decrypted = helpers.v3WalletDecrypt(envelope, password)
    expect(decrypted[0].address).to.equal(wallet5[0].address)
  })
  it('converts legacy v3 arrays to v3 envelopes', function () {
    const legacy = [{
      mnemonic: helpers.walletDataEncrypt('legacy mnemonic', password),
      hexseed: helpers.walletDataEncrypt('legacy hexseed', password),
      address: helpers.walletDataEncrypt('legacy address', password),
      pk: helpers.walletDataEncrypt('legacy pk', password),
      version: 3,
      encrypted: true,
    }]
    const envelope = helpers.convertWalletToV3(legacy, true, password, fastKdf)
    const decrypted = helpers.v3WalletDecrypt(envelope, password)
    expect(decrypted[0].mnemonic).to.equal('legacy mnemonic')
  })
  it('returns v3 envelopes unchanged', function () {
    const envelope = helpers.v3Wallet(example, true, password, fastKdf)
    const output = helpers.convertWalletToV3(envelope, true, password)
    expect(output).to.deep.equal(envelope)
  })
  it('rejects unsupported wallet formats', function () {
    expect(function() {
      helpers.convertWalletToV3({ hello: 'world' }, true, password)
    }).to.throw(/Unsupported wallet format/)
  })
})

describe('> v3Wallet', function() {
  it('calling with no json data throws an error', function() {
    expect(function() {
      const x = helpers.v3Wallet()
      console.log(x)
    }).to.throw()
  })
  it("calling with no password throws an error if encrypted wallet chosen", function () {
    expect(function () {
      const x = helpers.v3Wallet({dummy: "data"}, true)
      console.log(x)
    }).to.throw()
  })
  it("calling without specifying wallet encryption flag throws an error", function () {
    expect(function () {
      const x = helpers.v3Wallet({ dummy: "data" })
      console.log(x)
    }).to.throw()
  })
  it('Converting example wallet to new encrypted format results in decryptable data', function() {
    const output = helpers.v3Wallet(example, true, password, fastKdf)
    const decrypted = helpers.v3WalletDecrypt(output, password)
    expect(output.encrypted).to.equal(true)
    expect(output.kdf.name).to.equal('scrypt')
    expect(output.cipher.name).to.equal('aes-256-gcm')
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
    expect(decrypted[0].pk).to.equal(JSON.parse(example)[0].pk)
    expect(decrypted[0].address).to.equal(JSON.parse(example)[0].address)
    expect(decrypted[0].hexseed).to.equal(JSON.parse(example)[0].hexseed)
  })
  it('Encrypts with default options when options are omitted', function() {
    const output = helpers.v3Wallet(example, true, password)
    const decrypted = helpers.v3WalletDecrypt(output, password)
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('Converting example wallet to new unencrypted format results in correct data', function () {
    const output = helpers.v3Wallet(example, false, password)
    const decrypted = helpers.v3WalletDecrypt(output, password)
    expect(output.encrypted).to.equal(false)
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
    expect(decrypted[0].pk).to.equal(JSON.parse(example)[0].pk)
    expect(decrypted[0].address).to.equal(JSON.parse(example)[0].address)
    expect(decrypted[0].hexseed).to.equal(JSON.parse(example)[0].hexseed)
  })
  it('Decrypts unencrypted envelope without password', function () {
    const output = helpers.v3Wallet(example, false, password)
    const decrypted = helpers.v3WalletDecrypt(output)
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('Accepts JSON string envelopes', function () {
    const output = helpers.v3Wallet(example, false, password)
    const decrypted = helpers.v3WalletDecrypt(JSON.stringify(output))
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('Stores custom scrypt parameters when provided', function () {
    const options = {
      kdf: {
        params: {
          N: 1 << 10,
          r: 4,
          p: 1,
          dkLen: 32,
          saltLen: 16,
        },
      },
    }
    const output = helpers.v3Wallet(example, true, password, options)
    expect(output.kdf.name).to.equal('scrypt')
    expect(output.kdf.params.N).to.equal(1 << 10)
    expect(output.kdf.params.r).to.equal(4)
    expect(output.kdf.params.p).to.equal(1)
    expect(output.kdf.params.dkLen).to.equal(32)
    expect(output.kdf.params.salt).to.be.a('string')
  })
  it('Throws when decrypting encrypted wallet without password', function () {
    const output = helpers.v3Wallet(example, true, password, {
      kdf: { params: { N: 1 << 10, r: 8, p: 1, dkLen: 32, saltLen: 16 } },
    })
    expect(function () {
      helpers.v3WalletDecrypt(output)
    }).to.throw()
  })
  it('Rejects tampered auth tag', function () {
    const output = helpers.v3Wallet(example, true, password, {
      kdf: { params: { N: 1 << 10, r: 8, p: 1, dkLen: 32, saltLen: 16 } },
    })
    const tampered = JSON.parse(JSON.stringify(output))
    const firstChar = tampered.cipher.authTag[0]
    const replacement = firstChar === '0' ? '1' : '0'
    tampered.cipher.authTag = replacement + tampered.cipher.authTag.slice(1)
    expect(function () {
      helpers.v3WalletDecrypt(tampered, password)
    }).to.throw()
  })
  it('Rejects argon2id wallets in sync mode', function () {
    const output = helpers.v3Wallet(example, true, password, {
      kdf: { params: { N: 1 << 10, r: 8, p: 1, dkLen: 32, saltLen: 16 } },
    })
    const argon2Envelope = JSON.parse(JSON.stringify(output))
    argon2Envelope.kdf.name = 'argon2id'
    expect(function () {
      helpers.v3WalletDecrypt(argon2Envelope, password)
    }).to.throw(/argon2id requires async API/)
  })
  it('Rejects envelopes missing scrypt salt', function () {
    const output = helpers.v3Wallet(example, true, password, {
      kdf: { params: { N: 1 << 10, r: 8, p: 1, dkLen: 32, saltLen: 16 } },
    })
    const noSalt = JSON.parse(JSON.stringify(output))
    delete noSalt.kdf.params.salt
    expect(function () {
      helpers.v3WalletDecrypt(noSalt, password)
    }).to.throw(/Missing scrypt salt/)
  })
  it('Rejects envelopes missing scrypt params', function () {
    const output = helpers.v3Wallet(example, true, password, fastKdf)
    const noParams = JSON.parse(JSON.stringify(output))
    delete noParams.kdf.params
    expect(function () {
      helpers.v3WalletDecrypt(noParams, password)
    }).to.throw(/Missing scrypt salt/)
  })
  it('Rejects invalid envelope input', function () {
    expect(function () {
      helpers.v3WalletDecrypt({ encrypted: true }, password)
    }).to.throw()
  })
  it('Rejects missing input', function () {
    expect(function () {
      helpers.v3WalletDecrypt()
    }).to.throw()
  })
  it('Decrypts legacy v3 array payloads', function () {
    const legacy = [{
      mnemonic: helpers.walletDataEncrypt('legacy mnemonic', password),
      hexseed: helpers.walletDataEncrypt('legacy hexseed', password),
      address: helpers.walletDataEncrypt('legacy address', password),
      pk: helpers.walletDataEncrypt('legacy pk', password),
      version: 3,
      encrypted: true,
    }]
    const decrypted = helpers.v3WalletDecrypt(legacy, password)
    expect(decrypted[0].mnemonic).to.equal('legacy mnemonic')
    expect(decrypted[0].hexseed).to.equal('legacy hexseed')
    expect(decrypted[0].address).to.equal('legacy address')
    expect(decrypted[0].pk).to.equal('legacy pk')
  })
  it('Returns unencrypted legacy v3 entries as-is', function () {
    const legacy = [{
      mnemonic: 'plain mnemonic',
      hexseed: 'plain hexseed',
      address: 'plain address',
      pk: 'plain pk',
      version: 3,
      encrypted: false,
    }]
    const decrypted = helpers.v3WalletDecrypt(legacy, password)
    expect(decrypted[0].mnemonic).to.equal('plain mnemonic')
  })
  it('Legacy walletDataDecrypt rejects invalid payloads', function () {
    expect(function () {
      helpers.walletDataDecrypt('invalid', password)
    }).to.throw()
  })
})

describe('> v3Wallet async', function() {
  it('v3WalletAsync with scrypt decrypts', async function () {
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: { name: 'scrypt', params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } },
    })
    const decrypted = await helpers.v3WalletDecryptAsync(output, password)
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('convertWalletToV3Async rejects missing parameters', async function () {
    try {
      await helpers.convertWalletToV3Async()
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing parameter/)
    }
  })
  it('convertWalletToV3Async rejects encrypted conversion without password', async function () {
    try {
      await helpers.convertWalletToV3Async(wallet1, true)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing password/)
    }
  })
  it('convertWalletToV3Async handles python node wallets', async function () {
    const envelope = await helpers.convertWalletToV3Async(wallet1, true, password, fastKdf)
    const decrypted = await helpers.v3WalletDecryptAsync(envelope, password)
    expect(decrypted[0].address).to.equal(wallet1.addresses[0].address)
  })
  it('convertWalletToV3Async handles converted web wallets', async function () {
    const envelope = await helpers.convertWalletToV3Async(wallet5, false)
    const decrypted = await helpers.v3WalletDecryptAsync(envelope)
    expect(decrypted[0].address).to.equal(wallet5[0].address)
  })
  it('convertWalletToV3Async handles legacy v3 arrays', async function () {
    const legacy = [{
      mnemonic: helpers.walletDataEncrypt('legacy mnemonic', password),
      hexseed: helpers.walletDataEncrypt('legacy hexseed', password),
      address: helpers.walletDataEncrypt('legacy address', password),
      pk: helpers.walletDataEncrypt('legacy pk', password),
      version: 3,
      encrypted: true,
    }]
    const envelope = await helpers.convertWalletToV3Async(legacy, true, password, fastKdf)
    const decrypted = await helpers.v3WalletDecryptAsync(envelope, password)
    expect(decrypted[0].mnemonic).to.equal('legacy mnemonic')
  })
  it('convertWalletToV3Async returns v3 envelopes unchanged', async function () {
    const envelope = await helpers.v3WalletAsync(example, true, password, fastKdf)
    const output = await helpers.convertWalletToV3Async(envelope, true, password)
    expect(output).to.deep.equal(envelope)
  })
  it('convertWalletToV3Async rejects unsupported wallet formats', async function () {
    try {
      await helpers.convertWalletToV3Async({ hello: 'world' }, true, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Unsupported wallet format/)
    }
  })
  it('v3WalletAsync uses defaults when options are missing', async function () {
    const crypto = require('crypto')
    const originalScryptSync = crypto.scryptSync
    crypto.scryptSync = (walletPassword, salt, keylen) => {
      const hash = crypto
        .createHash('sha256')
        .update(walletPassword)
        .update(salt)
        .digest()
      if (keylen <= hash.length) {
        return hash.subarray(0, keylen)
      }
      const out = Buffer.alloc(keylen)
      for (let offset = 0; offset < keylen; offset += hash.length) {
        hash.copy(out, offset)
      }
      return out
    }
    try {
      const output = await helpers.v3WalletAsync(example, true, password)
      const decrypted = await helpers.v3WalletDecryptAsync(output, password)
      expect(output.kdf.name).to.equal('scrypt')
      expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
    } finally {
      crypto.scryptSync = originalScryptSync
    }
  })
  it('v3WalletAsync throws on missing parameters', async function () {
    try {
      await helpers.v3WalletAsync()
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing parameter/)
    }
  })
  it('v3WalletAsync throws on missing password for encrypted wallets', async function () {
    try {
      await helpers.v3WalletAsync(example, true)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing password/)
    }
  })
  it('v3WalletAsync returns unencrypted envelopes', async function () {
    const output = await helpers.v3WalletAsync(example, false, password)
    const decrypted = await helpers.v3WalletDecryptAsync(output)
    expect(output.encrypted).to.equal(false)
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('v3WalletDecryptAsync accepts JSON string envelopes', async function () {
    const output = await helpers.v3WalletAsync(example, false, password)
    const decrypted = await helpers.v3WalletDecryptAsync(JSON.stringify(output))
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('v3WalletAsync rejects unsupported KDF', async function () {
    try {
      await helpers.v3WalletAsync(example, true, password, { kdf: { name: 'nope' } })
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Unsupported KDF/)
    }
  })
  it('v3WalletDecryptAsync rejects unsupported KDFs', async function () {
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: { name: 'scrypt', params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } },
    })
    const tampered = JSON.parse(JSON.stringify(output))
    tampered.kdf.name = 'nope'
    try {
      await helpers.v3WalletDecryptAsync(tampered, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Unsupported KDF/)
    }
  })
  it('v3WalletDecryptAsync rejects missing scrypt salt', async function () {
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: { name: 'scrypt', params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } },
    })
    delete output.kdf.params.salt
    try {
      await helpers.v3WalletDecryptAsync(output, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing scrypt salt/)
    }
  })
  it('v3WalletDecryptAsync rejects missing scrypt params', async function () {
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: { name: 'scrypt', params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } },
    })
    delete output.kdf.params
    try {
      await helpers.v3WalletDecryptAsync(output, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing scrypt salt/)
    }
  })
  it('v3WalletDecryptAsync rejects missing argon2 salt', async function () {
    if (!argon2Available) {
      this.skip()
    }
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: {
        name: 'argon2id',
        params: { memoryCost: 32768, timeCost: 2, parallelism: 1, hashLength: 32, saltLen: 16 },
      },
    })
    delete output.kdf.params.salt
    try {
      await helpers.v3WalletDecryptAsync(output, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing argon2 salt/)
    }
  })
  it('v3WalletDecryptAsync rejects missing argon2 params', async function () {
    if (!argon2Available) {
      this.skip()
    }
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: {
        name: 'argon2id',
        params: { memoryCost: 32768, timeCost: 2, parallelism: 1, hashLength: 32, saltLen: 16 },
      },
    })
    delete output.kdf.params
    try {
      await helpers.v3WalletDecryptAsync(output, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing argon2 salt/)
    }
  })
  it('v3WalletDecryptAsync rejects encrypted wallet without password', async function () {
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: { name: 'scrypt', params: { N: 1 << 10, r: 4, p: 1, dkLen: 32, saltLen: 16 } },
    })
    try {
      await helpers.v3WalletDecryptAsync(output)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing password/)
    }
  })
  it('v3WalletDecryptAsync rejects missing input', async function () {
    try {
      await helpers.v3WalletDecryptAsync()
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Missing parameter/)
    }
  })
  it('v3WalletDecryptAsync rejects invalid envelope input', async function () {
    try {
      await helpers.v3WalletDecryptAsync({ encrypted: true }, password)
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/Invalid wallet envelope/)
    }
  })
  it('v3WalletDecryptAsync handles legacy v3 arrays', async function () {
    const legacy = [{
      mnemonic: 'plain mnemonic',
      hexseed: 'plain hexseed',
      address: 'plain address',
      pk: 'plain pk',
      version: 3,
      encrypted: false,
    }]
    const decrypted = await helpers.v3WalletDecryptAsync(legacy)
    expect(decrypted[0].mnemonic).to.equal('plain mnemonic')
  })
  it('v3WalletAsync supports argon2id when available', async function () {
    if (!argon2Available) {
      try {
        await helpers.v3WalletAsync(example, true, password, { kdf: { name: 'argon2id' } })
        throw new Error('Expected rejection')
      } catch (err) {
        expect(err.message).to.match(/argon2 dependency not installed/)
      }
      return
    }
    const output = await helpers.v3WalletAsync(example, true, password, {
      kdf: {
        name: 'argon2id',
        params: { memoryCost: 32768, timeCost: 2, parallelism: 1, hashLength: 32, saltLen: 16 },
      },
    })
    const decrypted = await helpers.v3WalletDecryptAsync(output, password)
    expect(output.kdf.name).to.equal('argon2id')
    expect(decrypted[0].mnemonic).to.equal(JSON.parse(example)[0].mnemonic)
  })
  it('v3WalletAsync reports missing argon2 dependency', async function () {
    const originalLoad = Module._load
    Module._load = function (request) {
      if (request === 'argon2') {
        throw new Error('argon2 not available')
      }
      return originalLoad.apply(this, arguments)
    }
    try {
      await helpers.v3WalletAsync(example, true, password, { kdf: { name: 'argon2id' } })
      throw new Error('Expected rejection')
    } catch (err) {
      expect(err.message).to.match(/argon2 dependency not installed/)
    } finally {
      Module._load = originalLoad
    }
  })
})

describe('> v3wallet module', function() {
  it('throws on missing parameters', function () {
    expect(function () {
      v3.v3Wallet()
    }).to.throw(/Missing parameter/)
  })
  it('throws on missing password for encrypted wallets', function () {
    expect(function () {
      v3.v3Wallet({ foo: 'bar' }, true)
    }).to.throw(/Missing password/)
  })
  it('rejects argon2id in sync mode', function () {
    expect(function () {
      v3.v3Wallet(example, true, password, { kdf: { name: 'argon2id' } })
    }).to.throw(/argon2id requires async API/)
  })
  it('normalizes non-string json input', function () {
    const output = v3.v3Wallet(JSON.parse(example), false)
    expect(output.encrypted).to.equal(false)
  })
  it('v3WalletDecrypt throws on missing input', function () {
    expect(function () {
      v3.v3WalletDecrypt()
    }).to.throw(/Missing parameter/)
  })
})
