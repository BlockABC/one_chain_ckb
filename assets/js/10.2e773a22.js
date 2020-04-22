(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{336:function(t,s,a){"use strict";a.r(s);var n=a(19),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("hr"),t._v(" "),a("h2",{attrs:{id:"什么是-one-chain-ckb-？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#什么是-one-chain-ckb-？"}},[t._v("#")]),t._v(" 什么是 One Chain CKB ？")]),t._v(" "),a("p",[t._v("One Chain CKB 是 BlockABC 团队为解决钱包开发中兼容 Nervos CKB 链而设计的 SDK 。\n它是基于 "),a("a",{attrs:{href:"https://github.com/nervosnetwork/ckb-sdk-js",target:"_blank",rel:"noopener noreferrer"}},[t._v("ckb-sdk-js"),a("OutboundLink")],1),t._v(" 的封装。")]),t._v(" "),a("h2",{attrs:{id:"为什么需要它？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#为什么需要它？"}},[t._v("#")]),t._v(" 为什么需要它？")]),t._v(" "),a("h3",{attrs:{id:"简单地构建基于-cell-模型地交易"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#简单地构建基于-cell-模型地交易"}},[t._v("#")]),t._v(" 简单地构建基于 Cell 模型地交易")]),t._v(" "),a("p",[t._v("通过 @onechain/ckb 只需要知道地址和转账金额就可以构建 1 对 n，n 对 n 交易:")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" tx "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" ckb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buildTransaction")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  froms"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Addresses giving CKB")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" address"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'address_a'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" address"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'address_b'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  tos"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Addresses receiving CKB and value")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" address"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'address_c'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" value"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'6100000000'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" address"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'address_d'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" value"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'6100000000'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("这就是构建交易的全部代码！@onechain/ckb 会自动查询未花费的 Cell，然后基于一套健壮的 Cell 筛选算法构建交易。\n交易构建完成后，就可以通过交易对象轻易的获得交易的关键信息了：")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"right"}},[t._v("Properties")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.value")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("总到账 CKB")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.change")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("总找零 CKB")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.waste")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("因为低于 6100000000 shannon 而无法找零的 CKB")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.size")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("交易序列化后的二进制数据体积")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.fee")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("交易的矿工费")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.inputs")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("交易的输入")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"right"}},[t._v("tx.outputs")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("交易的输出")])])])]),t._v(" "),a("p",[t._v("矿工费怎么办？我应该支付多少？为了解决这个问题，@onechain/ckb 实现了一套精确的预估算法，\n你可以简单的设置矿工费费率而非具体的矿工费：")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[t._v("tx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("edit")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" feeRate"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// set transaction fee rate to 3 shannon/Byte")]),t._v("\n")])])]),a("h3",{attrs:{id:"构建未签名的交易，然后用冷钱包签名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#构建未签名的交易，然后用冷钱包签名"}},[t._v("#")]),t._v(" 构建未签名的交易，然后用冷钱包签名")]),t._v(" "),a("p",[t._v("@onechain/ckb 也可以不用公私钥对创建交易。首先创建一笔未签名的交易，然后在任何想要签名的时候通过冷钱包对其签名：")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" tx "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ckb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sign")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" transaction"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" unsignedTransaction"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" unspents"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" unspentsGetFromTxUnspents "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"轻轻松松支持-hd-钱包"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#轻轻松松支持-hd-钱包"}},[t._v("#")]),t._v(" 轻轻松松支持 HD 钱包")]),t._v(" "),a("p",[t._v("无需关注 HD 钱包的推导细节，却能直接得到 HD 钱包的公私钥对。 @onechain/ckb 会自动以一种优化过的方式查询地址状态，从而高效的完成地址推导:")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" hdwallet "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ckb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hdwalletFromMnemonic")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" mnemonic"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'your mnemonic words'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("m/44'/309'/0'")]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v("' "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"同时提供-commonjs-和-es6-模块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同时提供-commonjs-和-es6-模块"}},[t._v("#")]),t._v(" 同时提供 commonjs 和 es6 模块")]),t._v(" "),a("p",[t._v("无论你选择哪种模块系统，你都能轻松的引入这个库，因为在开发这个库的过程中我们已经面对过同样的问题，所以我们为未来使用这个库的后来者铺平了道路。")]),t._v(" "),a("h3",{attrs:{id:"提供-umd-模块以便直接在浏览器中使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提供-umd-模块以便直接在浏览器中使用"}},[t._v("#")]),t._v(" 提供 umd 模块以便直接在浏览器中使用")]),t._v(" "),a("p",[t._v("这是引入一个库最经典、健壮并且简单的方式，所以我们绝不会放弃它！")]),t._v(" "),a("h2",{attrs:{id:"安全性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安全性"}},[t._v("#")]),t._v(" 安全性")]),t._v(" "),a("blockquote",[a("p",[t._v("不要信任，亲自验证。")])]),t._v(" "),a("p",[t._v("我们推荐 @onechain/ckb 的每个用户都参与到代码的审计与验证中来。 BUG 总是存在，可用性也取决于用例，但是每次 issue 的上报和解决都能帮助这个库变得更好。")]),t._v(" "),a("p",[t._v("小心！ "),a("strong",[t._v("如果你要签名交易，那私钥就必定存在于运行时中")]),t._v("。 所以如果任何未知的脚本能在同样的上下文环境中运行，"),a("strong",[t._v("那私钥就有可能发生泄漏")]),t._v("！比如，你在\nDapp 开发中直接使用了这个 SDK 进行交易签名，当 Dapp 上线并运行在用户的浏览器中时，各种浏览器内运行的第三方插件都可以访问到你 Dapp 中用于签名的私钥。")])])}),[],!1,null,null,null);s.default=e.exports}}]);