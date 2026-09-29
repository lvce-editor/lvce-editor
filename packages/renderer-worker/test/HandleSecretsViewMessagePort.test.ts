import { afterEach, expect, jest, test } from '@jest/globals'
// @ts-ignore
import { PlainMessagePortRpc } from '../../../static/js/lvce-editor-rpc.js'

const rendererProcessInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()
const sendMessagePortToMainProcess = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: rendererProcessInvoke,
}))

jest.unstable_mockModule('../src/parts/SendMessagePortToMainProcess/SendMessagePortToMainProcess.js', () => ({
  sendMessagePortToMainProcess,
}))

const { handleSecretsViewMessagePort } = await import('../src/parts/HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts')

let rpc: any

afterEach(async () => {
  await rpc?.dispose()
  rpc = undefined
  rendererProcessInvoke.mockReset()
  sendMessagePortToMainProcess.mockReset()
})

test('forwards rendering commands to the renderer process', async () => {
  const { port1, port2 } = new MessageChannel()
  rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  rendererProcessInvoke.mockResolvedValue(7)
  await handleSecretsViewMessagePort(port2)

  await expect(rpc.invoke('Viewlet.queueCommands', 1, [])).resolves.toBe(7)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.queueCommands', 1, [])
})

test('forwards a transferred message port to the main process', async () => {
  const { port1, port2 } = new MessageChannel()
  const { port1: mainProcessPort, port2: mainProcessPortPeer } = new MessageChannel()
  rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
  sendMessagePortToMainProcess.mockResolvedValue(undefined)
  await handleSecretsViewMessagePort(port2)

  await rpc.invokeAndTransfer(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    mainProcessPort,
    'HandleElectronMessagePort.handleElectronMessagePort',
    0,
  )
  expect(sendMessagePortToMainProcess).toHaveBeenCalledWith(expect.any(MessagePort), 'HandleElectronMessagePort.handleElectronMessagePort', 0)
  mainProcessPortPeer.close()
})
