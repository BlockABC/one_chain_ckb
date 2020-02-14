import { CustomError } from 'ts-custom-error'

export { CustomError }

export class OneChainError extends CustomError {
  protected static messages = {
    // error code less than 10 is reserved
    1: 'Unknown error',
    // errors of common
    10: 'Unknown chain ID',
    11: 'Invalid public key',
    12: 'Invalid private key or WIF',
    13: 'Invalid mnemonic',
    14: 'Invalid mnemonic, unsupported language',
    15: 'Invalid mnemonic, unsupported length',
    16: 'Invalid keypair',
    20: 'Required keys can not be empty',
    21: 'Can not find keypair from Account/address',
    22: 'Invalid BIP32 path',
    23: 'Invalid address',
    24: 'Invalid transfer value',
    25: 'Invalid transaction',
    80: 'Rule is not defined',
    96: 'Invalid number, number is not int or string of int',
    97: 'Invalid number, number must be bigger than or equal 0',
    98: 'Invalid number, number must be less than Number.MAX_SAFE_INTEGER(2^53 - 1)',
    99: 'Invalid number, string of number do not support scientific notation',
    // errors of plugin-btc
    100: 'Can not find matched API provider',
    101: 'Number is out of safe range',
    102: 'Insufficient balance, balance is less than or equal 0.',
    103: 'Param froms can not be empty',
    104: 'Param tos can not be empty',
    105: 'Param feeRate can not be empty or less than or equal to 0',
    106: 'BTC convert to SAT failed',
    107: 'Fetch HDWallet addresses error',
    108: 'OP_RETURN data(as known as memo param) size must be less than or equal to 80 bytes',
    109: 'Insufficient balance, balance is not enough for fee',
    110: 'Invalid WIF, network version mismatch',
    111: 'Some addresses of froms are not included by keypairs.',
    112: 'OP_RETURN data(as known as memo param) should not be empty string(something like [\'xxx\', \'\'])',
    113: 'Param memos should be an array',
    114: 'Param froms should be an array',
    115: 'Param tos should be an array',
    116: 'Insufficient balance, balance is not enough for outputs',
    117: 'Signing failed, can not find keypair for some unspents',
    118: 'All outputs\' value must be bigger than 546 satoshi',
    119: 'Set keypairs failed, invalid keypairs',
    120: 'Signing failed, invalid transaction hex data',
    121: 'Signing failed, invalid unspents',
    122: 'Init HDWallet failed, invalid bip32 path',
    123: 'Invalid WIF, checksum mismuch',
    124: 'Invalid WIF, buffer length must be 33 (uncompressed) or 34 (compressed)',
  }

  public name = 'OneChainError'
  public code: number

  constructor (code: number, message: string) {
    super(message)
    this.code = code
  }

  public static fromCode (code: number, message = null): OneChainError {
    return new OneChainError(code, message ?? OneChainError.messages[code])
  }
}

export class ParamError extends CustomError {
  protected static messages = {
    100: 'Invalid rpc node config, chain ID must be a string.',
    101: 'Invalid rpc node config, chain type must be a string.',
    102: 'Invalid rpc node config, base url must be a string.',
    200: 'Invalid keypair, address/publicKey is illegal.',
    201: 'Invalid keypair, wif/privateKey is illegal.',
    202: 'Invalid address',
    300: 'Invalid value, value in number type can not be nagetive or bigger than Number.MAX_SAFE_INTEGER',
    301: 'Invalid value, value in string type can not be nagetive',
  }

  public name = 'ParamError'
  public code: number

  constructor (code: number, message) {
    super(message)
    this.code = code
  }

  public static fromCode (code: number, paramName: string): ParamError {
    return new ParamError(code, paramName + ' ' + ParamError.messages[code])
  }
}

export class RPCError extends CustomError {
  public name = 'RPCError'
  public code: number
  public data: any

  constructor (code: number, message: string, data: any = null) {
    super(message)
    this.code = code
    this.data = data
  }
}

export class NetworkError extends CustomError {
  protected static messages = {
    1: 'unknown error - ',
    2: 'client error - ',
    3: 'server error - ',
  }

  public name = 'NetworkError'
  public code: number
  public data: any

  constructor (code: number, message: string, data: any = null) {
    super(message)
    this.code = code
    this.data = data
  }

  public static fromCode (code: number, message: string, data: any = null): NetworkError {
    let codeGroup = 1
    if (code >= 400 && code < 500) {
      codeGroup = 2
    }
    else if (code >= 500 && code < 600) {
      codeGroup = 3
    }

    return new NetworkError(codeGroup, NetworkError.messages[codeGroup] + message, data)
  }
}
