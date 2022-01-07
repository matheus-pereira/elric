/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const i18n = require('./i18n');
const ArchivedVersions = require('./archivedVersions.json');

const elricThemeColor = '#15c213';

module.exports = {
  i18n,
  title: 'elric',
  titleDelimiter: '·',
  tagline: '🃏 Delightful JavaScript Testing',
  url: 'https://elricjs.io',
  baseUrl: '/',
  projectName: 'elric',
  favicon: 'img/favicon/favicon.ico',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // homePageId: 'getting-started',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          editUrl: ({locale, versionDocsDirPath, docPath}) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/elric-v2/${locale}`;
            }
            return `https://github.com/facebook/elric/edit/main/website/${versionDocsDirPath}/${docPath}`;
          },
          path: '../docs',
          sidebarPath: path.resolve(__dirname, './sidebars.json'),
        },
        blog: {
          path: 'blog',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: [
            path.resolve('src/css/docusaurusTheme.css'),
            path.resolve('src/css/algoliaDocSearchTheme.css'),
            path.resolve('src/components/v1/legacyCSS.css'),
            path.resolve('static/css/custom.css'),
            path.resolve('static/css/elric.css'),
          ],
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // for legacy v1 Docusaurus site: /api.html => /api
        fromExtensions: ['html'],
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/elric.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: `manifest.json`,
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#FFF',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/elric.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/elric.svg',
            color: elricThemeColor,
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/elric.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'elric',
      items: [
        // left items
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            ...Object.entries(ArchivedVersions).map(
              ([versionName, versionUrl]) => ({
                to: versionUrl,
                label: versionName,
              })
            ),
            {
              to: '/versions',
              label: 'All versions',
            },
          ],
        },
        // right items
        {
          label: 'Docs',
          type: 'doc',
          docId: 'getting-started',
          position: 'right',
        },
        {
          label: 'API',
          type: 'doc',
          docId: 'api',
          position: 'right',
        },
        {
          to: '/help',
          label: 'Help',
          position: 'right',
        },
        {to: 'blog', label: 'Blog', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://github.com/facebook/elric',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    image: 'img/opengraph.png',
    prism: {
      theme: require('./src/prism/themeLight'),
      darkTheme: require('./src/prism/themeDark'),
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Guides',
              to: '/docs/snapshot-testing',
            },
            {
              label: 'API Reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              to: 'https://stackoverflow.com/questions/tagged/elricjs',
            },
            {
              label: 'Reactiflux',
              to: 'https://www.reactiflux.com',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/fbelric',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              to: 'https://github.com/facebook/elric',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/fbelric',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy',
              href: 'https://opensource.facebook.com/legal/privacy/',
            },
            {
              label: 'Terms',
              href: 'https://opensource.facebook.com/legal/terms/',
            },
          ],
        },
      ],
      logo: {
        //         src: 'img/elric-outline.svg',
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
        href: 'https://opensource.facebook.com',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
    },
    algolia: {
      indexName: 'elric-v2',
      apiKey: '833906d7486e4059359fa58823c4ef56',
      contextualSearch: true,
    },
    gtag: {
      trackingID: 'UA-44373548-17',
    },
  },
};
