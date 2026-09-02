import { afterEach, expect, jest, test } from '@jest/globals'
// @ts-ignore
import { PlainMessagePortRpc } from '../../../static/js/lvce-editor-rpc.js'

const prompt = jest.fn<(...args: readonly any[]) => Promise<boolean>>()

jest.unstable_mockModule('../src/parts/ConfirmPrompt/ConfirmPrompt.js', () => ({
  prompt,
}))

const { handleMockDialogWorkerMessagePort } = await import('../src/parts/HandleMockDialogWorkerMessagePort/HandleMockDialogWorkerMessagePort.ts')

let rpc: any

afterEach(async () => {
  await rpc?.dispose()
  rpc = undefined
  prompt.mockReset()
})

test('forwards confirm prompts to the renderer worker mock', async () => {
  const { port1, port2 } = new MessageChannel()
  rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  prompt.mockResolvedValue(true)
  await handleMockDialogWorkerMessagePort(port2)
  const options = { confirmMessage: 'Replace', title: 'Replace All' }

  await expect(rpc.invoke('ConfirmPrompt.prompt', 'Replace all?', options)).resolves.toBe(true)

  expect(prompt).toHaveBeenCalledWith('Replace all?', options)
})
