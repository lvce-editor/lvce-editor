/* eslint-disable jest/no-restricted-jest-methods -- Worker port tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'
// @ts-ignore
import { PlainMessagePortRpc } from '../../../static/js/lvce-editor-rpc.js'

const prompt = jest.fn<(...args: readonly any[]) => Promise<boolean>>()

jest.unstable_mockModule('../src/parts/ConfirmPrompt/ConfirmPrompt.js', () => ({
  prompt,
}))

const { handleDialogWorkerMessagePort } = await import('../src/parts/HandleDialogWorkerMessagePort/HandleDialogWorkerMessagePort.ts')

test('uses a confirm prompt mock registered after the message port is connected', async () => {
  const { port1, port2 } = new MessageChannel()
  const rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  try {
    await handleDialogWorkerMessagePort(port2)
    prompt.mockResolvedValue(true)
    const options = { confirmMessage: 'Replace', title: 'Replace All' }

    await expect(rpc.invoke('ConfirmPrompt.prompt', 'Replace all?', options)).resolves.toBe(true)

    expect(prompt).toHaveBeenCalledWith('Replace all?', options)
  } finally {
    await rpc.dispose()
    prompt.mockReset()
  }
})
