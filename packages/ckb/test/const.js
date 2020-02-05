const RPCNODE = {
  chainId: 'mainnet',
  chainType: 'ckb',
  baseUrl: 'https://ckb.abcwallet.com/api',
}
const FROM = {
  address: 'ckb1qyq85n3qsrrvf8dpt6tfsnnkm4s5mmdfse9szh08z4',
  privateKey: '0x8a3349e3b4a00efb14ec2799613e20f383b76b696fc342593b94b3b3f0e14d6d',
  lock: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0x10af0070ff9669686620f82a2e34a2cb60bb55dd'
  },
  lockHash: '0x64cfd79c5ea8115a0910a47aa479f960f097437e47a9216e30d66bcab76cd7fc',
}
const FROM_1 = {
  address: 'ckb1qyq083k0js3v5p6j5f8urfzcfpjwvq7mzxxq5ldx2k',
  privateKey: '0x8a3349e3b4a00efb14ec2799613e20f383b76b696fc342593b94b3b3f0e14d6d',
  lock: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0xf3c6cf9422ca0752a24fc1a4584864e603db118c'
  },
  lockHash: '0x909f919ecb9cc20d38dd532feac929e108604b970dc37be1fdf95800feeb1e0f',
}
const TO = {
  address: 'ckb1qyqvxlzmadlh0vvczqyye636723z6ngxwzqsyp2hup',
  privateKey: '0x05d0fc89748b839c48635572371eff2d707d0424424021cb73e1bceb2f6e93fa',
}
const TO_1 = {
  address: 'ckb1qyqgsnlqd7uujneq565mm94ypfrxqc9wdefs8djr7r',
  privateKey: '0x05d0fc89748b839c48635572371eff2d707d0424424021cb73e1bceb2f6e93fa',
}
const MNEMONIC = {
  word: 'desert history window space another since plastic soccer cloud myself private core',
  path: `m/44'/309'/0'`,
}

module.exports = {
  RPCNODE,
  FROM,
  FROM_1,
  TO,
  TO_1,
  MNEMONIC,
}
