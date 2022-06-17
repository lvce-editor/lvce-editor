/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Ajax from '../src/parts/Ajax/Ajax.js'
import * as FileSystemGitHub from '../src/parts/FileSystem/FileSystemGitHub.js'

beforeAll(() => {
  // see https://github.com/jsdom/jsdom/issues/1721#issuecomment-387279017
  if (typeof URL.createObjectURL === 'undefined') {
    Object.defineProperty(URL, 'createObjectURL', {
      value() {
        return 'test-blob-url'
      },
    })
  }
})

test('readDirWithFileTypes', async () => {
  Ajax.state.getJson = jest.fn(async () => {
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
    await FileSystemGitHub.readDirWithFileTypes(
      'github://',
      'github://microsoft/vscode'
    )
  ).toEqual([
    {
      name: '.devcontainer',
      type: 'folder',
    },
    {
      name: '.editorconfig',
      type: 'file',
    },
    {
      name: '.eslintignore',
      type: 'file',
    },
    {
      name: '.eslintrc.json',
      type: 'file',
    },
    {
      name: '.git-blame-ignore',
      type: 'file',
    },
    {
      name: '.gitattributes',
      type: 'file',
    },
    {
      name: '.github',
      type: 'folder',
    },
    {
      name: '.gitignore',
      type: 'file',
    },
    {
      name: '.lsifrc.json',
      type: 'file',
    },
    {
      name: '.mailmap',
      type: 'file',
    },
    {
      name: '.mention-bot',
      type: 'file',
    },
    {
      name: '.vscode',
      type: 'folder',
    },
    {
      name: '.yarnrc',
      type: 'file',
    },
    {
      name: 'CONTRIBUTING.md',
      type: 'file',
    },
    {
      name: 'LICENSE.txt',
      type: 'file',
    },
    {
      name: 'README.md',
      type: 'file',
    },
    {
      name: 'SECURITY.md',
      type: 'file',
    },
    {
      name: 'ThirdPartyNotices.txt',
      type: 'file',
    },
    {
      name: 'build',
      type: 'folder',
    },
    {
      name: 'cglicenses.json',
      type: 'file',
    },
    {
      name: 'cgmanifest.json',
      type: 'file',
    },
    {
      name: 'extensions',
      type: 'folder',
    },
    {
      name: 'gulpfile.js',
      type: 'file',
    },
    {
      name: 'package.json',
      type: 'file',
    },
    {
      name: 'product.json',
      type: 'file',
    },
    {
      name: 'remote',
      type: 'folder',
    },
    {
      name: 'resources',
      type: 'folder',
    },
    {
      name: 'scripts',
      type: 'folder',
    },
    {
      name: 'src',
      type: 'folder',
    },
    {
      name: 'test',
      type: 'folder',
    },
    {
      name: 'tsfmt.json',
      type: 'file',
    },
    {
      name: 'yarn.lock',
      type: 'file',
    },
  ])
  expect(FileSystemGitHub.state.cache['microsoft/vscode']).toBeDefined()
})

// TODO should throw better error message
test('readDirWithFileTypes - error', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    throw new Error('rate limiting exceeded')
  })
  await expect(
    FileSystemGitHub.readDirWithFileTypes(
      'github://',
      'github://microsoft/vscode'
    )
  ).rejects.toThrowError(
    // TODO test error.cause
    'Failed to request json from "https://api.github.com/repos/microsoft/vscode/git/trees/HEAD:": rate limiting exceeded'
  )
})

