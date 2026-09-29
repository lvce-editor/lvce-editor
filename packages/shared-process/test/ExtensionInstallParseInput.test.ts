import { expect, test } from '@jest/globals'
import * as ExtensionInstallParseInput from '../src/parts/ExtensionInstallParseInput/ExtensionInstallParseInput.js'
import * as ExtensionInstallType from '../src/parts/ExtensionInstallType/ExtensionInstallType.js'

test('parse - github url', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user/repo')).toEqual({
    options: {
      branch: 'HEAD',
      repo: 'repo',
      user: 'user',
    },
    type: ExtensionInstallType.GithubRepository,
  })
})

test('parse - error - could not parse github url', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user')).toEqual({
    options: {
      message: 'Failed to parse github url',
    },
    type: ExtensionInstallType.ParsingError,
  })
})

test('parse - error - cannot install from pull request', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user/repo/pull/1')).toEqual({
    options: {
      message: `Cannot download from Pull Request`,
    },
    type: ExtensionInstallType.ParsingError,
  })
})

test('parse - install from branch', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user/repo/tree/branch-1')).toEqual({
    options: {
      branch: 'branch-1',
      repo: 'repo',
      user: 'user',
    },
    type: ExtensionInstallType.GithubRepository,
  })
})

test('parse - install from commit', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user/repo/tree/1981bbd')).toEqual({
    options: {
      branch: '1981bbd',
      repo: 'repo',
      user: 'user',
    },
    type: ExtensionInstallType.GithubRepository,
  })
})

test('parse - install from relative path - error - file not found', () => {
  expect(ExtensionInstallParseInput.parse('./extension.tar.br')).toEqual({
    options: {
      path: './extension.tar.br',
    },
    type: ExtensionInstallType.File,
  })
})

test('parse - install from relative path', () => {
  expect(ExtensionInstallParseInput.parse('./extension.tar.br')).toEqual({
    options: {
      path: './extension.tar.br',
    },
    type: ExtensionInstallType.File,
  })
})

test('parse - install from absolute path', () => {
  expect(ExtensionInstallParseInput.parse('/test/files/extension.tar.br')).toEqual({
    options: {
      path: '/test/files/extension.tar.br',
    },
    type: ExtensionInstallType.File,
  })
})
