import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Ajax = await import('../src/parts/Ajax/Ajax.js')

const GitHubRestApi = await import(
  '../src/parts/GitHubRestApi/GitHubRestApi.js'
)

beforeAll(() => {
  // @ts-ignore https://github.com/jsdom/jsdom/issues/1724
  globalThis.Response = class {
    constructor(value, init) {
      this.value = value
      this.init = init
    }

    async json() {
      return JSON.parse(this.value)
    }
  }
})

afterAll(() => {
  // @ts-ignore
  delete globalThis.Response
})

test('readGitHubDirectory', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return {
      sha: '1b429e743255d7b5a628c8267da990dae74a865c',
      url: 'https://api.github.com/repos/microsoft/vscode/git/trees/1b429e743255d7b5a628c8267da990dae74a865c',
      tree: [
        {
          path: '.devcontainer',
          mode: '040000',
          type: 'tree',
          sha: '9c3e79c7fedd05f1eb5cb5ee9d7c3099b39092e3',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9c3e79c7fedd05f1eb5cb5ee9d7c3099b39092e3',
        },
        {
          path: '.editorconfig',
          mode: '100644',
          type: 'blob',
          sha: 'e7e99b5bcb5209057e262ff462c94a87800cc5f0',
          size: 365,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/e7e99b5bcb5209057e262ff462c94a87800cc5f0',
        },
        {
          path: '.eslintignore',
          mode: '100644',
          type: 'blob',
          sha: '27603af2b5bfe0097905a367a52b48b6059c9b5f',
          size: 1069,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/27603af2b5bfe0097905a367a52b48b6059c9b5f',
        },
        {
          path: '.eslintrc.json',
          mode: '100644',
          type: 'blob',
          sha: '26e182bca3121803f48e92f0e33b8afb0541be14',
          size: 15048,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/26e182bca3121803f48e92f0e33b8afb0541be14',
        },
        {
          path: '.git-blame-ignore',
          mode: '100644',
          type: 'blob',
          sha: '24b19f36c3078dae3dce15df17572fc525716418',
          size: 699,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/24b19f36c3078dae3dce15df17572fc525716418',
        },
        {
          path: '.gitattributes',
          mode: '100644',
          type: 'blob',
          sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
          size: 167,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
        },
        {
          path: '.github',
          mode: '040000',
          type: 'tree',
          sha: '9ad4a172f384bd7389b5c9a945060962933bcf4d',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9ad4a172f384bd7389b5c9a945060962933bcf4d',
        },
        {
          path: '.gitignore',
          mode: '100644',
          type: 'blob',
          sha: '738d6793fa9d5db6ec43745ca4c4720b94924b27',
          size: 215,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
        },
        {
          path: '.lsifrc.json',
          mode: '100644',
          type: 'blob',
          sha: '5b992e89ca8b2b6be4d6d9acdd9dfb29caea0728',
          size: 116,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/5b992e89ca8b2b6be4d6d9acdd9dfb29caea0728',
        },
        {
          path: '.mailmap',
          mode: '100644',
          type: 'blob',
          sha: 'd4542abf73c17dbb2d808e8b06236c03a3f09a3b',
          size: 412,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/d4542abf73c17dbb2d808e8b06236c03a3f09a3b',
        },
        {
          path: '.mention-bot',
          mode: '100644',
          type: 'blob',
          sha: 'ea1a170775a7c2778f2ff80e1232147cf62d911e',
          size: 153,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/ea1a170775a7c2778f2ff80e1232147cf62d911e',
        },
        {
          path: '.vscode',
          mode: '040000',
          type: 'tree',
          sha: '4627e9cb1df7f9396a4dd2f8f668f5e6a4ec8bfa',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/4627e9cb1df7f9396a4dd2f8f668f5e6a4ec8bfa',
        },
        {
          path: '.yarnrc',
          mode: '100644',
          type: 'blob',
          sha: '481bf7bfa46daf06480fa43375149aec33aca9c3',
          size: 101,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/481bf7bfa46daf06480fa43375149aec33aca9c3',
        },
        {
          path: 'CONTRIBUTING.md',
          mode: '100644',
          type: 'blob',
          sha: 'b96e077aa67eaffdc4590e81d4fc1b863e4f3fbc',
          size: 5696,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/b96e077aa67eaffdc4590e81d4fc1b863e4f3fbc',
        },
        {
          path: 'LICENSE.txt',
          mode: '100644',
          type: 'blob',
          sha: '0ac28ee234d232ac0691f39cebf95bf6b2a763a5',
          size: 1088,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/0ac28ee234d232ac0691f39cebf95bf6b2a763a5',
        },
        {
          path: 'README.md',
          mode: '100644',
          type: 'blob',
          sha: 'f6e8f39e2d5c4fe8fd4167eff36603c50d979e27',
          size: 6292,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6e8f39e2d5c4fe8fd4167eff36603c50d979e27',
        },
        {
          path: 'SECURITY.md',
          mode: '100644',
          type: 'blob',
          sha: 'a050f362c1528508093c19072be352443de4b926',
          size: 2780,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/a050f362c1528508093c19072be352443de4b926',
        },
        {
          path: 'ThirdPartyNotices.txt',
          mode: '100644',
          type: 'blob',
          sha: '83a9e45c392e2bad8ae24b426b1a06cb0b94b4b1',
          size: 174422,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/83a9e45c392e2bad8ae24b426b1a06cb0b94b4b1',
        },
        {
          path: 'build',
          mode: '040000',
          type: 'tree',
          sha: 'c7ccaedf5cde629d3a481ae0b76e2777714ee0b2',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/c7ccaedf5cde629d3a481ae0b76e2777714ee0b2',
        },
        {
          path: 'cglicenses.json',
          mode: '100644',
          type: 'blob',
          sha: 'e969eb826e9a53c525dac077e9e188224804325a',
          size: 10233,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/e969eb826e9a53c525dac077e9e188224804325a',
        },
        {
          path: 'cgmanifest.json',
          mode: '100644',
          type: 'blob',
          sha: '62bb0a3718d4204dbbca350ea7a503233d27e5b0',
          size: 25254,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/62bb0a3718d4204dbbca350ea7a503233d27e5b0',
        },
        {
          path: 'extensions',
          mode: '040000',
          type: 'tree',
          sha: '20308edf74e9713edf9ae557dd4995a7929cd8d3',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/20308edf74e9713edf9ae557dd4995a7929cd8d3',
        },
        {
          path: 'gulpfile.js',
          mode: '100644',
          type: 'blob',
          sha: '9691ba80607abd11c77a3ae791da903c64bc4fcc',
          size: 382,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/9691ba80607abd11c77a3ae791da903c64bc4fcc',
        },
        {
          path: 'package.json',
          mode: '100644',
          type: 'blob',
          sha: '9b1f2679a347a9a80b5f837483c6376a7e48ae3c',
          size: 9113,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/9b1f2679a347a9a80b5f837483c6376a7e48ae3c',
        },
        {
          path: 'product.json',
          mode: '100644',
          type: 'blob',
          sha: '15aa2da235e88acf332ae29dc4603dc336d2d51f',
          size: 3335,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/15aa2da235e88acf332ae29dc4603dc336d2d51f',
        },
        {
          path: 'remote',
          mode: '040000',
          type: 'tree',
          sha: '3fb053983b051f7246c126c6512dd98293b16c60',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/3fb053983b051f7246c126c6512dd98293b16c60',
        },
        {
          path: 'resources',
          mode: '040000',
          type: 'tree',
          sha: '0db3b58f2a9ef7852c20cfae44d12753a59e33f3',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/0db3b58f2a9ef7852c20cfae44d12753a59e33f3',
        },
        {
          path: 'scripts',
          mode: '040000',
          type: 'tree',
          sha: '143d95e2b847a394237bbeb28b9e4e51f2ff3c90',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/143d95e2b847a394237bbeb28b9e4e51f2ff3c90',
        },
        {
          path: 'src',
          mode: '040000',
          type: 'tree',
          sha: 'c56accd958c775a6e2b4bc6c82a80c6e2b240dba',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/c56accd958c775a6e2b4bc6c82a80c6e2b240dba',
        },
        {
          path: 'test',
          mode: '040000',
          type: 'tree',
          sha: '9391ccf5453a0d72b7de901a44b5dbf6b4c5b25d',
          url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9391ccf5453a0d72b7de901a44b5dbf6b4c5b25d',
        },
        {
          path: 'tsfmt.json',
          mode: '100644',
          type: 'blob',
          sha: '741eb1e55278c59f948d49bc1ac4ef390f5fb32b',
          size: 746,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/741eb1e55278c59f948d49bc1ac4ef390f5fb32b',
        },
        {
          path: 'yarn.lock',
          mode: '100644',
          type: 'blob',
          sha: '871e4e4940fd50fa8f6c5f258e89f32e8ea057a7',
          size: 541472,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/871e4e4940fd50fa8f6c5f258e89f32e8ea057a7',
        },
      ],
      truncated: false,
    }
  })
  expect(
    await GitHubRestApi.readGitHubDirectory('microsoft', 'vscode', 'main', '')
  ).toEqual({
    sha: '1b429e743255d7b5a628c8267da990dae74a865c',
    url: 'https://api.github.com/repos/microsoft/vscode/git/trees/1b429e743255d7b5a628c8267da990dae74a865c',
    tree: [
      {
        path: '.devcontainer',
        mode: '040000',
        type: 'tree',
        sha: '9c3e79c7fedd05f1eb5cb5ee9d7c3099b39092e3',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9c3e79c7fedd05f1eb5cb5ee9d7c3099b39092e3',
      },
      {
        path: '.editorconfig',
        mode: '100644',
        type: 'blob',
        sha: 'e7e99b5bcb5209057e262ff462c94a87800cc5f0',
        size: 365,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/e7e99b5bcb5209057e262ff462c94a87800cc5f0',
      },
      {
        path: '.eslintignore',
        mode: '100644',
        type: 'blob',
        sha: '27603af2b5bfe0097905a367a52b48b6059c9b5f',
        size: 1069,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/27603af2b5bfe0097905a367a52b48b6059c9b5f',
      },
      {
        path: '.eslintrc.json',
        mode: '100644',
        type: 'blob',
        sha: '26e182bca3121803f48e92f0e33b8afb0541be14',
        size: 15048,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/26e182bca3121803f48e92f0e33b8afb0541be14',
      },
      {
        path: '.git-blame-ignore',
        mode: '100644',
        type: 'blob',
        sha: '24b19f36c3078dae3dce15df17572fc525716418',
        size: 699,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/24b19f36c3078dae3dce15df17572fc525716418',
      },
      {
        path: '.gitattributes',
        mode: '100644',
        type: 'blob',
        sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
        size: 167,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
      },
      {
        path: '.github',
        mode: '040000',
        type: 'tree',
        sha: '9ad4a172f384bd7389b5c9a945060962933bcf4d',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9ad4a172f384bd7389b5c9a945060962933bcf4d',
      },
      {
        path: '.gitignore',
        mode: '100644',
        type: 'blob',
        sha: '738d6793fa9d5db6ec43745ca4c4720b94924b27',
        size: 215,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
      },
      {
        path: '.lsifrc.json',
        mode: '100644',
        type: 'blob',
        sha: '5b992e89ca8b2b6be4d6d9acdd9dfb29caea0728',
        size: 116,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/5b992e89ca8b2b6be4d6d9acdd9dfb29caea0728',
      },
      {
        path: '.mailmap',
        mode: '100644',
        type: 'blob',
        sha: 'd4542abf73c17dbb2d808e8b06236c03a3f09a3b',
        size: 412,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/d4542abf73c17dbb2d808e8b06236c03a3f09a3b',
      },
      {
        path: '.mention-bot',
        mode: '100644',
        type: 'blob',
        sha: 'ea1a170775a7c2778f2ff80e1232147cf62d911e',
        size: 153,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/ea1a170775a7c2778f2ff80e1232147cf62d911e',
      },
      {
        path: '.vscode',
        mode: '040000',
        type: 'tree',
        sha: '4627e9cb1df7f9396a4dd2f8f668f5e6a4ec8bfa',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/4627e9cb1df7f9396a4dd2f8f668f5e6a4ec8bfa',
      },
      {
        path: '.yarnrc',
        mode: '100644',
        type: 'blob',
        sha: '481bf7bfa46daf06480fa43375149aec33aca9c3',
        size: 101,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/481bf7bfa46daf06480fa43375149aec33aca9c3',
      },
      {
        path: 'CONTRIBUTING.md',
        mode: '100644',
        type: 'blob',
        sha: 'b96e077aa67eaffdc4590e81d4fc1b863e4f3fbc',
        size: 5696,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/b96e077aa67eaffdc4590e81d4fc1b863e4f3fbc',
      },
      {
        path: 'LICENSE.txt',
        mode: '100644',
        type: 'blob',
        sha: '0ac28ee234d232ac0691f39cebf95bf6b2a763a5',
        size: 1088,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/0ac28ee234d232ac0691f39cebf95bf6b2a763a5',
      },
      {
        path: 'README.md',
        mode: '100644',
        type: 'blob',
        sha: 'f6e8f39e2d5c4fe8fd4167eff36603c50d979e27',
        size: 6292,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6e8f39e2d5c4fe8fd4167eff36603c50d979e27',
      },
      {
        path: 'SECURITY.md',
        mode: '100644',
        type: 'blob',
        sha: 'a050f362c1528508093c19072be352443de4b926',
        size: 2780,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/a050f362c1528508093c19072be352443de4b926',
      },
      {
        path: 'ThirdPartyNotices.txt',
        mode: '100644',
        type: 'blob',
        sha: '83a9e45c392e2bad8ae24b426b1a06cb0b94b4b1',
        size: 174422,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/83a9e45c392e2bad8ae24b426b1a06cb0b94b4b1',
      },
      {
        path: 'build',
        mode: '040000',
        type: 'tree',
        sha: 'c7ccaedf5cde629d3a481ae0b76e2777714ee0b2',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/c7ccaedf5cde629d3a481ae0b76e2777714ee0b2',
      },
      {
        path: 'cglicenses.json',
        mode: '100644',
        type: 'blob',
        sha: 'e969eb826e9a53c525dac077e9e188224804325a',
        size: 10233,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/e969eb826e9a53c525dac077e9e188224804325a',
      },
      {
        path: 'cgmanifest.json',
        mode: '100644',
        type: 'blob',
        sha: '62bb0a3718d4204dbbca350ea7a503233d27e5b0',
        size: 25254,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/62bb0a3718d4204dbbca350ea7a503233d27e5b0',
      },
      {
        path: 'extensions',
        mode: '040000',
        type: 'tree',
        sha: '20308edf74e9713edf9ae557dd4995a7929cd8d3',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/20308edf74e9713edf9ae557dd4995a7929cd8d3',
      },
      {
        path: 'gulpfile.js',
        mode: '100644',
        type: 'blob',
        sha: '9691ba80607abd11c77a3ae791da903c64bc4fcc',
        size: 382,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/9691ba80607abd11c77a3ae791da903c64bc4fcc',
      },
      {
        path: 'package.json',
        mode: '100644',
        type: 'blob',
        sha: '9b1f2679a347a9a80b5f837483c6376a7e48ae3c',
        size: 9113,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/9b1f2679a347a9a80b5f837483c6376a7e48ae3c',
      },
      {
        path: 'product.json',
        mode: '100644',
        type: 'blob',
        sha: '15aa2da235e88acf332ae29dc4603dc336d2d51f',
        size: 3335,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/15aa2da235e88acf332ae29dc4603dc336d2d51f',
      },
      {
        path: 'remote',
        mode: '040000',
        type: 'tree',
        sha: '3fb053983b051f7246c126c6512dd98293b16c60',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/3fb053983b051f7246c126c6512dd98293b16c60',
      },
      {
        path: 'resources',
        mode: '040000',
        type: 'tree',
        sha: '0db3b58f2a9ef7852c20cfae44d12753a59e33f3',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/0db3b58f2a9ef7852c20cfae44d12753a59e33f3',
      },
      {
        path: 'scripts',
        mode: '040000',
        type: 'tree',
        sha: '143d95e2b847a394237bbeb28b9e4e51f2ff3c90',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/143d95e2b847a394237bbeb28b9e4e51f2ff3c90',
      },
      {
        path: 'src',
        mode: '040000',
        type: 'tree',
        sha: 'c56accd958c775a6e2b4bc6c82a80c6e2b240dba',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/c56accd958c775a6e2b4bc6c82a80c6e2b240dba',
      },
      {
        path: 'test',
        mode: '040000',
        type: 'tree',
        sha: '9391ccf5453a0d72b7de901a44b5dbf6b4c5b25d',
        url: 'https://api.github.com/repos/microsoft/vscode/git/trees/9391ccf5453a0d72b7de901a44b5dbf6b4c5b25d',
      },
      {
        path: 'tsfmt.json',
        mode: '100644',
        type: 'blob',
        sha: '741eb1e55278c59f948d49bc1ac4ef390f5fb32b',
        size: 746,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/741eb1e55278c59f948d49bc1ac4ef390f5fb32b',
      },
      {
        path: 'yarn.lock',
        mode: '100644',
        type: 'blob',
        sha: '871e4e4940fd50fa8f6c5f258e89f32e8ea057a7',
        size: 541472,
        url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/871e4e4940fd50fa8f6c5f258e89f32e8ea057a7',
      },
    ],
    truncated: false,
  })
  expect(Ajax.getJson).toHaveBeenCalledWith(
    'https://api.github.com/repos/microsoft/vscode/git/trees/main'
  )
})

