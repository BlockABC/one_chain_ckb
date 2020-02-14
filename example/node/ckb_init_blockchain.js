const cmd = require('commander')
const path = require('path')
const { DIST } = require('./init')

const supportedChainType = ['CKB']

cmd
  .option('-c, --chain-type <chainType>', 'Chain type of utxo chains, available values are: ' + supportedChainType.join(','), 'CKB')
  .option('-r, --route <route>', 'Route to different examples')
  .parse(process.argv)

if (!supportedChainType.includes(cmd.chainType)) {
  throw new Error('Unsupported chain type: ' + cmd.chainType)
}

const chainType = cmd.chainType
const route = cmd.route
const chainTypeInLowerCase = chainType.toLowerCase()

const KEYPAIR_1 = JSON.parse(process.env[`${chainType}_KEYPAIR_1`])
const KEYPAIR_2 = JSON.parse(process.env[`${chainType}_KEYPAIR_2`])
const keypairs = [
  {
    privateKey: KEYPAIR_1.privateKey,
    address: KEYPAIR_1.address,
  },
  {
    privateKey: KEYPAIR_2.privateKey,
    address: KEYPAIR_2.address,
  },
]

const onechain = require(path.join(DIST, '/ckb.cjs'))

const logger = new onechain.core.ConsoleLogger({ name: chainType, level: onechain.core.ConsoleLogger.Level.Trace })

const rpcnodeConfig = {
  chainId: process.env[`${chainType}_CHAIN_ID`],
  chainType: onechain.core.ChainType[chainType],
  baseUrl: process.env[`${chainType}_RPC_URL`],
}

const rpcnode = new onechain.core.RPCNode(rpcnodeConfig)
const provider = new onechain[chainTypeInLowerCase][chainType]({ rpcnode, keypairs, logger })

module.exports = {
  route,
  chainType,
  keypairs,
  rpcnode,
  provider,
  helper: onechain[chainTypeInLowerCase].helper
}
