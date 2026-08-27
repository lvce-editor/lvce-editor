import { afterEach, expect, jest, test } from '@jest/globals'
// @ts-ignore
import { PlainMessagePortRpc } from '../../../static/js/lvce-editor-rpc.js'

const rendererProcessInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()
const sharedProcessInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: rendererProcessInvoke,
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: sharedProcessInvoke,
}))

const { handleSecretsViewMessagePort } = await import('../src/parts/HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts')

let rpc: any

afterEach(async () => {
  await rpc?.dispose()
  rpc = undefined
  rendererProcessInvoke.mockReset()
  sharedProcessInvoke.mockReset()
})

test('forwards rendering commands to the renderer process', async () => {
  const { port1, port2 } = new MessageChannel()
  rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  rendererProcessInvoke.mockResolvedValue(7)
  await handleSecretsViewMessagePort(port2)

  await expect(rpc.invoke('Viewlet.queueCommands', 1, [])).resolves.toBe(7)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.queueCommands', 1, [])
})

test.each(['get', 'list', 'store'])('forwards SecretStorage.%s to the shared process', async (method) => {
  const { port1, port2 } = new MessageChannel()
  rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  sharedProcessInvoke.mockResolvedValue(undefined)
  await handleSecretsViewMessagePort(port2)

  await rpc.invoke(`SecretStorage.${method}`, 'extension', 'key', 'value')
  expect(sharedProcessInvoke).toHaveBeenCalledWith(`SecretStorage.${method}`, 'extension', 'key', 'value')
})
