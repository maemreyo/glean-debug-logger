module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
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