test('readGithubFileWithUrl', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return {
      sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
      node_id:
        'MDQ6QmxvYjQxODgxOTAwOmY2MjYzMDk0ZDAxYTJkZTEyOWNjZWM4NTA1MTJjNTAzZWY5ZTI1YWU=',
      size: 167,
      url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
      content:
        'KiB0ZXh0PWF1dG8KCkxJQ0VOU0UudHh0IGVvbD1jcmxmClRoaXJkUGFydHlO\nb3RpY2VzLnR4dCBlb2w9Y3JsZgoKKi5iYXQgZW9sPWNybGYKKi5jbWQgZW9s\nPWNybGYKKi5wczEgZW9sPWxmCiouc2ggZW9sPWxmCioucnRmIC10ZXh0Cioq\nLyouanNvbiBsaW5ndWlzdC1sYW5ndWFnZT1qc29uYwo=\n',
      encoding: 'base64',
    }
  })
  expect(
    await GitHubRestApi.readGithubFileWithUrl(
      'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae'
    )
  ).toEqual({
    sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
    node_id:
      'MDQ6QmxvYjQxODgxOTAwOmY2MjYzMDk0ZDAxYTJkZTEyOWNjZWM4NTA1MTJjNTAzZWY5ZTI1YWU=',
    size: 167,
    url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
    content:
      'KiB0ZXh0PWF1dG8KCkxJQ0VOU0UudHh0IGVvbD1jcmxmClRoaXJkUGFydHlO\nb3RpY2VzLnR4dCBlb2w9Y3JsZgoKKi5iYXQgZW9sPWNybGYKKi5jbWQgZW9s\nPWNybGYKKi5wczEgZW9sPWxmCiouc2ggZW9sPWxmCioucnRmIC10ZXh0Cioq\nLyouanNvbiBsaW5ndWlzdC1sYW5ndWFnZT1qc29uYwo=\n',
    encoding: 'base64',
  })
  expect(Ajax.getJson).toHaveBeenCalledWith(
    'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae'
  )
})