test('readFile', async () => {
  FileSystemGitHub.state.cache = {
    'microsoft/vscode': {
      sha: '1b429e743255d7b5a628c8267da990dae74a865c',
      url: 'https://api.github.com/repos/microsoft/vscode/git/trees/1b429e743255d7b5a628c8267da990dae74a865c',
      tree: [
        {
          path: '.gitattributes',
          mode: '100644',
          type: 'blob',
          sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
          size: 167,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
        },
      ],
      truncated: false,
    },
  }
  Ajax.state.getJson = jest.fn(async () => {
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
    await FileSystemGitHub.readFile(
      'github://',
      'github://microsoft/vscode/.gitattributes'
    )
  ).toBe(`* text=auto

LICENSE.txt eol=crlf
ThirdPartyNotices.txt eol=crlf

*.bat eol=crlf
*.cmd eol=crlf
*.ps1 eol=lf
*.sh eol=lf
*.rtf -text
**/*.json linguist-language=jsonc
`)
})

test('readFile - unicode decoding issue', async () => {
  FileSystemGitHub.state.cache = {
    'microsoft/vscode': {
      sha: '1b429e743255d7b5a628c8267da990dae74a865c',
      url: 'https://api.github.com/repos/microsoft/vscode/git/trees/1b429e743255d7b5a628c8267da990dae74a865c',
      tree: [
        {
          path: '.gitattributes',
          mode: '100644',
          type: 'blob',
          sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
          size: 167,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
        },
      ],
      truncated: false,
    },
  }
  Ajax.state.getJson = jest.fn(async () => {
    return {
      sha: '8a44ce8c7ac1b035770cd5a1e4e4c561c0530027',
      node_id:
        'MDQ6QmxvYjQxODgxOTAwOjhhNDRjZThjN2FjMWIwMzU3NzBjZDVhMWU0ZTRjNTYxYzA1MzAwMjc=',
      size: 1170,
      url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/8a44ce8c7ac1b035770cd5a1e4e4c561c0530027',
      content:
        'LS0tCm5hbWU6IEJ1ZyByZXBvcnQKYWJvdXQ6IENyZWF0ZSBhIHJlcG9ydCB0\nbyBoZWxwIHVzIGltcHJvdmUKLS0tCjwhLS0g4pqg77iP4pqg77iPIERvIE5v\ndCBEZWxldGUgVGhpcyEgYnVnX3JlcG9ydF90ZW1wbGF0ZSDimqDvuI/imqDv\nuI8gLS0+CjwhLS0gUGxlYXNlIHJlYWQgb3VyIFJ1bGVzIG9mIENvbmR1Y3Q6\nIGh0dHBzOi8vb3BlbnNvdXJjZS5taWNyb3NvZnQuY29tL2NvZGVvZmNvbmR1\nY3QvIC0tPgo8IS0tIPCfla4gUmVhZCBvdXIgZ3VpZGUgYWJvdXQgc3VibWl0\ndGluZyBpc3N1ZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvdnNj\nb2RlL3dpa2kvU3VibWl0dGluZy1CdWdzLWFuZC1TdWdnZXN0aW9ucyAtLT4K\nPCEtLSDwn5SOIFNlYXJjaCBleGlzdGluZyBpc3N1ZXMgdG8gYXZvaWQgY3Jl\nYXRpbmcgZHVwbGljYXRlcy4gLS0+CjwhLS0g8J+nqiBUZXN0IHVzaW5nIHRo\nZSBsYXRlc3QgSW5zaWRlcnMgYnVpbGQgdG8gc2VlIGlmIHlvdXIgaXNzdWUg\naGFzIGFscmVhZHkgYmVlbiBmaXhlZDogaHR0cHM6Ly9jb2RlLnZpc3VhbHN0\ndWRpby5jb20vaW5zaWRlcnMvIC0tPgo8IS0tIPCfkqEgSW5zdGVhZCBvZiBj\ncmVhdGluZyB5b3VyIHJlcG9ydCBoZXJlLCB1c2UgJ1JlcG9ydCBJc3N1ZScg\nZnJvbSB0aGUgJ0hlbHAnIG1lbnUgaW4gVlMgQ29kZSB0byBwcmUtZmlsbCB1\nc2VmdWwgaW5mb3JtYXRpb24uIC0tPgo8IS0tIPCflKcgTGF1bmNoIHdpdGgg\nYGNvZGUgLS1kaXNhYmxlLWV4dGVuc2lvbnNgIHRvIGNoZWNrLiAtLT4KRG9l\ncyB0aGlzIGlzc3VlIG9jY3VyIHdoZW4gYWxsIGV4dGVuc2lvbnMgYXJlIGRp\nc2FibGVkPzogWWVzL05vCgo8IS0tIPCfqpMgSWYgeW91IGFuc3dlcmVkIE5v\nIGFib3ZlLCB1c2UgJ0hlbHA6IFN0YXJ0IEV4dGVuc2lvbiBCaXNlY3QnIGZy\nb20gQ29tbWFuZCBQYWxldHRlIHRvIHRyeSB0byBpZGVudGlmeSB0aGUgY2F1\nc2UuIC0tPgo8IS0tIPCfk6MgSXNzdWVzIGNhdXNlZCBieSBhbiBleHRlbnNp\nb24gbmVlZCB0byBiZSByZXBvcnRlZCBkaXJlY3RseSB0byB0aGUgZXh0ZW5z\naW9uIHB1Ymxpc2hlci4gVGhlICdIZWxwID4gUmVwb3J0IElzc3VlJyBkaWFs\nb2cgY2FuIGFzc2lzdCB3aXRoIHRoaXMuIC0tPgotIFZTIENvZGUgVmVyc2lv\nbjoKLSBPUyBWZXJzaW9uOgoKU3RlcHMgdG8gUmVwcm9kdWNlOgoKMS4KMi4K\n',
      encoding: 'base64',
    }
  })
  expect(
    await FileSystemGitHub.readFile(
      'github://',
      'github://microsoft/vscode/.gitattributes'
    )
  ).toBe(`---
name: Bug report
about: Create a report to help us improve
---
<!-- ⚠️⚠️ Do Not Delete This! bug_report_template ⚠️⚠️ -->
<!-- Please read our Rules of Conduct: https://opensource.microsoft.com/codeofconduct/ -->
<!-- 🕮 Read our guide about submitting issues: https://github.com/microsoft/vscode/wiki/Submitting-Bugs-and-Suggestions -->
<!-- 🔎 Search existing issues to avoid creating duplicates. -->
<!-- 🧪 Test using the latest Insiders build to see if your issue has already been fixed: https://code.visualstudio.com/insiders/ -->
<!-- 💡 Instead of creating your report here, use 'Report Issue' from the 'Help' menu in VS Code to pre-fill useful information. -->
<!-- 🔧 Launch with \`code --disable-extensions\` to check. -->
Does this issue occur when all extensions are disabled?: Yes/No

<!-- 🪓 If you answered No above, use 'Help: Start Extension Bisect' from Command Palette to try to identify the cause. -->
<!-- 📣 Issues caused by an extension need to be reported directly to the extension publisher. The 'Help > Report Issue' dialog can assist with this. -->
- VS Code Version:
- OS Version:

Steps to Reproduce:

1.
2.
`)
})

test.skip('readFile - ajax error', async () => {
  FileSystemGitHub.state.cache = {
    'microsoft/vscode': {
      sha: '1b429e743255d7b5a628c8267da990dae74a865c',
      url: 'https://api.github.com/repos/microsoft/vscode/git/trees/1b429e743255d7b5a628c8267da990dae74a865c',
      tree: [
        {
          path: '.gitattributes',
          mode: '100644',
          type: 'blob',
          sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
          size: 167,
          url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
        },
      ],
      truncated: false,
    },
  }
  Ajax.state.getJson = jest.fn(async () => {
    throw new Error('rate limiting exceeded')
  })
  await expect(
    FileSystemGitHub.readFile(
      'github://',
      'github://microsoft/vscode/.gitattributes'
    )
  ).rejects.toThrowError('rate limiting exceeded')
})

test('getBlobUrl', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    return {
      sha: 'f6263094d01a2de129ccec850512c503ef9e25ae',
      node_id:
        'MDQ6QmxvYjQxODgxOTAwOmY2MjYzMDk0ZDAxYTJkZTEyOWNjZWM4NTA1MTJjNTAzZWY5ZTI1YWU=',
      size: 167,
      url: 'https://api.github.com/repos/microsoft/vscode/git/blobs/f6263094d01a2de129ccec850512c503ef9e25ae',
      content:
        'KiB0ZXh0PWF1dG8KCkxJQ0VOU0UudHh0IGVvbD1jcmxmClRoaXJkUGFydHlO\nb3RpY2VzLnR4dCBlb2w9Y3JsZgoKKi5iYXQgZW9sPWNybGYKKi5jbWQgZW9s\nPWNybGYKKi5wczEgZW9sPWxmCiouc2ggZW9sPWxmCioucnRmIC10ZXh0Cioq\nLyouanNvbiBsaW5ndWlzdC1sYW5ndWFnZT1qc29uYwo=\n',
      download_url:
        'https://raw.githubusercontent.com/microsoft/vscode/main/.gitattributes',
      encoding: 'base64',
    }
  })
  expect(
    await FileSystemGitHub.getBlobUrl(
      'github://',
      'github://microsoft/vscode/.gitattributes'
    )
  ).toBe(
    'https://raw.githubusercontent.com/microsoft/vscode/main/.gitattributes'
  )
})

test('getPathSeparator', () => {
  expect(FileSystemGitHub.getPathSeparator()).toBe('/')
})
