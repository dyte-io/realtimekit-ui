const fs = require('fs');
const { devDependencies, license, publishConfig, ...pkg } = require('./package.json');

const env = (process.env.ENVIRONMENT || 'staging').replace('refs/heads/', '');

const tag = env === 'main' ? 'latest' : env;

console.log('prepublish:env', { env, tag, ghr: process.env.GHR });

fs.writeFileSync(
  './package.json',
  JSON.stringify(
    {
      ...pkg,
      publishConfig: process.env.GHR === 'true' || !env.includes('main') ? { tag } : publishConfig,
      scripts: {
        postpublish: pkg.scripts.postpublish,
      },
    },
    null,
    2
  )
);
