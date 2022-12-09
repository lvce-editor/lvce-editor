import * as ExtensionHostSourceControl from '../src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js'

beforeEach(() => {
  ExtensionHostSourceControl.reset()
})

test('getChangedFiles', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
  })
  expect(await ExtensionHostSourceControl.getChangedFiles()).toEqual([
    {
      file: '/test/file-1.txt',
      status: 1,
    },
  ])
})
