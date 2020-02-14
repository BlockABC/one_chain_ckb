const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { ckb, core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))
const { RPCNODE, FROM, TO, MNEMONIC } = require('./const.js')

let provider

beforeEach(async () => {
  provider = new ckb.CKB({
    rpcnode: RPCNODE,
    keypairs: [FROM, TO]
  })

  jest.spyOn(provider._apiProvider, 'getAddresses').mockImplementation(async function (addresses) {
    // console.log('Mock bch rpc call:', 'getAddresses', addresses)
    return addresses.map((address, i) => {
      return {
        address: address,
        txCount: 0,
      }
    })
  })

  jest.spyOn(provider._apiProvider, 'getUnspentOfAddresses').mockImplementation(async function (addresses, onlyConfirmed = false) {
    // console.log('Mock bch rpc call:', 'getUnspentOfAddresses', addresses, onlyConfirmed)
    return addresses.map((address, i) => {
      return {
        txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
        address: address,
        value: '10000000000',
        vout: i,
        lock: {
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hashType: 'type',
          args: '0x10af0070ff9669686620f82a2e34a2cb60bb55dd'
        },
        lockHash: '0x64cfd79c5ea8115a0910a47aa479f960f097437e47a9216e30d66bcab76cd7fc'
      }
    })
  })

  jest.spyOn(provider._apiProvider, 'pushTransaction').mockImplementation(async function (rawTransaction) {
    // console.log('Mock bch rpc call:', 'pushTransaction', rawTransaction)
    return '0x123'
  })
})

