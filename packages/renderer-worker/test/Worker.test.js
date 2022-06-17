/**
 * @jest-environment jsdom
 */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { jest } from '@jest/globals'
import * as Worker from '../src/parts/Worker/Worker.js'

const getTemporaryDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

beforeAll(() => {
  globalThis.MessagePort = class {
    constructor() {}
    onmessage() {}
    onerror() {}
    onmessageerror() {}
    close() {}
    postMessage() {}
    start() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
      return false
    }
  }
  globalThis.MessageChannel = class {
    constructor() {
      this.port1 = new MessagePort()
      this.port2 = new MessagePort()
    }
  }
})
afterAll(() => {
  delete globalThis.MessageChannel
  delete globalThis.MessagePort
})

test('create - messagePort', async () => {
  const temporaryDir = await getTemporaryDir()
  await writeFile(
    `${temporaryDir}/test-file.js`,
    'const messageChannel = new MessageChannel(); globalThis.acceptPort(messageChannel.port1)'
  )
  await writeFile(`${temporaryDir}/package.json`, '{"type": "module"}')
  const port = await Worker.create(`${temporaryDir}/test-file.js`)
  expect(port).toBeInstanceOf(MessagePort)
})

// TODO add test for module worker, but how?
