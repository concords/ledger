module.exports = {
  lang: 'en-GB',
  title: 'Concords',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
    repo: 'teamconcords/concords',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: 'Blog',
        link: '/blog/index',
        activeMatch: '^/blog/'
      },
      // {
      //   text: '@teamconcords/ui-kit',
      //   link: '/guide/ui-kit',
      //   activeMatch: '^/guide/'
      // },
      // {
      //   text: '@teamconcords/use',
      //   link: '/guide/use',
      //   activeMatch: '^/guide/'
      // },
    ],

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'What is Concords?', link: '/guide/what-is-concords', activeMatch: '^/guide/what-is-concords/', },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Identity', link: '/guide/identity' },
        { text: 'Ledger', link: '/guide/ledger' },
        { text: 'Vue Kit', link: '/guide/vue-kit' },
      ]
    },
  ]
}
