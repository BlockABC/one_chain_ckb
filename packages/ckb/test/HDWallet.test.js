const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { ckb, core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))

const mnemonic = 'comfort rough close flame uniform chapter unique announce miracle debris space like'
const chain = `m/44'/309'/0'`
const rpcnode = new core.RPCNode({
  chainId: 'mainnet',
  chainType: core.ChainType.CKB,
  baseUrl: 'https://ckb.abcwallet.com/api',
})
const { helper, HDWallet, BlockABC } = ckb
const apiProvider = new BlockABC(rpcnode)

/* eslint-disable quotes, object-curly-spacing, key-spacing, comma-spacing */
describe('HDWallet', () => {
  describe('fromMnemonic', () => {
    test('should be able to init from mnemonic', async () => {
      const hdwallet = await HDWallet.fromMnemonic({
        mnemonic,
        path: chain,
        rpcnode: rpcnode,
        apiProvider: apiProvider,
        needSync: false,
      })

      expect(hdwallet.mnemonic).toBe(mnemonic)
      expect(hdwallet.path).toBe(chain)
      expect(hdwallet.receiving).toEqual(expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ]))
      expect(hdwallet.change).toEqual(expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ]))

      expect(hdwallet.receiving[0]).toMatchObject({
        "index": 0,
        "address": "ckb1qyqv9yy00mmnee4gesq272gf2c47vt87whcst8jcuk",
        "txCount": 0,
        "balance": "0",
        "ecpair": {
          "address": "ckb1qyqv9yy00mmnee4gesq272gf2c47vt87whcst8jcuk",
          "publicKey": "0x02391128e7b5f89a62a68b54d820bba21d3de0c836b7054f55644249608224ce95",
          "privateKey": "0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf",
          "wif": "0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf"
        }
      })
    })
  })

  describe('fromJSON', () => {
    test('should be able recover from JSON', async () => {
      const hdwallet = await HDWallet.fromJSON({
        data: {"mnemonic":"comfort rough close flame uniform chapter unique announce miracle debris space like","path":"m/44'/309'/0'","receiving":[{"index":0,"address":"ckb1qyqv9yy00mmnee4gesq272gf2c47vt87whcst8jcuk","wif":"0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf","publicKey":"0x02391128e7b5f89a62a68b54d820bba21d3de0c836b7054f55644249608224ce95","privateKey":"0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf","txCount":0,"balance":"0"},{"index":1,"address":"ckb1qyqfp4x269tagx5hw6cmtuafvzw06kc4pylq7g020j","wif":"0x98e6216cc58bda516284fb27cb1a21b2c4effdf7003002593142143bad1dc6c1","publicKey":"0x0250685b2cb028bd0ed441644305326f5ddbf1d30b8729fa46442b61b3f1c9270a","privateKey":"0x98e6216cc58bda516284fb27cb1a21b2c4effdf7003002593142143bad1dc6c1","txCount":0,"balance":"0"},{"index":2,"address":"ckb1qyq0ed5yslaccz7a84kueh0w9ghytdwdx8fq8vt6m5","wif":"0x222e47f8bb16ab4e25a9782ff3c47e0cdfc917ac03056f2f3e2ab841fc49cb5d","publicKey":"0x028ad6f4fdb0ed2c1f2701f1c3060d0e5485611a2844e3b644288c115411348237","privateKey":"0x222e47f8bb16ab4e25a9782ff3c47e0cdfc917ac03056f2f3e2ab841fc49cb5d","txCount":0,"balance":"0"},{"index":3,"address":"ckb1qyqxaj97vr7dcf8xm7fhpn6gut0m0wpash6qn3hkh2","wif":"0xfda9291c8d92e48298407e73069aa6ecfd0e42bd49857dc3f02b6565122e66f1","publicKey":"0x02f0eb488e69471df432b9527e3065938772bec905661603eb8ce49cc5e4a244c3","privateKey":"0xfda9291c8d92e48298407e73069aa6ecfd0e42bd49857dc3f02b6565122e66f1","txCount":0,"balance":"0"},{"index":4,"address":"ckb1qyqvnw84fjqh6qkw5yjsqeeqcjg5v6yl29uqgnjknu","wif":"0x6a743188f790971a6cb15cbd376ae3390a69b3416f56440f73f35c1e70a7b5c3","publicKey":"0x0268215c43cdcf975d27e4fe06506204e451a805310b5fb7ee7ae85066175ba2de","privateKey":"0x6a743188f790971a6cb15cbd376ae3390a69b3416f56440f73f35c1e70a7b5c3","txCount":0,"balance":"0"},{"index":5,"address":"ckb1qyqvu022kmnpz5e8yyfsf96hrc8p8472uvvqr5z0an","wif":"0x90bc451476f12ba1417fbf737a253bbbddeeb0e013e0a7fd818f41cd537c7fa0","publicKey":"0x032a1900fe7f81e3aac3fe769a82b26d629f6ce1d6bbed554a8c5e18769a51f9ae","privateKey":"0x90bc451476f12ba1417fbf737a253bbbddeeb0e013e0a7fd818f41cd537c7fa0","txCount":0,"balance":"0"},{"index":6,"address":"ckb1qyqg0ag0r4x2t35dx8v5evkrnx40dqn8wtkq39y3el","wif":"0x8c9988d5c13b754fe524e674c5d48c21784cb4593f09a9458fe9e1116f773199","publicKey":"0x0290d97979a213072426e1ca30a9cbc2942220c2ad2d5c0ad1084803be6d0d9a5b","privateKey":"0x8c9988d5c13b754fe524e674c5d48c21784cb4593f09a9458fe9e1116f773199","txCount":0,"balance":"0"},{"index":7,"address":"ckb1qyqfhrdpd0qhggynrgrnv3kmau2xm2ekrq5st2lv93","wif":"0x9bb40c0aed2f2ea5c337840b191603fe4075f6d7663f7abc3229093ef31a533f","publicKey":"0x02b72ae35708a82619510162e9231853af3793a3222d5cb80be10ae6967a24fb3f","privateKey":"0x9bb40c0aed2f2ea5c337840b191603fe4075f6d7663f7abc3229093ef31a533f","txCount":0,"balance":"0"},{"index":8,"address":"ckb1qyqzfv6zqn56zctzx69ephw5w7juqkhdstgq6rrs3n","wif":"0x8edf6560557815aae55d71930f44413f77144e8e9ae27ed9953c0ea6bb6d19b2","publicKey":"0x03cc9064b960b094c4ccd8a8c24f67fc9eca27546cebba979783261724349a497e","privateKey":"0x8edf6560557815aae55d71930f44413f77144e8e9ae27ed9953c0ea6bb6d19b2","txCount":0,"balance":"0"},{"index":9,"address":"ckb1qyqqpc5v4zsy7caxkg5w370acmxnq0pkyllqgk4mk7","wif":"0x94a9079936f41799c93164c9a559bfca61d931e4f14ac5a936ec68e7d66be86b","publicKey":"0x034e113499de82e1779b6678a50b4c6d4c38c08815cddcbc4365ce9ebb283d3fec","privateKey":"0x94a9079936f41799c93164c9a559bfca61d931e4f14ac5a936ec68e7d66be86b","txCount":0,"balance":"0"},{"index":10,"address":"ckb1qyqzhplgszw6s79cy944rn3upq2ufv2c8h3qn0kuhd","wif":"0xec93dc1c45f2357f320c42b6d77f5167df6fa2c49ed427ef32b864c017510d8e","publicKey":"0x02f6b61606e5488a26aa4d928f64aaf7b43f50e7243ae664244ea695f4a6b9f39a","privateKey":"0xec93dc1c45f2357f320c42b6d77f5167df6fa2c49ed427ef32b864c017510d8e","txCount":0,"balance":"0"},{"index":11,"address":"ckb1qyqtql3cww74lkacjcms2vvrwf65xn8l4zhqv2xmhk","wif":"0x5063c434fd3e41aaa34f8c88ed08b3b424d9aeb4fe267198ac438d4eb7e04eb6","publicKey":"0x037b60bf8dd15986a0cebf9710d5a274a53ab86cb04a143ecfe0517466649e39e4","privateKey":"0x5063c434fd3e41aaa34f8c88ed08b3b424d9aeb4fe267198ac438d4eb7e04eb6","txCount":0,"balance":"0"},{"index":12,"address":"ckb1qyqwtlqqpzk2zmxdwc94xk4cfjmcdavmm3fq8h6zl2","wif":"0xe0df42a9070d84acecaf85898963f497bcacaf8f420b785a2c4578ebc6268b22","publicKey":"0x029eec9385c0da6dcdc2c24ebb630123d835fd578a6647008985f63d555db40f0d","privateKey":"0xe0df42a9070d84acecaf85898963f497bcacaf8f420b785a2c4578ebc6268b22","txCount":0,"balance":"0"},{"index":13,"address":"ckb1qyqygunhh7pjln7t3mur3yyju3tnfjh04rksxrqv2c","wif":"0x605fcdf375fdad6e5b4975e6a368196e27f807f4ad628ab8bc6188fcdb0df553","publicKey":"0x02298c8538048f6f07a9a6da1c3d1ed8d2ae648d0e58b9b791e084647e6f7af09a","privateKey":"0x605fcdf375fdad6e5b4975e6a368196e27f807f4ad628ab8bc6188fcdb0df553","txCount":0,"balance":"0"},{"index":14,"address":"ckb1qyqvhhgl50jjrtyhkuhzcph5wmw7ujn5qj6qkf6f6r","wif":"0x8ab4cb5f861aba8ddad88b6710502c76a2a45fd7f66400ff95ba3b3ec0acdc9a","publicKey":"0x0220863d7e1d1f4b9effe3d0d5f5b90eb228c9c0e8e22f16c9d4da10b5659b403c","privateKey":"0x8ab4cb5f861aba8ddad88b6710502c76a2a45fd7f66400ff95ba3b3ec0acdc9a","txCount":0,"balance":"0"},{"index":15,"address":"ckb1qyq25hw8t9jh7v9p0008egpedttydcjed4hqrx3jdw","wif":"0x95ef11d67eeacd376758847bbf8229dee232bbb454a89670513b4dee545a7212","publicKey":"0x02a863cd066c7de02706e1ab919a9f99f1316ce051d3593f94937edebbd61660e1","privateKey":"0x95ef11d67eeacd376758847bbf8229dee232bbb454a89670513b4dee545a7212","txCount":0,"balance":"0"},{"index":16,"address":"ckb1qyqzue7f4630n2hxqkhthaz372dqsclxvxmqylhuqe","wif":"0x86195bf6533581a113a7fcea4bd7940485befa75cce5abbbb008a8d217d42e0d","publicKey":"0x030971cab38e1213652f9d9efa17603d04dfdff086eb371ecf52c37e3cf543ba6a","privateKey":"0x86195bf6533581a113a7fcea4bd7940485befa75cce5abbbb008a8d217d42e0d","txCount":0,"balance":"0"},{"index":17,"address":"ckb1qyqqlz48p4aht63vfdp0980usz82vafg939s2kqdfc","wif":"0x85568355d51f68edcf4426e81ec82cf64a39718e26790352f4379bc4e6e336d7","publicKey":"0x0259db5fd62ae9fb3fe3daed6ccccb430672470db8e8ed7f4c9b0bc6c4cb08257c","privateKey":"0x85568355d51f68edcf4426e81ec82cf64a39718e26790352f4379bc4e6e336d7","txCount":0,"balance":"0"},{"index":18,"address":"ckb1qyqqs8mfmkqz202kj53q65d75pvp7kpmkkasyrxhqv","wif":"0xbc46d9063dfd411f510d7a93cc5e8e68e286ae103196811524a926ac1fb11d60","publicKey":"0x025d6b187f4d613dceab2c489ddef11623b40fd407bfa656cb75d36f06e9c37e64","privateKey":"0xbc46d9063dfd411f510d7a93cc5e8e68e286ae103196811524a926ac1fb11d60","txCount":0,"balance":"0"},{"index":19,"address":"ckb1qyqx305y373xsguzrjnl5cu67gsnfjdz0yqqygvusx","wif":"0x6f63edea264a886fde14cc84c40b91fe9a8fad12d2425171321d80c6cf746829","publicKey":"0x0366ee62e4c2131e0a693e4a4cd17f5614b952e671676383c356fd900aa3b846c5","privateKey":"0x6f63edea264a886fde14cc84c40b91fe9a8fad12d2425171321d80c6cf746829","txCount":0,"balance":"0"}],"change":[{"index":0,"address":"ckb1qyq8rwpprgu4yc4eqnlw4ejsw4d623g7xdhq8vnd57","wif":"0x9ae65eb9e8ccc246a1d8744a1b6ca0fded47e2b1ac5852adb2adba8a8de69cfb","publicKey":"0x02332e83d62173f16fd95061a57f6b4d6e1dc6aa14a0724fc3ab47fe56eb7b7414","privateKey":"0x9ae65eb9e8ccc246a1d8744a1b6ca0fded47e2b1ac5852adb2adba8a8de69cfb","txCount":0,"balance":"0"},{"index":1,"address":"ckb1qyqtxy46smky995dnymp0kw5d7ezmn5uhj5s0njqgw","wif":"0x9ed5e0c40175abbab6aaf04c58d3a38588b56b4ebdc51aaff495e4e347502a72","publicKey":"0x02c4af2a96b8faa5e99db21d12dc898d0bb2c4932a02c72691c3c03e9dd51790ae","privateKey":"0x9ed5e0c40175abbab6aaf04c58d3a38588b56b4ebdc51aaff495e4e347502a72","txCount":0,"balance":"0"},{"index":2,"address":"ckb1qyqzn7ks9qjg2rfv9zy6zkrlxuzpjgdet03s7aj3rn","wif":"0xd560972446953000238b6c49aae7bb6cf87cdf6bca9e26db16fdf5eb7fe041a9","publicKey":"0x03cae722404dbfc9bf152661dccdd4802537f6a9cad6b38a2790ec9722937e93af","privateKey":"0xd560972446953000238b6c49aae7bb6cf87cdf6bca9e26db16fdf5eb7fe041a9","txCount":0,"balance":"0"},{"index":3,"address":"ckb1qyq0d9hmdnp777ccf95p62a0j8u6up9k6cvsge754n","wif":"0xc391bcda08c81d2d71fe1c8ed637d7407f562b0e32f6afe071fe8203cfddeb09","publicKey":"0x02b88a113b9391eb825739e11447314e013196351dff4a1a03b6db07b8e99057d4","privateKey":"0xc391bcda08c81d2d71fe1c8ed637d7407f562b0e32f6afe071fe8203cfddeb09","txCount":0,"balance":"0"},{"index":4,"address":"ckb1qyqtlxkmskkqxxuqp0yqxunq4m3w9axdz95qz40f90","wif":"0x5019c76fa3856121a4cb16de21824068ac7c176b14c5b3556a2849e97453abfe","publicKey":"0x039bbb7f3c5f24bdfac4e6c36d8f225f1b7123efc6eb54a41df14150ca617156b3","privateKey":"0x5019c76fa3856121a4cb16de21824068ac7c176b14c5b3556a2849e97453abfe","txCount":0,"balance":"0"},{"index":5,"address":"ckb1qyqtrf9e85urjxgxyaspzega5d5f9s2tc7ksspg64s","wif":"0x9ab5dbc29bf35bb5a1b890e6a17be7cfc077a2a60ed85e14942fb67813d1936e","publicKey":"0x03676a2d8952ee9774181535c234ab6d3d920c20865eaf5df02c0d7c5cc9af35a0","privateKey":"0x9ab5dbc29bf35bb5a1b890e6a17be7cfc077a2a60ed85e14942fb67813d1936e","txCount":0,"balance":"0"},{"index":6,"address":"ckb1qyqthjxgnt82ztnq2ajadgdqegss9cewc7aqw0vsdf","wif":"0xf69de532a056a95fb635272614127dfbf75cefe0c4e3832157dff4b56f681797","publicKey":"0x02fb37a1fcadc890804bd50462d85ad0ac1506467c65a13aaa17043bcdb58963e1","privateKey":"0xf69de532a056a95fb635272614127dfbf75cefe0c4e3832157dff4b56f681797","txCount":0,"balance":"0"},{"index":7,"address":"ckb1qyqttpyf6gnj5s554x35ju05nq55fsdfn54s9mt966","wif":"0xbfb25d2f251e2903f23deca9529c640592ddca730a165bd8636d1d6a3495338d","publicKey":"0x0280742fcfb59c263e0035075c95a21f2df29f68712ce41410e3bf0716aa3b64ee","privateKey":"0xbfb25d2f251e2903f23deca9529c640592ddca730a165bd8636d1d6a3495338d","txCount":0,"balance":"0"},{"index":8,"address":"ckb1qyq0ejrw48hfg9xqtvdlnaqy7gqf7q35hqfsqhutjt","wif":"0x556dae3575c9338b940ad3c8d86a40b4b5ed10fbbb5036c6462b8c56a7fe8a12","publicKey":"0x028e90fc180db8437e410f058bba855dc40e6b7da5cd9b56ff8620094b126bb528","privateKey":"0x556dae3575c9338b940ad3c8d86a40b4b5ed10fbbb5036c6462b8c56a7fe8a12","txCount":0,"balance":"0"},{"index":9,"address":"ckb1qyq94srdgffpqdzj8pnfefhj3upnzze0zaxqas7jdh","wif":"0x904b6052e910563d049e0a0b13643fde0cd6e5735aba4621139d20f3e36b9302","publicKey":"0x02b10ac47fe06459dfe3a1bf7b952cbb1f019b51bc363a1cb1b85484b282484598","privateKey":"0x904b6052e910563d049e0a0b13643fde0cd6e5735aba4621139d20f3e36b9302","txCount":0,"balance":"0"},{"index":10,"address":"ckb1qyqy9wtxxqspf46lthfmq9akdw5xzgre5krqwrn2pm","wif":"0x5ec64e6707ad0147160225798c17549db42dd41a4d2f1805d06e1fc61026c764","publicKey":"0x02a0e5cc79284e5e14418b76583c425b8215772bb1469e2aa8b48b3836ce9b3073","privateKey":"0x5ec64e6707ad0147160225798c17549db42dd41a4d2f1805d06e1fc61026c764","txCount":0,"balance":"0"},{"index":11,"address":"ckb1qyq2femzxtc5dzghf7pyy3aew3v5ld7u8dus4dlcd8","wif":"0x2d811785dd185c2232d7eb519d08312a9e2eb9852d383bfb0e0c3e5b1b80d4e1","publicKey":"0x030944c0b698d420f27f2ae2847f572967c8dc056562af9adc1b8c6920f9c71bf4","privateKey":"0x2d811785dd185c2232d7eb519d08312a9e2eb9852d383bfb0e0c3e5b1b80d4e1","txCount":0,"balance":"0"},{"index":12,"address":"ckb1qyq9988fp0cxlyelnjdph33f2r47h2n3qz4sk48pdt","wif":"0xe55f93d96ccd3ae0915acedee672d7373ce8a80e1312e245f588b38b86bc20c9","publicKey":"0x03168831fc83e8e19c17cbc802f62d5e876c46ed6eb6a4c25c7225f0e8a31b62d5","privateKey":"0xe55f93d96ccd3ae0915acedee672d7373ce8a80e1312e245f588b38b86bc20c9","txCount":0,"balance":"0"},{"index":13,"address":"ckb1qyqr5pee9w3kku3gu7e7tf7xah6d8stfyasqrkr5sm","wif":"0x098d1c461fad3ef50eb442941e1c53434a083761eb7b3324babb6c6534fa331d","publicKey":"0x02f3e2b0ab58dc52f7e8f165fb90694dda4c557a6f092b235da0f63f4b9b908895","privateKey":"0x098d1c461fad3ef50eb442941e1c53434a083761eb7b3324babb6c6534fa331d","txCount":0,"balance":"0"},{"index":14,"address":"ckb1qyqz4mutk4mw9lvndrfylgsrzqjj8ef0fvmqdqkh7z","wif":"0xd84aa9b1a8e4d2455cba67c4037075bf8dc74d5c2c4715a6a7fac20dd316509f","publicKey":"0x02240aad44b5db11bd42119f4212e529b892029d008da7689b1aaf2e53923fe087","privateKey":"0xd84aa9b1a8e4d2455cba67c4037075bf8dc74d5c2c4715a6a7fac20dd316509f","txCount":0,"balance":"0"},{"index":15,"address":"ckb1qyqr4xgexnkztsvejpvucjhutrkvs6tywarq70pzck","wif":"0x4925082ecd8292f449661c6930a935f2a2417c6210915ff87d8f4f769013ed64","publicKey":"0x0304db947d5d3e72302a931bded7b7e6b9b134a249d2792e133510a76ce3aff657","privateKey":"0x4925082ecd8292f449661c6930a935f2a2417c6210915ff87d8f4f769013ed64","txCount":0,"balance":"0"},{"index":16,"address":"ckb1qyqdg75k0axf374h2m2czrmwhpxmw20k7gzsz88hua","wif":"0x6cd52b4c0ccdf8092e7315d3dc3963ba44ea475249e6bee0b38c4f8fa7a2f567","publicKey":"0x03d63b61bcd404fcb2c9bb04debbbd521aa033cec3da3758fec988f7a33253cc0e","privateKey":"0x6cd52b4c0ccdf8092e7315d3dc3963ba44ea475249e6bee0b38c4f8fa7a2f567","txCount":0,"balance":"0"},{"index":17,"address":"ckb1qyq2nnsz7zp84rykr8x28yx80zj29lwwysssxajmcf","wif":"0xe945e5f2f055a6b0552a499e43a361735e7f93e6e69cb2bdbc323a679dec4ed3","publicKey":"0x039c773b144c9f0f4d5400827b0313da1495ffa3330afec6bd163fe60852c3e7d8","privateKey":"0xe945e5f2f055a6b0552a499e43a361735e7f93e6e69cb2bdbc323a679dec4ed3","txCount":0,"balance":"0"},{"index":18,"address":"ckb1qyqqzh4z7a08esnzk6nk24hegzfklzwx833s5hm02e","wif":"0x6606ecc42854a428bd46bc97696e1a6185f1b812fcad56b86303e7313090b19b","publicKey":"0x02f3f30bfe59ac737c79627f988967a922d08fb5170b7c38fda7b1c4af19d36018","privateKey":"0x6606ecc42854a428bd46bc97696e1a6185f1b812fcad56b86303e7313090b19b","txCount":0,"balance":"0"},{"index":19,"address":"ckb1qyqglsde5wepsyvyja7y7rxkf5she8etvceqvt246s","wif":"0x713a88dfd74d6cdebbc8b813bafc09007e320cebf01aa4e2e101dea487e5c9b8","publicKey":"0x03a95b3350d4ce11cc4dbf653e454f0fef6a984e878c88168ed32b52f0e6daa3b3","privateKey":"0x713a88dfd74d6cdebbc8b813bafc09007e320cebf01aa4e2e101dea487e5c9b8","txCount":0,"balance":"0"}]},
        rpcnode: rpcnode,
        apiProvider: apiProvider,
      })

      expect(hdwallet.mnemonic).toBe(mnemonic)
      expect(hdwallet.path).toBe(chain)
      expect(hdwallet.receiving).toEqual(expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ]))
      expect(hdwallet.change).toEqual(expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ]))

      expect(hdwallet.receiving[0]).toMatchObject({
        "index": 0,
        "address": "ckb1qyqv9yy00mmnee4gesq272gf2c47vt87whcst8jcuk",
        "txCount": 0,
        "balance": "0",
        "ecpair": {
          "address": "ckb1qyqv9yy00mmnee4gesq272gf2c47vt87whcst8jcuk",
          "publicKey": "0x02391128e7b5f89a62a68b54d820bba21d3de0c836b7054f55644249608224ce95",
          "privateKey": "0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf",
          "wif": "0xaff8bf9c3bc05c849383063e140c61f501dd0ebfc5d4627398d245e5b66d80cf"
        }
      })
    })
  })
})
