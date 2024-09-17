const baseConfig = {
  branches: [],
  tagFormat: '@dyte-in/ui-kit-v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/core/',
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/react-library/',
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/vue-library',
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/angular-library/projects/components',
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          './packages/core/package.json',
          './packages/react-library/package.json',
          './packages/vue-library/package.json',
          './packages/angular-library/projects/components/package.json',
          'CHANGELOG.md',
          'package.json',
          'package-lock.json',
          './packages/react-library/src/**/*.{js,ts,tsx}',
          './packages/vue-library/src/**/*.{js,ts,tsx}',
          './packages/angular-library/projects/components/src/**/*.{js,ts,tsx}'
        ],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}\n\n\nskip-checks: true',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.tgz'
      }
    ]
  ],
  repositoryUrl: 'https://github.com/dyte-io/ui-kit',
}

const config = {
  ...baseConfig,
  branches: ['main', { name: 'staging', prerelease: true }],
}

module.exports = config;
