import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('node:fs', () => ({
  existsSync: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(() => {}),
}))

const fs = await import('node:fs')
const TrashElectron = await import('../src/parts/TrashElectron/TrashElectron.js')
const ParentIpc = await import('../src/parts/MainProcess/MainProcess.js')

test("trash - folder doesn't exist", async () => {
  // @ts-ignore
  fs.existsSync.mockImplementation(() => {
    return false
  })
  await TrashElectron.trash('/test/file.txt')
})

test.only('trash', async () => {
  // @ts-ignore
  fs.existsSync.mockImplementation(() => {
    return true
  })
  await TrashElectron.trash('/test/file.txt')
  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('Trash.trash', '/test/file.txt')
})
