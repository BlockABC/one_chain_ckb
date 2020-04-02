---
title: Data Type
lang: en-US
-----------

在与区块链打交道时数据类型是需要额外关注的地方，它不仅要求正确的类型，如 `number,
string`，还有可能要求准确的精度、字符串编码等。
在调用接口传参时确保数据类型的正确将能为你剩下大把的调试时间。为此我们将所有后续文档中会涉及到的数据类型整理如下：

| Type | Description  |
| ---: | :----------- |
| Decimal.Value | 本项目中使用到了 [decimal.js](https://mikemcl.github.io/decimal.js/) 来处理金额相关计算，所以存在这个类型，它是这个类型的别名 `string | number | Decimal` 。注意当涉及金额时，变量的值必须代表一个整数，并且单位是 **shannon**，即必须是类似 `100, '100', new Decimal('100')` 的值 |
