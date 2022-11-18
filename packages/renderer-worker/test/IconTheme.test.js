import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    getLanguageId: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const IconTheme = await import('../src/parts/IconTheme/IconTheme.js')
const Languages = await import('../src/parts/Languages/Languages.js')

test('getIcon - match by lowerCase file name', () => {
  IconTheme.state.iconTheme = {
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'license',
    })
  ).toBe('f_license')
})

test('getIcon - match by upperCase file name', () => {
  IconTheme.state.iconTheme = {
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'LICENSE',
    })
  ).toBe('f_license')
})

test('getIcon - match by lowerCase folder name', () => {
  IconTheme.state.iconTheme = {
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.Directory,
      name: 'test',
    })
  ).toBe('fd_test')
})

test('getIcon - match by upperCase folder name', () => {
  IconTheme.state.iconTheme = {
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.Directory,
      name: 'TEST',
    })
  ).toBe('fd_test')
})

test('getIcon - match by file extension', () => {
  IconTheme.state.iconTheme = {
    fileNames: {},
    languageIds: {},
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test('getIcon - match by lowercase file extension', () => {
  IconTheme.state.iconTheme = {
    fileNames: {},
    languageIds: {},
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'abc.Test',
    })
  ).toBe('f_test')
})

test.skip('getIcon - match by file extension but icon theme has no fileNames property', () => {
  IconTheme.state.iconTheme = {
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test.skip('getIcon - match by file extension but icon theme has no languages property', () => {
  IconTheme.state.iconTheme = {
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test('getIcon - match by folder name expanded', () => {
  IconTheme.state.iconTheme = {
    folderNamesExpanded: {
      api: 'fd_api_open',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    })
  ).toBe('fd_api_open')
})

test('getIcon - error - directory not in definitions', () => {
  IconTheme.state.iconTheme = {}
  expect(
    IconTheme.getIcon({
      type: DirentType.Directory,
      name: 'api',
    })
  ).toBe('')
})

test('getIcon - error - directory expanded not in definitions', () => {
  IconTheme.state.iconTheme = {}
  expect(
    IconTheme.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    })
  ).toBe('_folder_open')
})

test('getIcon - symlink', () => {
  IconTheme.state.iconTheme = {}
  expect(
    IconTheme.getIcon({
      type: DirentType.Symlink,
      name: 'a',
    })
  ).toBe('_file')
})

test('getIcon - file extension should have priority over language id', () => {
  // @ts-ignore
  Languages.getLanguageId.mockImplementation(() => {
    return 'xml'
  })
  IconTheme.state.iconTheme = {
    folderNames: {
      test: 'fd_test',
    },
    languageIds: {
      xml: 'f_xml',
    },
    fileNames: {},
    fileExtensions: {
      svg: 'f_svg',
    },
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.File,
      name: '/test/file.svg',
    })
  ).toBe('f_svg')
})

test('getIcon - symbolic link to file', () => {
  // @ts-ignore
  Languages.getLanguageId.mockImplementation(() => {
    return ''
  })
  IconTheme.state.iconTheme = {
    folderNames: {},
    languageIds: {},
    fileNames: {
      '.nvmrc': 'f_nvmrc',
    },
    fileExtensions: {},
  }
  expect(
    IconTheme.getIcon({
      type: DirentType.SymLinkFile,
      name: '.nvmrc',
    })
  ).toBe('f_nvmrc')
})
