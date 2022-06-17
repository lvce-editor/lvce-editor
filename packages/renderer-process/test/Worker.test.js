/**
 * @jest-environment jsdom
 */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { jest } from '@jest/globals'
import * as WebWorker from '../src/parts/WebWorker/WebWorker.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test.skip('create - moduleWorker', () => {
  // @ts-ignore
  WebWorker.state.preferredMethod = 'moduleWorker'
  const mock = jest.fn()
  // @ts-ignore
  global.Worker = class {
    constructor() {
      mock()
    }
  }
  WebWorker.create('/test/sample-file.js')
  expect(mock).toHaveBeenCalled()
})

// TODO sometimes failing with "Test environment has been torn down", probably jest bug https://github.com/facebook/jest/issues/11438
test.skip('create - messagePort', async () => {
  // @ts-ignore
  global.MessagePort = class {
    constructor() {}
  }
  // @ts-ignore
  global.MessageChannel = class {
    constructor() {
      this.port1 = new MessagePort()
      this.port2 = new MessagePort()
    }
  }
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'test-file.js'),
    'const messageChannel = new MessageChannel(); globalThis.port = messageChannel.port1'
  )
  await writeFile(join(tmpDir, 'package.json'), '{"type": "module"}')
  // @ts-ignore
  WebWorker.state.preferredMethod = 'messagePort'
  const port = await WebWorker.create(join(tmpDir, 'test-file.js'))
  expect(port).toBeInstanceOf(MessagePort)
  expect('port' in globalThis).toBe(false)
  delete global.MessageChannel
  delete global.MessagePort
})
