import { ILogger, IKeypair, IUTXOProvider, IUTXOTransaction, IUTXOFromToParam, binStr } from './interface'
import { RPCNode } from './RPCNode'

export abstract class UTXOProvider implements IUTXOProvider {
  readonly logger: ILogger
  readonly helper: any
  readonly name: string;

  protected _rpcnode: RPCNode
  protected _keypairs: IKeypair[]

  get rpcnode (): RPCNode {
    return this._rpcnode
  }

  get keypairs (): IKeypair[] {
    return this._keypairs
  }

  init (
    { rpcnode, keypairs, logger = null }:
    { rpcnode: RPCNode, keypairs: IKeypair[], logger?: ILogger }
  ): this {
    this._rpcnode = rpcnode
    this._keypairs = keypairs

    if (!this.helper.isNil(logger)) {
      // @ts-ignore
      this.logger.setLogger({ logger })
    }

    return this
  }

  abstract setRPCNode({ rpcnode }: { rpcnode: RPCNode }): void

  abstract setKeypairs({ keypairs }: { keypairs: IKeypair[] }): void

  abstract buildTransaction (
    { froms, tos, memos, changeAddress }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], memos?: binStr[], changeAddress?: string }
  ): Promise<IUTXOTransaction>

  abstract buildAutoFixTransaction (
    { froms, tos, memos, changeAddress }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], memos?: binStr[], changeAddress?: string }
  ): Promise<IUTXOTransaction>

  abstract pushTransaction ({ transaction }: { transaction: IUTXOTransaction | any }): Promise<string>
}
