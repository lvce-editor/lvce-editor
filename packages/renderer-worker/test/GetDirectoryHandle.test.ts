import { beforeEach, expect, jest, test } from '@jest/globals'
import * as GetDirectoryHandle from '../src/parts/GetDirectoryHandle/GetDirectoryHandle.js'

const addHandle = jest.fn<(uri: string, handle: object) => Promise<void>>()
const getHandle = jest.fn<(uri: string) => Promise<object | undefined>>()
const getDirectoryHandle = jest.fn<(handle: object, name: string) => Promise<object>>()
const dependencies = {
  addHandle,
  getDirectoryHandle,
  getHandle,
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('resolves an uncached directory from the nearest cached parent', async () => {
  const workspaceHandle = {}
  const gitDirectoryHandle = {}
  getHandle.mockImplementation(async (uri) => {
    if (uri === 'html:///workspace') {
      return workspaceHandle
    }
    return undefined
  })
  getDirectoryHandle.mockResolvedValue(gitDirectoryHandle)

  await expect(GetDirectoryHandle.getDirectoryHandleWithDependencies('html:///workspace/.git', dependencies)).resolves.toBe(gitDirectoryHandle)
  expect(getDirectoryHandle).toHaveBeenCalledWith(workspaceHandle, '.git')
  expect(addHandle).toHaveBeenCalledWith('html:///workspace/.git', gitDirectoryHandle)
})