test('readGithubFileWithUrl - error - too many requests', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(async () => {
    throw new Error(
      'Failed to request json from "https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae": API rate limit exceeded for 0.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
    )
  })
  await expect(
    GitHubRestApi.readGithubFileWithUrl(
      'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae'
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to request json from "https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae": API rate limit exceeded for 0.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
    )
  )
})

test('readFile', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return {
      name: '.gitignore',
      path: '.gitignore',
      sha: '738d6793fa9d5db6ec43745ca4c4720b94924b27',
      size: 215,
      url: 'https://api.github.com/repos/microsoft/vscode/contents/.gitignore?ref=main',
      html_url: 'https://github.com/microsoft/vscode/blob/main/.gitignore',
      git_url:
        'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
      download_url:
        'https://raw.githubusercontent.com/microsoft/vscode/main/.gitignore',
      type: 'file',
      content:
        'LkRTX1N0b3JlCi5jYWNoZQpucG0tZGVidWcubG9nClRodW1icy5kYgpub2Rl\nX21vZHVsZXMvCi5idWlsZC8KZXh0ZW5zaW9ucy8qKi9kaXN0Lwovb3V0Ki8K\nL2V4dGVuc2lvbnMvKiovb3V0LwpidWlsZC9ub2RlX21vZHVsZXMKY292ZXJh\nZ2UvCnRlc3RfZGF0YS8KdGVzdC1yZXN1bHRzLwp5YXJuLWVycm9yLmxvZwp2\nc2NvZGUubHNpZgp2c2NvZGUuZGIKLy5wcm9maWxlLW9zcwo=\n',
      encoding: 'base64',
      _links: {
        self: 'https://api.github.com/repos/microsoft/vscode/contents/.gitignore?ref=main',
        git: 'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
        html: 'https://github.com/microsoft/vscode/blob/main/.gitignore',
      },
    }
  })
  expect(
    await GitHubRestApi.readFile('microsoft', 'vscode', '.gitignore')
  ).toEqual({
    name: '.gitignore',
    path: '.gitignore',
    sha: '738d6793fa9d5db6ec43745ca4c4720b94924b27',
    size: 215,
    url: 'https://api.github.com/repos/microsoft/vscode/contents/.gitignore?ref=main',
    html_url: 'https://github.com/microsoft/vscode/blob/main/.gitignore',
    git_url:
      'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
    download_url:
      'https://raw.githubusercontent.com/microsoft/vscode/main/.gitignore',
    type: 'file',
    content:
      'LkRTX1N0b3JlCi5jYWNoZQpucG0tZGVidWcubG9nClRodW1icy5kYgpub2Rl\nX21vZHVsZXMvCi5idWlsZC8KZXh0ZW5zaW9ucy8qKi9kaXN0Lwovb3V0Ki8K\nL2V4dGVuc2lvbnMvKiovb3V0LwpidWlsZC9ub2RlX21vZHVsZXMKY292ZXJh\nZ2UvCnRlc3RfZGF0YS8KdGVzdC1yZXN1bHRzLwp5YXJuLWVycm9yLmxvZwp2\nc2NvZGUubHNpZgp2c2NvZGUuZGIKLy5wcm9maWxlLW9zcwo=\n',
    encoding: 'base64',
    _links: {
      self: 'https://api.github.com/repos/microsoft/vscode/contents/.gitignore?ref=main',
      git: 'https://api.github.com/repos/microsoft/vscode/git/blobs/738d6793fa9d5db6ec43745ca4c4720b94924b27',
      html: 'https://github.com/microsoft/vscode/blob/main/.gitignore',
    },
  })
  expect(Ajax.getJson).toHaveBeenCalledWith(
    'https://api.github.com/repos/microsoft/vscode/contents/.gitignore'
  )
})
