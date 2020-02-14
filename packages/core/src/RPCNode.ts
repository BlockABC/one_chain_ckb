import { IRPCNode } from './interface'
import { ChainType, NetworkProtocol } from './const'

export class RPCNode {
  chainId: string
  chainType: ChainType
  baseUrl?: string
  protocol?: NetworkProtocol
  host?: string
  port?: number

  constructor (rpcnode: IRPCNode) {
    this.chainId = rpcnode.chainId
    this.chainType = rpcnode.chainType
    if (rpcnode.baseUrl) {
      this.baseUrl = rpcnode.baseUrl
    }
    else {
      this.protocol = rpcnode.protocol
      this.host = rpcnode.host
      this.port = rpcnode.port
    }
  }

  toString (): string {
    if (this.baseUrl) {
      return this.baseUrl
    }
    else {
      return `${this.protocol}://${this.host}:${this.port}`
    }
  }
}

export default RPCNode
