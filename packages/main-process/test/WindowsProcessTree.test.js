beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock(
  'windows-process-tree',
  () => {
    return {
      getProcessList: jest.fn(),
    }
  },
  {
    virtual: true,
  }
)

const WindowsProcessTree = require('../src/parts/WindowsProcessTree/WindowsProcessTree.js')
const WindowsProcessTreeModule = require('windows-process-tree')

test('getProcessList', async () => {
  // @ts-ignore
  WindowsProcessTreeModule.getProcessList.mockImplementation((pid, callback, flags) => {
    callback([])
  })
  const rootPid = 1
  const flags = 1
  expect(await WindowsProcessTree.getProcessList(rootPid, flags)).toEqual([])
})
