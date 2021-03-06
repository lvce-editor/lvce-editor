import * as IconTheme from '../src/parts/IconTheme/IconTheme.js'

test('getIcon - match by lowerCase file name', () => {
  IconTheme.state.iconTheme = {
    fileNames: {
      license: 'f_license',
    },
  }
  expect(
    IconTheme.getIcon({
      type: 'file',
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
      type: 'file',
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
      type: 'folder',
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
      type: 'folder',
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
      type: 'file',
      name: 'abc.test',
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
      type: 'file',
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
      type: 'file',
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
      type: 'directory-expanded',
      name: 'api',
    })
  ).toBe('fd_api_open')
})

test('getIcon - error - directory not in definitions', () => {
  IconTheme.state.iconTheme = {}
  expect(
    IconTheme.getIcon({
      type: 'directory',
      name: 'api',
    })
  ).toBe('')
})

test('getIcon - error - directory expanded not in definitions', () => {
  IconTheme.state.iconTheme = {}
  expect(
    IconTheme.getIcon({
      type: 'directory-expanded',
      name: 'api',
    })
  ).toBe('_folder_open')
})
