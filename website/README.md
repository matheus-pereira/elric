# elric website

The elric website is based on [Docusaurus 2](http://v2.docusaurus.io/).

## Run the dev server

You will need Node >=10.

The first time, get all the dependencies loaded via

```bash
yarn
```

in the root directory.

Fetch `backers.json` file by running

```bash
node fetchSupporters.js
```

Then, run the server via

```bash
yarn start
```

Note, you can also use `yarn workspace elric-website start` from the root of the elric monorepo.

## Publish the website

The site is deployed on each PR merged to main by Netlify:

- Netlify site: https://app.netlify.com/sites/elricjs
- Netlify url: https://elricjs.netlify.app
- Production url: https://elricjs.io

[![Netlify Status](https://api.netlify.com/api/v1/badges/4570042d-b147-40fd-84fc-3bfd63639af7/deploy-status)](https://app.netlify.com/sites/elricjs/deploys)

## Archive

An older Docusaurus v1 site exist for versions <= 25.x:

- Netlify site: https://app.netlify.com/sites/elric-archive
- Url: https://archive.elricjs.io
- GitHub branch: https://github.com/facebook/elric/tree/elric-website-v1
