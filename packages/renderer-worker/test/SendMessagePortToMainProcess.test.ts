import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const SendMessagePortToMainProcess = await import('../src/parts/SendMessagePortToMainProcess/SendMessagePortToMainProcess.js')

test('sendMessagePortToMainProcess', async () => {
  const port = {}

  await SendMessagePortToMainProcess.sendMessagePortToMainProcess(port, 'HandleMessagePort.handleMessagePort', 42)

  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    port,
    'HandleMessagePort.handleMessagePort',
    42,
  )
})
