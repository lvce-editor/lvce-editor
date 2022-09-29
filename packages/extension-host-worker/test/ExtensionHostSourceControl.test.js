import * as ExtensionHostSourceControl from '../src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js'

beforeEach(() => {
  ExtensionHostSourceControl.reset()
})

test('getChangedFiles', () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
  })
  expect(ExtensionHostSourceControl.getChangedFiles()).toEqual([
    {
      file: '/test/file-1.txt',
      status: 1,
    },
  ])
})
