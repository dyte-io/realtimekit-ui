const fs = require('fs');
const pkg = require('./package.json');

const dependencies = {
  ...pkg.dependencies,
  '@cloudflare/realtimekit-ui': pkg.version,
};

const env = (process.env.ENVIRONMENT || 'staging').replace('refs/heads/', '');

const tag = env === 'main' ? 'latest' : env;

fs.writeFileSync(
  './package.json',
  JSON.stringify(
    {
      ...pkg,
      license: undefined,
      dependencies,
      devDependencies: undefined,
      publishConfig:
        process.env.GHR === 'true' || !env.includes('main') ? { tag } : pkg.publishConfig,
      scripts: {
        postpublish: pkg.scripts.postpublish,
      },
    },
    null,
    2
  )
);
