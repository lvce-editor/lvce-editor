const gitHubUri = 'https://example.com'

export const mocks = [
  {
    url: gitHubUri,
    path: '/repos/github/gitignore/contents',
    method: 'GET',
    handle(req, res) {
      res.status(200).json([
        {
          name: '.github',
          path: '.github',
          sha: '62c5dc1e194bf628ff16c852f78ffc1eb0e40e44',
          size: 0,
          url: `${gitHubUri}/repos/github/gitignore/contents/.github?ref=main`,
          html_url: `${gitHubUri}/github/gitignore/tree/main/.github`,
          git_url: `${gitHubUri}/repos/github/gitignore/git/trees/62c5dc1e194bf628ff16c852f78ffc1eb0e40e44`,
          download_url: null,
          type: 'dir',
          _links: {
            self: `${gitHubUri}/repos/github/gitignore/contents/.github?ref=main`,
            git: `${gitHubUri}/repos/github/gitignore/git/trees/62c5dc1e194bf628ff16c852f78ffc1eb0e40e44`,
            html: `${gitHubUri}/github/gitignore/tree/main/.github`,
          },
        },
        {
          name: 'Android.gitignore',
          path: 'Android.gitignore',
          sha: '347e252ef10e9c2052ee2017c929530eb0afc5f1',
          size: 431,
          url: `${gitHubUri}/repos/github/gitignore/contents/Android.gitignore?ref=main`,
          html_url: `${gitHubUri}/github/gitignore/blob/main/Android.gitignore`,
          git_url: `${gitHubUri}/repos/github/gitignore/git/blobs/347e252ef10e9c2052ee2017c929530eb0afc5f1`,
          download_url: `${gitHubUri}/github/gitignore/main/Android.gitignore`,
          type: 'file',
          _links: {
            self: `${gitHubUri}/repos/github/gitignore/contents/Android.gitignore?ref=main`,
            git: `${gitHubUri}/repos/github/gitignore/git/blobs/347e252ef10e9c2052ee2017c929530eb0afc5f1`,
            html: `${gitHubUri}/github/gitignore/blob/main/Android.gitignore`,
          },
        },
      ])
    },
  },
]

const name = 'sample.mocking'

test('sample.mocking', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await Command.execute('xyz.sampleCommand')
})
