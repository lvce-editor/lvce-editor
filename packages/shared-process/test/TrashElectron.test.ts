import { beforeEach, expect, jest, test } from '@jest/globals'

const mockExists = jest.fn()

jest.unstable_mockModule('node:fs', () => ({
  existsSync: mockExists,
}))

const mockInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: mockInvoke,
}))

const TrashElectron = await import('../src/parts/TrashElectron/TrashElectron.js')
const MainProcess = await import('../src/parts/MainProcess/MainProcess.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test("trash - folder doesn't exist", async () => {
  mockExists.mockReturnValueOnce(false)
  await TrashElectron.trash('/test/file.txt')
})

test.only('trash', async () => {
  mockExists.mockReturnValueOnce(true)
  await TrashElectron.trash('/test/file.txt')
  console.log(MainProcess.invoke)
  expect(MainProcess.invoke).toHaveBeenCalledTimes(1)
  expect(MainProcess.invoke).toHaveBeenCalledWith('Trash.trash', '/test/file.txt')
})
