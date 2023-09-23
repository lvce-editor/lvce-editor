import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetIcon from '../src/parts/GetIcon/GetIcon.js'
import * as IconThemeState from '../src/parts/IconThemeState/IconThemeState.js'

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
  IconThemeState.state.iconTheme = {
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'license',
    })
  ).toBe('f_license')
})

test('getIcon - match by upperCase file name', () => {
  IconThemeState.state.iconTheme = {
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'LICENSE',
    })
  ).toBe('f_license')
})

test('getIcon - match by lowerCase folder name', () => {
  IconThemeState.state.iconTheme = {
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'test',
    })
  ).toBe('fd_test')
})

test('getIcon - match by upperCase folder name', () => {
  IconThemeState.state.iconTheme = {
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'TEST',
    })
  ).toBe('fd_test')
})

test('getIcon - match by file extension', () => {
  IconThemeState.state.iconTheme = {
    fileNames: {},
    languageIds: {},
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test('getIcon - match by lowercase file extension', () => {
  IconThemeState.state.iconTheme = {
    fileNames: {},
    languageIds: {},
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'abc.Test',
    })
  ).toBe('f_test')
})

test.skip('getIcon - match by file extension but icon theme has no fileNames property', () => {
  IconThemeState.state.iconTheme = {
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test.skip('getIcon - match by file extension but icon theme has no languages property', () => {
  IconThemeState.state.iconTheme = {
    fileExtensions: {
      test: 'f_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'abc.test',
    })
  ).toBe('f_test')
})

test('getIcon - match by folder name expanded', () => {
  IconThemeState.state.iconTheme = {
    folderNamesExpanded: {
      api: 'fd_api_open',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    })
  ).toBe('fd_api_open')
})

test('getIcon - error - directory not in definitions', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'api',
    })
  ).toBe('')
})

test('getIcon - error - directory expanded not in definitions', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    })
  ).toBe('_folder_open')
})

test('getIcon - symlink', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.Symlink,
      name: 'a',
    })
  ).toBe('_file')
})

test('getIcon - socket', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.Socket,
      name: 'a',
    })
  ).toBe('_file')
})

test('getIcon - file extension should have priority over language id', () => {
  // @ts-ignore
  Languages.getLanguageId.mockImplementation(() => {
    return 'xml'
  })
  IconThemeState.state.iconTheme = {
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
    GetIcon.getIcon({
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
  IconThemeState.state.iconTheme = {
    folderNames: {},
    languageIds: {},
    fileNames: {
      '.nvmrc': 'f_nvmrc',
    },
    fileExtensions: {},
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.SymLinkFile,
      name: '.nvmrc',
    })
  ).toBe('f_nvmrc')
})

test('getIcon - no fileNames property', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'test',
    })
  ).toBe('_file')
})

test('getIcon - character device', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.CharacterDevice,
      name: 'null',
    })
  ).toBe('_file')
})

test('getIcon - block device', () => {
  IconThemeState.state.iconTheme = {}
  expect(
    GetIcon.getIcon({
      type: DirentType.BlockDevice,
      name: 'null',
    })
  ).toBe('_file')
})

test('getFileIcon - match by long extension', () => {
  IconThemeState.state.iconTheme = {
    fileExtensions: { 'd.ts': '_f_dts', ts: '_f_ts' },
  }
  expect(GetIcon.getFileIcon({ name: 'test.d.ts' })).toBe('_f_dts')
})

test('getFileIcon - fall back to shortest extension', () => {
  IconThemeState.state.iconTheme = {
    fileExtensions: { png: '_f_png' },
  }
  expect(GetIcon.getFileIcon({ name: 'test.snap.png' })).toBe('_f_png')
})
