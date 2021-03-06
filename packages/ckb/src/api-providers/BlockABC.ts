import trimEnd from 'lodash/trimEnd'
import fetch from 'node-fetch'
import Decimal from 'decimal.js'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'

import {
  IUTXOUnspent, IUTXOApiProvider,
  NetworkError, RPCError,
  RPCNode, helper,
} from '@onechain/core'

import { logger } from '../log'

export class BlockABC implements IUTXOApiProvider {
  readonly logger = logger
  readonly supportBatch = true
  readonly rateLimit = 3

  protected endpoint: string

  constructor (rpcnode: RPCNode) {
    this.endpoint = trimEnd(rpcnode.baseUrl, '/')
  }

  async ping () {
    const startAt = Date.now()
    await this.get('/recommended_fee_rates')
    return Date.now() - startAt
  }

  async getTx (txId: string): Promise<any> {
    return this.get(`/transaction/${txId}`)
  }

  async getAddresses (addresses: string[]): Promise<{ address: string; txCount: number }[]> {
    const results = await this.post('/address', addresses)

    return results.map(val => {
      return {
        address: val.address,
        txCount: val.used ? 1 : 0,
      }
    })
  }

  async getUnspentOfAddresses (addresses: string[], onlyConfirmed = false): Promise<IUTXOUnspent[]> {
    const results = await this.post('/address/unspents', addresses)

    return results.map(val => {
      const lock = {
        codeHash: val.lock_script.code_hash,
        hashType: val.lock_script.hash_type,
        args: val.lock_script.args,
      }

      return {
        txId: val.txid,
        address: val.address,
        vout: val.vout_index,
        value: new Decimal(val.value),
        lock,
        lockHash: scriptToHash(lock),
      }
    })
  }

  async pushTransaction (rawTransaction: any): Promise<string> {
    const ret = await this.post('/send_raw_transaction', {
      id: 1,
      jsonrpc: '2.0',
      method: 'send_transaction',
      params: [rawTransaction]
    })
    return ret.txid
  }

  protected buildUrl (path: string, query: any = null) {
    let url = this.endpoint + path

    if (query) {
      url += '?' + new URLSearchParams(query)
    }

    return url
  }

  protected async get (path, query: any = null): Promise<any> {
    let ret
    try {
      const url = this.buildUrl(path, query)
      this.logger.trace('BlockABC.get Request data: ', url)

      const startAt = Date.now()
      const res = await helper.timeout<Response>(5000, fetch(url, {
        method: 'GET',
        // @ts-ignore
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      }))
      this.logger.trace('BlockABC.get Request benchmark(in ms):', Date.now() - startAt)

      if (res.ok) {
        ret = await res.text()
        if (ret) {
          ret = JSON.parse(ret)
          if (ret.errno !== 0) {
            if (ret.errno === 500) {
              let errno, errmsg, data
              try {
                errno = ret.data.error.code
                errmsg = ret.data.error.message
                data = ret.data.error
              }
              catch (err) {
                this.logger.error('BlockABC.get Response error:', path, 500, ret.errmsg, ret)
                throw NetworkError.fromCode(500, ret.errmsg)
              }

              this.logger.error('BlockABC.get Response error:', path, errno, errmsg, data)
              throw new RPCError(errno, errmsg, data)
            }
            else {
              this.logger.error('BlockABC.get Response error:', path, 400, ret.errmsg)
              throw NetworkError.fromCode(400, ret.errmsg)
            }
          }
        }
        !process.env.PROD && this.logger.trace('BlockABC.get Response data:', path, ret)
      }
      else {
        this.logger.error('BlockABC.get Network error:', `${res.status} ${res.statusText}`)
        throw NetworkError.fromCode(res.status, `${res.status} ${res.statusText}`)
      }
    }
    catch (err) {
      if (err instanceof NetworkError || err instanceof RPCError) {
        throw err
      }
      else {
        this.logger.error('BlockABC.get Unknown error:', path, err.message)
        throw NetworkError.fromCode(1, err.message)
      }
    }

    return ret.data
  }

  protected async post (path, data, query: any = null): Promise<any> {
    let ret
    try {
      const url = this.buildUrl(path, query)
      this.logger.trace('BlockABC.post Request data: ', url, data)

      const startAt = Date.now()
      const res = await helper.timeout<Response>(5000, fetch(url, {
        method: 'POST',
        // @ts-ignore
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }))
      this.logger.trace('BlockABC.post Request benchmark(in ms):', Date.now() - startAt)

      if (res.ok) {
        ret = await res.text()
        if (ret) {
          ret = JSON.parse(ret)
          if (ret.errno !== 0) {
            if (ret.errno === 500) {
              let errno, errmsg, data
              try {
                errno = ret.data.error.code
                errmsg = ret.data.error.message
                data = ret.data.error
              }
              catch (err) {
                this.logger.error('BlockABC.post Response error:', path, 500, ret.errmsg, ret)
                throw NetworkError.fromCode(500, ret.errmsg)
              }

              this.logger.error('BlockABC.post Response error:', path, errno, errmsg, data)
              throw new RPCError(errno, errmsg, data)
            }
            else {
              this.logger.error('BlockABC.post Response error:', path, 400, ret.errmsg)
              throw NetworkError.fromCode(400, ret.errmsg)
            }
          }
        }
        !process.env.PROD && this.logger.trace('BlockABC.post Response data: ', ret)
      }
      else {
        this.logger.error('BlockABC.post Network error:', path, `${res.status} ${res.statusText}`)
        throw NetworkError.fromCode(res.status, `${res.status} ${res.statusText}`)
      }
    }
    catch (err) {
      if (err instanceof NetworkError || err instanceof RPCError) {
        throw err
      }
      else {
        this.logger.error('BlockABC.post Unknown error:', path, err.message)
        throw NetworkError.fromCode(1, err.message)
      }
    }

    return ret.data
  }
}

export default BlockABC
