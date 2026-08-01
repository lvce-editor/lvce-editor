import { beforeEach, expect, jest, test } from '@jest/globals'

const register = jest.fn()
const importScript = jest.fn(async () => ({
  commandMap: {
    'Git.status'() {
      return 'ok'
    },
  },
}))

jest.unstable_mockModule('@lvce-editor/command', () => ({ register }))
jest.unstable_mockModule('../src/parts/ImportScript/ImportScript.js', () => ({ importScript }))

const CommandMapRef = await import('../src/parts/CommandMapRef/CommandMapRef.js')
const LoadFile = await import('../src/parts/LoadFile/LoadFile.js')

beforeEach(() => {
  jest.clearAllMocks()
  CommandMapRef.commandMapRef['LoadFile.loadFile'] = LoadFile.loadFile
})

test('loads one approved module and disables the bootstrap command', async () => {
  await LoadFile.loadFile('/extensions/builtin.git/client.js')

  expect(importScript).toHaveBeenCalledTimes(1)
  expect(CommandMapRef.commandMapRef['LoadFile.loadFile']).toBeUndefined()
  expect(register).toHaveBeenNthCalledWith(1, { 'LoadFile.loadFile': expect.any(Function) })
  expect(register).toHaveBeenNthCalledWith(2, expect.objectContaining({ 'Git.status': expect.any(Function) }))
  expect(() => register.mock.calls[0][0]['LoadFile.loadFile']()).toThrow('a module has already been loaded')

  await expect(LoadFile.loadFile('/tmp/other.js')).rejects.toThrow('a module has already been loaded')
  expect(importScript).toHaveBeenCalledTimes(1)
})
