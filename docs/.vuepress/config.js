module.exports = {
  base: '/one_chain_ckb/',
  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    '@vuepress/nprogress',
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-162409766-1'
      }
    ]
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'One Chain CKB',
      description: 'One Chain CKB 是 BlockABC 团队为解决钱包开发中兼容 Nervos CKB 链而设计的 SDK 。',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'One Chain CKB',
      description: 'One Chain CKB 是 BlockABC 团队为解决钱包开发中兼容 Nervos CKB 链而设计的 SDK 。',
    },
  },
  themeConfig: {
    repo: 'BlockABC/one_chain_ckb',
    docsDir: 'docs',
    smoothScroll: true,
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        nav: [
          { text: 'Release Notes', link: 'https://github.com/BlockABC/one_chain_ckb/releases' },
        ],
        sidebar: [
          {
            title: 'Introduction',
            collapsable: false,
            sidebarDepth: 1,
            children: [
              '/',
              '/getting-started',
              '/datatype',
            ]
          },
          {
            title: 'Package',
            collapsable: false,
            sidebarDepth: 1,
            children: [
              '/package/core',
              '/package/ckb',
            ]
          },
        ]
      },
      '/zh-CN/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
          }
        },
        nav: [
          { text: '更新日志', link: 'https://github.com/BlockABC/one_chain_ckb/releases' },
        ],
        sidebar: [
          {
            title: '介绍',
            collapsable: false,
            sidebarDepth: 1,
            children: [
              '/zh-CN/',
              '/zh-CN/getting-started',
              '/zh-CN/datatype',
            ]
          },
          {
            title: 'Package',
            collapsable: false,
            sidebarDepth: 1,
            children: [
              '/zh-CN/package/core',
              '/zh-CN/package/ckb',
            ]
          },
        ]
      },
    }
  }
}
