import { expect, jest, test } from '@jest/globals'
import { promptSave } from '../src/parts/ConfirmPromptWeb/ConfirmPromptWeb.js'

test('promptSave returns save when the first confirmation is accepted', async () => {
  const invoke = jest.fn<(method: string, message: string) => Promise<boolean>>(async () => true)

  const result = await promptSave('Save changes to test.txt?', invoke)

  expect(result).toBe('save')
  expect(invoke).toHaveBeenCalledTimes(1)
})

test('promptSave returns discard when the discard confirmation is accepted', async () => {
  const invoke = jest.fn<(method: string, message: string) => Promise<boolean>>().mockResolvedValueOnce(false).mockResolvedValueOnce(true)

  const result = await promptSave('Save changes to test.txt?', invoke)

  expect(result).toBe('discard')
  expect(invoke).toHaveBeenCalledTimes(2)
})

test('promptSave returns cancel when both confirmations are canceled', async () => {
  const invoke = jest.fn<(method: string, message: string) => Promise<boolean>>(async () => false)

  const result = await promptSave('Save changes to test.txt?', invoke)

  expect(result).toBe('cancel')
  expect(invoke).toHaveBeenCalledTimes(2)
})
