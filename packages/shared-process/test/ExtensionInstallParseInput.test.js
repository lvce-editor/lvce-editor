import * as ExtensionInstallParseInput from '../src/parts/ExtensionInstallParseInput/ExtensionInstallParseInput.js'

test('parse - github url', () => {
  expect(
    ExtensionInstallParseInput.parse('https://github.com/user/repo')
  ).toEqual({
    type: ExtensionInstallParseInput.InstallType.GithubRepository,
    options: {
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    },
  })
})

test('parse - error - could not parse github url', () => {
  expect(ExtensionInstallParseInput.parse('https://github.com/user')).toEqual({
    type: ExtensionInstallParseInput.InstallType.ParsingError,
    options: {
      message: 'Failed to parse github url',
    },
  })
})
