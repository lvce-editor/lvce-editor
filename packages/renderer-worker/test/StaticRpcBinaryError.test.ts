import { expect, test } from '@jest/globals'
import { MessageChannel } from 'node:worker_threads'
import * as JsonRpc from '../../../static/js/lvce-editor-json-rpc.js'
import { PlainMessagePortRpc } from '../../../static/js/lvce-editor-rpc.js'

const binaryError = (): Error => Object.defineProperty(new Error('Cannot open binary file'), 'name', { value: 'BinaryFileError' })

const errorResponse = (id: number): any =>
  JsonRpc.getErrorResponse(
    { id },
    binaryError(),
    (error) => error,
    () => {},
  )

test('bundled JSON RPC preserves a binary error name', async () => {
  const ipc = {
    send(request): void {
      JsonRpc.resolve(request.id, errorResponse(request.id))
    },
  }
  await expect(JsonRpc.invoke(ipc, 'FileSystem.readFile')).rejects.toMatchObject({ message: 'Cannot open binary file', name: 'BinaryFileError' })
})

test('bundled message port RPC preserves a binary error name', async () => {
  const { port1, port2 } = new MessageChannel()
  try {
    port2.on('message', (request) => port2.postMessage(errorResponse(request.id)))
    const rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 })
    await expect(rpc.invoke('FileSystem.readFile')).rejects.toMatchObject({ message: 'Cannot open binary file', name: 'BinaryFileError' })
  } finally {
    port1.close()
    port2.close()
  }
})
