module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: false },
          { type: 'test', release: false },
          { type: 'docs', release: false },
          { type: 'chore', release: false },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        writerOpts: {
          commitsSort: 'subject',
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'dist'],
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
  ],
};