describe('CKB', () => {
  describe('setKeypairs', () => {
    test('should set keypairs correctlly', () => {
      provider.setKeypairs({
        keypairs: [
          { address: 'ckb1qyqzuw4rtk30nkgvcvwp9gtrz9gr060auaus28eu4x', privateKey: '0x298579dee70f95a302a2ce35d3f218302bf0387037afe08df6a0ca31cf8d4784' },
          { address: 'ckb1qyqw9ce36znz5p3hu3sfudadk2d8uayrv68sjqzwax', privateKey: '0x1df32bf58c2fcf13084bb9b462be6add394a9b04187392690e357d01c81d758f' },
        ]
      })

      expect(provider.keypairs).toEqual(expect.arrayContaining([
        { address: 'ckb1qyqzuw4rtk30nkgvcvwp9gtrz9gr060auaus28eu4x', privateKey: '0x298579dee70f95a302a2ce35d3f218302bf0387037afe08df6a0ca31cf8d4784' },
        { address: 'ckb1qyqw9ce36znz5p3hu3sfudadk2d8uayrv68sjqzwax', privateKey: '0x1df32bf58c2fcf13084bb9b462be6add394a9b04187392690e357d01c81d758f' },
      ]))
    })
  })

  describe('setRPCNode', () => {
    test('should set rpcnode correctly', () => {
      const rpcnode = Object.assign({ chainId: 'testnet' }, RPCNODE)

      provider.setRPCNode({ rpcnode })

      expect(provider.rpcnode).toEqual(expect.objectContaining(rpcnode))
    })
  })

  describe('buildTransaction', () => {
    test('should create transaction object', async () => {
      const tx = await provider.buildTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
      })

      expect(tx).toEqual(expect.UTXOTransaction({
        value: '6100000000',
        change: '0',
        fee: '3900000000',
        waste: '3900000000',
        size: '351',
        rawTransaction: JSON.parse('{"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c","index":"0x0"},"dep_type":"dep_group"}],"inputs":[{"previous_output":{"tx_hash":"0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0","index":"0x0"},"since":"0x0"}],"outputs":[{"capacity":"0x16b969d00","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xc37c5beb7f77b19810084cea3af2a22d4d067081"},"type":null}],"outputs_data":["0x"],"header_deps":[],"witnesses":["0x5500000010000000550000005500000041000000dfb8a797d8ae1770e9793a0f46cbf05dd9e0293bab8db72db2f969f75ac945110ab1f775ae20de6a3852b284f64624acb9464be25eb0886f453c8b81882b536501"]}'),
      }))
    })

    test('should throw 116 if balance is not enough', async () => {
      await expect(provider.buildTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '10000000001' }
        ],
      })).rejects.toBeOneChainError(116)
    })
  })

  describe('buildAutoFixTransaction', () => {
    test('should create transaction object with fixed value', async () => {
      const tx = await provider.buildAutoFixTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '10000000001' }
        ],
      })

      expect(tx).toEqual(expect.UTXOTransaction({
        value: '10000000000',
        change: '0',
        fee: '0',
        waste: '0',
        size: '351',
        rawTransaction: JSON.parse('{"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c","index":"0x0"},"dep_type":"dep_group"}],"inputs":[{"previous_output":{"tx_hash":"0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0","index":"0x0"},"since":"0x0"}],"outputs":[{"capacity":"0x2540be400","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xc37c5beb7f77b19810084cea3af2a22d4d067081"},"type":null}],"outputs_data":["0x"],"header_deps":[],"witnesses":["0x5500000010000000550000005500000041000000d5de778fbc05d8f8ba14b4d06733d5d2dcc19083976f90e0cf334de025e67dd239c8dc88e6310b756393a7614ea29de73fc5143ad19a7e01294821428d3449e500"]}'),
      }))
    })
  })

  describe('sign', () => {
    test('should sign raw transaction', async () => {
      provider.setKeypairs({ keypairs: [] })
      const tx = await provider.buildTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
      })

      provider.setKeypairs({ keypairs: [FROM] })
      const signedTransaction = provider.sign({ transaction: tx.rawTransaction, unspents: tx.unspents })

      expect(signedTransaction).not.toBe(tx.rawTransaction)
      expect(signedTransaction).toEqual(JSON.parse('{"cell_deps": [{"dep_type": "dep_group", "out_point": {"index": "0x0", "tx_hash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c"}}], "header_deps": [], "inputs": [{"previous_output": {"index": "0x0", "tx_hash": "0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0"}, "since": "0x0"}], "outputs": [{"capacity": "0x16b969d00", "lock": {"args": "0xc37c5beb7f77b19810084cea3af2a22d4d067081", "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", "hash_type": "type"}, "type": null}], "outputs_data": ["0x"], "version": "0x0", "witnesses": ["0x5500000010000000550000005500000041000000dfb8a797d8ae1770e9793a0f46cbf05dd9e0293bab8db72db2f969f75ac945110ab1f775ae20de6a3852b284f64624acb9464be25eb0886f453c8b81882b536501"]}'))
    })
  })

  describe('pushTransaction', () => {
    test('should push raw transaction', async () => {
      const tx = await provider.buildTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
      })

      const ret = await provider.pushTransaction({ transaction: tx.rawTransaction })

      expect(ret).toBe('0x123')
    })

    test('should push transaction', async () => {
      const tx = await provider.buildTransaction({
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
      })

      const ret = await provider.pushTransaction({ transaction: tx })

      expect(ret).toBe('0x123')
    })
  })

  describe('hdwalletFromMnemonic', () => {
    test('should create hdwallet object from mnemonic', async () => {
      const hdwallet = await provider.hdwalletFromMnemonic({
        mnemonic: MNEMONIC.word,
        path: MNEMONIC.path,
      })

      expect(hdwallet).toEqual(expect.HDWallet({
        mnemonic: MNEMONIC.word,
        path: MNEMONIC.path,
      }))
      expect(hdwallet.receiving.length).toBe(20)
      expect(hdwallet.change.length).toBe(20)
    })
  })

  describe('hdwalletFromJSON', () => {
    test('should create hdwallet object from json', async () => {
      const hdwallet = await provider.hdwalletFromJSON({
        json: JSON.parse('{"mnemonic":"desert history window space another since plastic soccer cloud myself private core","path":"m/44\'/309\'/0\'","receiving":[{"index":0,"address":"ckb1qyqq84ljval8dpph76wvr32dquvn06499sgsplga0n","wif":"0x48430a79cfc3e5abbe8067875afd57d86c6626852aed8be6c7b5f53e12111cff","publicKey":"0x037cd950558d22561041b7f9a62e5aa19903fc6ec8f18caaf7b7fbb9528f8d4431","privateKey":"0x48430a79cfc3e5abbe8067875afd57d86c6626852aed8be6c7b5f53e12111cff","txCount":0,"balance":"0"},{"index":1,"address":"ckb1qyqt2wtaqlwuzrc4rhc68n520h68sxah8q8q73tyea","wif":"0x1c855c049a7cf7a2435e895c38e2c4cf262546435ef4b39a95b32cfe7ec915f3","publicKey":"0x025f2878454f8275d4386604bb28e3243460ff6fcda75a1a0d597d5fc5499241c3","privateKey":"0x1c855c049a7cf7a2435e895c38e2c4cf262546435ef4b39a95b32cfe7ec915f3","txCount":0,"balance":"0"},{"index":2,"address":"ckb1qyqxrg4ldvu50tzm7fas34ght0hnhja3gnqqtt64kz","wif":"0x660e5633b3d0a7487635b2cf65d2345172371a127b544fea7c31e56d825e2fd5","publicKey":"0x0249104122fe9a4441bc7e855943b34965f67da1b234e2bb4e505c9290e91ab2a9","privateKey":"0x660e5633b3d0a7487635b2cf65d2345172371a127b544fea7c31e56d825e2fd5","txCount":0,"balance":"0"},{"index":3,"address":"ckb1qyqrwyrd6j8k4r7f0drfq8puwupx7gn5qeps20z459","wif":"0x71f10bfc00678833f6db36c3106333ac4ca4e2bfeba43ab1db5f3a88fa5dc8b9","publicKey":"0x023e96c4f5d7478690755b9382d81fddb7bd64b511c9b6b257d83c1d5fb4d7ecf8","privateKey":"0x71f10bfc00678833f6db36c3106333ac4ca4e2bfeba43ab1db5f3a88fa5dc8b9","txCount":0,"balance":"0"},{"index":4,"address":"ckb1qyqz6n87yz59zt2defel9nfjjex8xza3e06srhpsuk","wif":"0xb08d46890bd54558cf86bf6efe4165e3364ad587d54a32816eea5141c3d97c0a","publicKey":"0x039fbc016823ef0943c010a047b9d17dbfeee08b2daace219f831cd616194738cd","privateKey":"0xb08d46890bd54558cf86bf6efe4165e3364ad587d54a32816eea5141c3d97c0a","txCount":0,"balance":"0"},{"index":5,"address":"ckb1qyqz5eepj5lhqu92rnhxmx4sl0eu3hhtksjskn93f7","wif":"0x4813cbac816e94e6d9240cf936571e9a55a69fac56f0a965ccb6812ad5595b61","publicKey":"0x039201a73b1407a2cc50540b03d55e4df9494a2b229ebb69a0144e15d217ccb586","privateKey":"0x4813cbac816e94e6d9240cf936571e9a55a69fac56f0a965ccb6812ad5595b61","txCount":0,"balance":"0"},{"index":6,"address":"ckb1qyqrazf5lgc8sleach3keynexsrv5vqlhmzqhzx67r","wif":"0x94f1a2367716ce9e292306c9a7775479ebaec61443fb604e7b839be738977ac6","publicKey":"0x03f64581e8f92582e4b34ef8a9df4421de5ea759cbff55cc3893fe3739f608624c","privateKey":"0x94f1a2367716ce9e292306c9a7775479ebaec61443fb604e7b839be738977ac6","txCount":0,"balance":"0"},{"index":7,"address":"ckb1qyq9vz076ktltxwrmzvq75wpc086xmkkuzhsww2hmq","wif":"0xfff2c128a72d0c9d8648c126e3106ea694e51b1f8579c9ac8f28ea9fe25b558b","publicKey":"0x034d06e850e13a5dad524709aa0c0d83870083fda3a589cbd4712b6b0b0aba96c8","privateKey":"0xfff2c128a72d0c9d8648c126e3106ea694e51b1f8579c9ac8f28ea9fe25b558b","txCount":0,"balance":"0"},{"index":8,"address":"ckb1qyqf2fhv8rtfq05dvg5tjuc3dudytcflecmqzfeagy","wif":"0x3961dbaf1230a47b7f3d9cd5e8bc5a1ccda312665268132f84b3f4ea5f84068c","publicKey":"0x0354c331972450b497142bb216bd4b5eebfcf40e439e89058a5da5aff59c8c2f5d","privateKey":"0x3961dbaf1230a47b7f3d9cd5e8bc5a1ccda312665268132f84b3f4ea5f84068c","txCount":0,"balance":"0"},{"index":9,"address":"ckb1qyq94q60zd3ek3jpvprnsgv9zx4jsaam7kxqtydwrq","wif":"0x511c4ae10db78db88683a2be970a98e854bdca07afd44c43ec77dd5dad443035","publicKey":"0x02452a86b5fe4908313eb86681684cefb0d84381c464b5f647f6a8bc0ee84b21db","privateKey":"0x511c4ae10db78db88683a2be970a98e854bdca07afd44c43ec77dd5dad443035","txCount":0,"balance":"0"},{"index":10,"address":"ckb1qyqw6xzkq52kuv4ggdssdt8xcv0efzzjm5tqxa88ts","wif":"0x075258eb82036d605b270f375d68622a998b2e847edf9da561293103dc5808bb","publicKey":"0x03197b1471de9efc23838fcccc0fd764e642ae086655005ad7df16ffafce575c04","privateKey":"0x075258eb82036d605b270f375d68622a998b2e847edf9da561293103dc5808bb","txCount":0,"balance":"0"},{"index":11,"address":"ckb1qyq8lhw0vrckpg6c8w3rwye0ewsdc7qmnklq4eu8qy","wif":"0x6f78c08b93f70da8cbe594a45a705dafc200b5a802b61fc64e79eba8a39b7314","publicKey":"0x03dadbc7c9bb9d7ac4516d0e3b8916e06ece5be68ac1adf9a394b84d0fc867119c","privateKey":"0x6f78c08b93f70da8cbe594a45a705dafc200b5a802b61fc64e79eba8a39b7314","txCount":0,"balance":"0"},{"index":12,"address":"ckb1qyqyxfc5jpyqvq5qkrmv8um7fheapp3ln6vqyfws0u","wif":"0x921066b0f9728f0943274db7d9e4dfaf66d259e6240d8a3ed489c43cc604d7f6","publicKey":"0x02952fd8deb417763563919f6b4e11fff96805d1b94943a44917b0a6b76488fc40","privateKey":"0x921066b0f9728f0943274db7d9e4dfaf66d259e6240d8a3ed489c43cc604d7f6","txCount":0,"balance":"0"},{"index":13,"address":"ckb1qyqw770rz0tlkyfgk54ga5nf3dqdxk76a7lst37htu","wif":"0xd00dfab1e14196d4bac6face7f0855cc5e84037fe66f86b6d8aae87c6c52e8de","publicKey":"0x031a2f412654d5e1926fdc5528c9cb8a1c279cd4e59fe3c187aeaf719b45737528","privateKey":"0xd00dfab1e14196d4bac6face7f0855cc5e84037fe66f86b6d8aae87c6c52e8de","txCount":0,"balance":"0"},{"index":14,"address":"ckb1qyqtkwgr84k2m29twgq0zw4zqlc9xj2tj2lsxnkh2p","wif":"0x25eae25b8c7481169ff6ec5be8c642b69af40801fbee70305072418df54749eb","publicKey":"0x025a4df278b278361257e4f413bbd7269b08c8c57f0ad3a956858140be11b0d54d","privateKey":"0x25eae25b8c7481169ff6ec5be8c642b69af40801fbee70305072418df54749eb","txCount":0,"balance":"0"},{"index":15,"address":"ckb1qyqpcnet67s5mgqlpuhuaxepjzkjre38mhjs9zqc63","wif":"0xb81b08b015a865b07ec360eaf213ec89a3f4c8304e649277018451cab0cd3c20","publicKey":"0x0341526dd676f561aa0d2cfb2909ea26cece4b0b6b7d119706e1874122557c94d4","privateKey":"0xb81b08b015a865b07ec360eaf213ec89a3f4c8304e649277018451cab0cd3c20","txCount":0,"balance":"0"},{"index":16,"address":"ckb1qyqg3n7ce44sh23qth84dm9ecqj5wc6r0eqsrldevf","wif":"0xa906b985ec65c055d8940e4e08f599a6bbc1c1c50bca8d264d165ed12699130f","publicKey":"0x030cab91387c6dd8e6d6351580ad70489f5e49452c277fe80925e4dee534e65625","privateKey":"0xa906b985ec65c055d8940e4e08f599a6bbc1c1c50bca8d264d165ed12699130f","txCount":0,"balance":"0"},{"index":17,"address":"ckb1qyqglw4sh98zl6mjsnn2extzn3n0gvfxv6us3m35kz","wif":"0xb52b6cf7246c4abe3ae92c1acd7c7ea3512a3166a4b362a37948456077751fff","publicKey":"0x028e2fd80e7e2a80b13419fc340f3d69a62686ebbac5923f1549aa1e3fbcea6ad5","privateKey":"0xb52b6cf7246c4abe3ae92c1acd7c7ea3512a3166a4b362a37948456077751fff","txCount":0,"balance":"0"},{"index":18,"address":"ckb1qyq067aljvt2nggm0zeau29pjmzwj6utvf0sa2azsw","wif":"0x707112819fa796c227084bc3e0aebbf29ac115675a08bf5eac28e6007f05ad28","publicKey":"0x0209dd45e67ffe75a47b1b6e719f4b9a9167b35b85bb2b285536f56feaa42ebd61","privateKey":"0x707112819fa796c227084bc3e0aebbf29ac115675a08bf5eac28e6007f05ad28","txCount":0,"balance":"0"},{"index":19,"address":"ckb1qyqfkqshyet89a493tmg7txncxnflj9rxttsv7p9jq","wif":"0x030e651a45432bb4c56853b6d344c2a8d3af4e7b8981420c3c9a401c5457c1c2","publicKey":"0x02a0b9e9bd853ddee1d636f9ebceec736809cd3b4dbe621f7f1a9a36755a075e93","privateKey":"0x030e651a45432bb4c56853b6d344c2a8d3af4e7b8981420c3c9a401c5457c1c2","txCount":0,"balance":"0"}],"change":[{"index":0,"address":"ckb1qyq2h765885q8xmr4s6evgl3a3tmq9hjd5lqtkupt9","wif":"0x9192af47118684e396ab3c865b0a9143a2a200bfe0edbed62a39ecea1962d87e","publicKey":"0x0254f2e669533a1512946b8100129ad5f5127e6c2badd1796f40ebf8f87c554221","privateKey":"0x9192af47118684e396ab3c865b0a9143a2a200bfe0edbed62a39ecea1962d87e","txCount":0,"balance":"0"},{"index":1,"address":"ckb1qyq244m2a97m0ll6a86yq9nrdm7umjvu592q3mph6y","wif":"0x507ff03e51fe91247cb4faba569b7920f622c890e237fd3f20aee7791496db4d","publicKey":"0x038baecb2ac9ac774ee5672d68295376665ef8bd3c51cb30ec2871984e9d3ab6db","privateKey":"0x507ff03e51fe91247cb4faba569b7920f622c890e237fd3f20aee7791496db4d","txCount":0,"balance":"0"},{"index":2,"address":"ckb1qyqvt73jpw3lckm4znvm8q2nlncf46cccles8tev5m","wif":"0xad2eb97c9fb6b53457f2d5314ddfeb599c1983774890053799dcb1f3c247f3ad","publicKey":"0x02c6d5f6c1d147790d882054afeb1aecb8bbd339c36db400e46b16329ceef3775c","privateKey":"0xad2eb97c9fb6b53457f2d5314ddfeb599c1983774890053799dcb1f3c247f3ad","txCount":0,"balance":"0"},{"index":3,"address":"ckb1qyqt7pqedr46akrgl9yxlz99wlyu564lm25sdc4cvp","wif":"0x44eb5a235e4502ef5c5dd82b266cc284afb175f042462fc0e59d8aad4408474f","publicKey":"0x02144043b34ce42869fca29708e31a781f192a1827f53153f2f980c6573c9c26d6","privateKey":"0x44eb5a235e4502ef5c5dd82b266cc284afb175f042462fc0e59d8aad4408474f","txCount":0,"balance":"0"},{"index":4,"address":"ckb1qyqtnjympkq53ugeel5sz55whe7nhcladp2s4ygz29","wif":"0x204fc5f32f4ea16aff32b76cf0fc6a455ea84c0684738d098c6997c3e2688bcb","publicKey":"0x03b34171a19b234e9ed5ba1ca69f9f74946528dc65df712d74cf688e133ceb6abc","privateKey":"0x204fc5f32f4ea16aff32b76cf0fc6a455ea84c0684738d098c6997c3e2688bcb","txCount":0,"balance":"0"},{"index":5,"address":"ckb1qyqfqnnh3jujjk0kf9zxkj85mzeh4udvnx6qs7mequ","wif":"0x74ff113354c5aed6afd5b41ba93abb8d92637a0325f5fe5928642064383e4efc","publicKey":"0x028c0b0a9f4549b117281ccc60912916d965a396f27c469ee5052f74381b869c7f","privateKey":"0x74ff113354c5aed6afd5b41ba93abb8d92637a0325f5fe5928642064383e4efc","txCount":0,"balance":"0"},{"index":6,"address":"ckb1qyqtc5p6hdm470832s65fujhdhfzfvtv7x6qjfdktj","wif":"0x5ab91b7d01a991ff35846d757ec17354e5e068729715b7b611f1cb575ec113be","publicKey":"0x02ac7acfe0ea678200950d18148fac498fcd26552b45430b822d5c515679853b82","privateKey":"0x5ab91b7d01a991ff35846d757ec17354e5e068729715b7b611f1cb575ec113be","txCount":0,"balance":"0"},{"index":7,"address":"ckb1qyq054ldlmnyy388e28quh8v8t93ptt33a2s44fgc3","wif":"0xce98ab72a19cc6132561209467746aefec6ca5f3ce00f26f44aa2304a67488fb","publicKey":"0x036a91b10037fd712d4687e213eda590c3bdc76033795517bbc903c1a21786123d","privateKey":"0xce98ab72a19cc6132561209467746aefec6ca5f3ce00f26f44aa2304a67488fb","txCount":0,"balance":"0"},{"index":8,"address":"ckb1qyqye7cfqlq56xg66p0fpv0r79p8zd68vnyqnwtdlp","wif":"0x432e03d53946a76be5adc59e7f010c786c38a140245e6c591f773745ba9067ac","publicKey":"0x03038bee9b1d292bc50459aeca2dc7b663f5e3efab1bf1dbbc6ff65fc468cdd512","privateKey":"0x432e03d53946a76be5adc59e7f010c786c38a140245e6c591f773745ba9067ac","txCount":0,"balance":"0"},{"index":9,"address":"ckb1qyqgphkrk8hxl39swedgq58c8d475279q7hspgdkut","wif":"0x979ca372eba323d5a32ae809dc95ec1fa996530bf18b1453fc0d8d5775ab4b9b","publicKey":"0x03db28c1607c25e209b955dbb1d43761521332b05352e25b5b63cf2363fe4f5159","privateKey":"0x979ca372eba323d5a32ae809dc95ec1fa996530bf18b1453fc0d8d5775ab4b9b","txCount":0,"balance":"0"},{"index":10,"address":"ckb1qyqw95tw5pd96hxhwtuml3m68m9xh26mrlhqucf04u","wif":"0x83b2986bd3974b76f269fd15b18574732adcd335e89aafda91f9149b80631cbc","publicKey":"0x026aa896a6ef2783001939354e39b202656b06a0a2e5d8f84c83780a68a8c4dfff","privateKey":"0x83b2986bd3974b76f269fd15b18574732adcd335e89aafda91f9149b80631cbc","txCount":0,"balance":"0"},{"index":11,"address":"ckb1qyqyfmhdtnnsljljdk0hp2lhwprpjwjhe7jqnj9qnd","wif":"0x28f4d598c6bc994b12a48937d72f11b79f8dcfe3f320b576de59f4576d6370f6","publicKey":"0x031ca4ebbb4eeb1f59fb5d31889d9641e931a5bbf7bf20388ed56c6d344de6da39","privateKey":"0x28f4d598c6bc994b12a48937d72f11b79f8dcfe3f320b576de59f4576d6370f6","txCount":0,"balance":"0"},{"index":12,"address":"ckb1qyq0y8k63s2599k27wqajyuf3aq2vdw2y0vsr4x5ke","wif":"0xb47d5d1096abb906a9e0465ed5d66ed168bc477b39d719f3884546ebd68e0973","publicKey":"0x03e54e734fe8be727ca39204b46da8c69c0e523996253cedd364a81d965b8b834d","privateKey":"0xb47d5d1096abb906a9e0465ed5d66ed168bc477b39d719f3884546ebd68e0973","txCount":0,"balance":"0"},{"index":13,"address":"ckb1qyq9pxh5vc60mttdwakd7rxnne5k7mzmrp4qslrmmm","wif":"0x9a92d5a999e36000fd671c4f9398d401f7f60f86dfdd0fcffabbf306fde64161","publicKey":"0x0309defdf5ba1e3f70e5d3a5a6f2ce41daab59ac2932013e012c526b51e40f413c","privateKey":"0x9a92d5a999e36000fd671c4f9398d401f7f60f86dfdd0fcffabbf306fde64161","txCount":0,"balance":"0"},{"index":14,"address":"ckb1qyqqlvsqcxvxmgrfy2qhrat0pqm0ppry543s2362wj","wif":"0xa4d9abd810877f07cc40085b0b5f870b90ec8209445262fa7c0747c4ae699d32","publicKey":"0x02a8b68969a6cac9f279cada0f3998e36e90ec303ae41fb587ac2a6ba3f47e1d84","privateKey":"0xa4d9abd810877f07cc40085b0b5f870b90ec8209445262fa7c0747c4ae699d32","txCount":0,"balance":"0"},{"index":15,"address":"ckb1qyqtypugec3ej68lvaz4hthjm5q6szp4zw9s0wgndu","wif":"0xd12d8f8c4579fd9998aac08f53d46826af3b4482042c67582e456702824bd1bc","publicKey":"0x02a4fdb483d7b21d275e4178662102afed86886a70bd3b5c97ac2e1e4a63487e41","privateKey":"0xd12d8f8c4579fd9998aac08f53d46826af3b4482042c67582e456702824bd1bc","txCount":0,"balance":"0"},{"index":16,"address":"ckb1qyqrxnd6ckjruf73m66dljy9yvcvl276x02qu4psgj","wif":"0x40fe768552b998866cd48eb483fbf064f86b7d93cbff7d6199a3306277800add","publicKey":"0x02fe5d602d9c612e02ed8a800f3af98501a09fa14f64725927792a745fbd3acea4","privateKey":"0x40fe768552b998866cd48eb483fbf064f86b7d93cbff7d6199a3306277800add","txCount":0,"balance":"0"},{"index":17,"address":"ckb1qyqf3dz8n5f56lzxp5cgmy9cr7zfxpqcjtlq44hrha","wif":"0x3c93cda007af1ef598d42fa8b29118eef9f9fec9b32392553a48be94da7a8989","publicKey":"0x03fa2c51249c86ee2faff2eaf98fe934e72ebeb2412235701ef83d85816e958bd3","privateKey":"0x3c93cda007af1ef598d42fa8b29118eef9f9fec9b32392553a48be94da7a8989","txCount":0,"balance":"0"},{"index":18,"address":"ckb1qyqg6rlx2yt6q7k43pz4vjc63vwsxfndhtxqjqvf5a","wif":"0x9585f44aeb12bfd573cdf6253dc931ce29c17735efff4c03f9c8dd7e1451ca6d","publicKey":"0x03d4ca1d083c214fce102ff49e8135e39acfe68d865da072779f0d430866ae43bc","privateKey":"0x9585f44aeb12bfd573cdf6253dc931ce29c17735efff4c03f9c8dd7e1451ca6d","txCount":0,"balance":"0"},{"index":19,"address":"ckb1qyq2g8yf4r84ymv8u2at5hmezajxw3hfwjqqelwfua","wif":"0x82bc12dd7d9eb50e0e1aa72b690d74159d8381b09c1eda6b758615046c75d799","publicKey":"0x03dcaf7befbf095f66455d079abb11a3d4752e7ee54a870d93dff19cfa4ba93893","privateKey":"0x82bc12dd7d9eb50e0e1aa72b690d74159d8381b09c1eda6b758615046c75d799","txCount":0,"balance":"0"}]}')
      })

      expect(hdwallet).toEqual(expect.HDWallet({
        mnemonic: MNEMONIC.word,
        path: MNEMONIC.path,
      }))
      expect(hdwallet.receiving.length).toBe(20)
      expect(hdwallet.change.length).toBe(20)
    })
  })
})
