import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
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

const Languages = await import('../src/parts/Languages/Languages.js')

test('getIcon - match by lowerCase file name', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      f_license: 'test/file_license.svg',
    },
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'license',
    }),
  ).toBe('/remote/test/file_license.svg')
})

test('getIcon - match by upperCase file name', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      f_license: 'test/file_license.svg',
    },
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'LICENSE',
    }),
  ).toBe('/remote/test/file_license.svg')
})

test('getIcon - match by lowerCase folder name', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      fd_test: 'test/folder_test.svg',
    },
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'test',
    }),
  ).toBe('/remote/test/folder_test.svg')
})

test('getIcon - match by upperCase folder name', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      fd_test: 'test/folder_test.svg',
    },
    folderNames: {
      test: 'fd_test',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'TEST',
    }),
  ).toBe('/remote/test/folder_test.svg')
})

test('getIcon - match by file extension', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      f_test: 'test/file_test.svg',
    },
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
    }),
  ).toBe('/remote/test/file_test.svg')
})

test('getIcon - match by lowercase file extension', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      f_test: 'test/file_test.svg',
    },
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
    }),
  ).toBe('/remote/test/file_test.svg')
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
    }),
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
    }),
  ).toBe('f_test')
})

test('getIcon - match by folder name expanded', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      fd_api_open: 'test/folder_api_open.svg',
    },
    folderNamesExpanded: {
      api: 'fd_api_open',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    }),
  ).toBe('/remote/test/folder_api_open.svg')
})

test('getIcon - error - directory not in definitions', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Directory,
      name: 'api',
    }),
  ).toBe('')
})

test('getIcon - error - directory expanded not in definitions', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _folder_open: 'test/folder_open.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.DirectoryExpanded,
      name: 'api',
    }),
  ).toBe('/remote/test/folder_open.svg')
})

test('getIcon - symlink', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Symlink,
      name: 'a',
    }),
  ).toBe('/remote/test/file.svg')
})

test('getIcon - socket', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.Socket,
      name: 'a',
    }),
  ).toBe('/remote/test/file.svg')
})

test('getIcon - file extension should have priority over language id', () => {
  // @ts-ignore
  Languages.getLanguageId.mockImplementation(() => {
    return 'xml'
  })
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      f_svg: 'test/file_svg.svg',
    },
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
    }),
  ).toBe('/remote/test/file_svg.svg')
})

test('getIcon - symbolic link to file', () => {
  // @ts-ignore
  Languages.getLanguageId.mockImplementation(() => {
    return ''
  })
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _f_nvmrc: 'test/file_nvmrc.svg',
    },
    folderNames: {},
    languageIds: {},
    fileNames: {
      '.nvmrc': '_f_nvmrc',
    },
    fileExtensions: {},
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.SymLinkFile,
      name: '.nvmrc',
    }),
  ).toBe('/remote/test/file_nvmrc.svg')
})

test('getIcon - no fileNames property', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.File,
      name: 'test',
    }),
  ).toBe('/remote/test/file.svg')
})

test('getIcon - character device', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.CharacterDevice,
      name: 'null',
    }),
  ).toBe('/remote/test/file.svg')
})

test('getIcon - block device', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _file: 'test/file.svg',
    },
  }
  expect(
    GetIcon.getIcon({
      type: DirentType.BlockDevice,
      name: 'null',
    }),
  ).toBe('/remote/test/file.svg')
})

test('getFileIcon - match by long extension', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _f_dts: 'test/file_dts.svg',
      _f_ts: 'test/file_ts.svg',
    },
    fileExtensions: { 'd.ts': '_f_dts', ts: '_f_ts' },
  }
  expect(GetIcon.getFileIcon({ name: 'test.d.ts' })).toBe('/remote/test/file_dts.svg')
})

test('getFileIcon - fall back to shortest extension', () => {
  IconThemeState.state.iconTheme = {
    iconDefinitions: {
      _f_png: 'test/file_png.svg',
    },
    fileExtensions: { png: '_f_png' },
  }
  expect(GetIcon.getFileIcon({ name: 'test.snap.png' })).toBe('/remote/test/file_png.svg')
})
