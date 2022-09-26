import * as ExtensionInstallType from '../src/parts/ExtensionInstallType/ExtensionInstallType.js'
import * as ExtensionInstallParseInput from '../src/parts/ExtensionInstallParseInput/ExtensionInstallParseInput.js'

test('parse - github url', () => {
  expect(
    ExtensionInstallParseInput.parse('https://github.com/user/repo')
  ).toEqual({
    type: ExtensionInstallType.GithubRepository,
    options: {
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    },
  })
})

test('parse - error - could not parse github url', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user')).toEqual({
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse github url',
    },
  })
})

test('parse - error - cannot install from pull request', () => {
  expect(
    ExtensionInstallParseInput.parse('https://github.com/user/repo/pull/1')
  ).toEqual({
    type: ExtensionInstallType.ParsingError,
    options: {
      message: `Cannot download from Pull Request`,
    },
  })
})

test('parse - install from branch', () => {
  expect(
    ExtensionInstallParseInput.parse(
      'https://github.com/user/repo/tree/branch-1'
    )
  ).toEqual({
    type: ExtensionInstallType.GithubRepository,
    options: {
      user: 'user',
      repo: 'repo',
      branch: 'branch-1',
    },
  })
})

test('parse - install from commit', () => {
  expect(
    ExtensionInstallParseInput.parse(
      'https://github.com/user/repo/tree/1981bbd'
    )
  ).toEqual({
    type: ExtensionInstallType.GithubRepository,
    options: {
      user: 'user',
      repo: 'repo',
      branch: '1981bbd',
    },
  })
})

test('parse - install from relative path - error - file not found', () => {
  expect(ExtensionInstallParseInput.parse('./extension.tar.br')).toEqual({
    type: ExtensionInstallType.File,
    options: {
      path: './extension.tar.br',
    },
  })
})

test('parse - install from relative path', () => {
  expect(ExtensionInstallParseInput.parse('./extension.tar.br')).toEqual({
    type: ExtensionInstallType.File,
    options: {
      path: './extension.tar.br',
    },
  })
})
