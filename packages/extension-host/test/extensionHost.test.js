import { fork } from 'node:child_process'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'
import { jest } from '@jest/globals'

// TODO migrate these tests to extension host e2e/integration tests
// which are more meaningful since especially the ui should still work
// if something in the extension host goes wrong

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const isMacOs = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')
const EXTENSION_HOST_PATH = resolve(__dirname, '../src/extensionHostMain.js')
const stdio = 'inherit' // set this to 'inherit' if a test is failing and you need to debug

const getManifest = async (props) => {
  const content = await readFile(`${props.path}/extension.json`, 'utf-8')
  const json = JSON.parse(content)
  return {
    ...json,
    ...props,
  }
}

const createExtensionHostViaFork = async () => {
  let state = 'default'
  let onMessage = (message) => {}
  const extensionHost = fork(EXTENSION_HOST_PATH, {
    stdio,
  })
  await new Promise((resolve, reject) => {
    extensionHost.once('message', (message) => {
      if (message === 'ready') {
        state = 'ready'
        // @ts-ignore
        resolve()
      } else {
        reject()
      }
    })
  })

  extensionHost.once('exit', (code) => {
    if (code === 0) {
      state = 'exited'
    } else {
      state = 'crashed'
    }
  })
  extensionHost.on('message', (message) => {
    onMessage(message)
  })
  return {
    send(message) {
      extensionHost.send(message)
    },
    dispose() {
      extensionHost.kill()
    },
    set onMessage(fn) {
      onMessage = fn
    },
    get onMessage() {
      return onMessage
    },
    get state() {
      return state
    },
  }
}

const createExtensionHostViaWorker = async () => {
  const worker = new Worker(EXTENSION_HOST_PATH)
  await new Promise((resolve, reject) => {
    worker.once('message', (message) => {
      if (message === 'ready') {
        // @ts-ignore
        resolve()
      } else {
        reject()
      }
    })
  })
  return {
    send(message) {
      worker.postMessage(message)
    },
    dispose() {
      worker.terminate()
    },
  }
}

// TODO skip these integration tests, use e2e tests instead (tests/extension-api-tests)

// test('extensionHost loads via fork', async () => {
//   const extensionHost = await createExtensionHostViaFork()
//   extensionHost.dispose()
// })

test.skip('extensionHost loads via worker', async () => {
  const worker = await createExtensionHostViaWorker()
  worker.dispose()
})

let _id = 1
const invoke = async (transport, { method, params }) => {
  return new Promise((resolve, reject) => {
    const handleMessage = (message) => {
      if (message.error) {
        reject(new Error(message.error.data))
      } else {
        resolve(message.result)
      }
    }
    transport.onMessage = handleMessage
    transport.send({
      jsonrpc: '2.0',
      id: _id++,
      method,
      params,
    })
  })
}

let extensionHost

beforeEach(async () => {
  extensionHost = await createExtensionHostViaFork()
})

afterEach(() => {
  extensionHost.dispose()
})

test('activate extension', async () => {
  const extension1 = await getManifest({
    path: `${__dirname}/fixtures/extension-1`,
  })
  await invoke(extensionHost, {
    method: 'enableExtension',
    params: [extension1],
  })
  // TODO how to verify that extension is activated
  // 1. send event that it is activated -> many useless messages -> bad
  // 2. create file watcher for /tmp/ready, inside extensionMain.js write to "/tmp/ready" -> then it is ready -> a bit hacky, but maybe best solution
})

// TODO test missing activate function -> should console.warn

test.skip('activate extension throws error on import', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'package.json'),
    `{ "type": "module" }
`
  )
  await writeFile(
    join(tmpDir, 'extension.json'),
    `{
  "id": "test-author.test-extension",
  "main": "src/main.js"
}
`
  )
  await mkdir(join(tmpDir, 'src'))
  await writeFile(
    join(tmpDir, 'src', 'main.js'),
    `throw new Error("Oops")
`
  )
  const extension1 = await getManifest({
    path: tmpDir,
  })
  extensionHost.onMessage = jest.fn()

  await expect(
    invoke(extensionHost, {
      method: 'enableExtension',
      params: [extension1],
    })
  ).rejects.toThrowError(
    `ExecutionError: Failed to load extension \"test-author.test-extension\": Oops`
  )
})

test.skip('activate extension throws error in activate', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'package.json'),
    `{ "type": "module" }
`
  )
  await writeFile(
    join(tmpDir, 'extension.json'),
    `{
  "id": "test-author.test-extension",
  "main": "src/main.js"
}
`
  )
  await mkdir(join(tmpDir, 'src'))
  await writeFile(
    join(tmpDir, 'src', 'main.js'),
    `export const  activate = () => {
  throw new Error("Oops")
}
`
  )
  const extension1 = await getManifest({
    path: tmpDir,
  })
  extensionHost.onMessage = jest.fn()

  await expect(
    invoke(extensionHost, {
      method: 'enableExtension',
      params: [extension1],
    })
  ).rejects.toThrowError(
    `ExecutionError: Failed to activate extension \"test-author.test-extension\": Oops`
  )
})

test.skip('executing failing tab completion provider should log error message but not crash extension host', async () => {
  const extension2 = await getManifest({
    path: `${__dirname}/fixtures/extension-2`,
  })
  await invoke(extensionHost, {
    method: 'enableExtension',
    params: [extension2],
  })
  await invoke(extensionHost, {
    method: 'TextDocument.syncInitial',
    params: [
      /* uri */ '/tmp/index.html',
      /* documentId */ 1,
      /* languageId */ 'html',
      /* text */ 'sample text',
    ],
  })
  await expect(
    invoke(extensionHost, {
      method: 'executeTabCompletionProvider',
      params: [/* documentId */ 1, /* offset */ 0],
    })
  ).rejects.toThrowError('some error')
  extensionHost.onMessage = () => {}
  expect(extensionHost.state).toBe('ready')
})

// TODO test extension that has circular dependency

// TODO test commonjs extension

// TODO test extension that has (native) node modules

// TODO test that extension host doesn't crash when formatting provider fails

test('memory stats', async () => {
  expect(
    await invoke(extensionHost, {
      method: 'Stats.getMemoryInfo',
      params: [],
    })
  ).toEqual({
    heapUsed: expect.any(Number),
    heapTotal: expect.any(Number),
    rss: expect.any(Number),
    external: expect.any(Number),
  })
})

// TODO test unknown command

// TODO test when extension registers command with invalid shape

// TODO test when command fails to execute

test('Api - Command.execute', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'package.json'),
    `{ "type": "module"}
`
  )
  await writeFile(
    join(tmpDir, 'extension.json'),
    `{
  "id": "test-author.test-extension",
  "main": "src/main.js"
}
`
  )
  await mkdir(join(tmpDir, 'src'))
  await writeFile(
    join(tmpDir, 'src', 'main.js'),
    `const testCommand = {
  id: 'test.test',
  execute(x){
    return x
  }
}

export const activate = () => {
  vscode.registerCommand(testCommand)
}
`
  )
  const extension1 = await getManifest({
    path: tmpDir,
  })
  await invoke(extensionHost, {
    method: 'enableExtension',
    params: [extension1],
  })
  expect(
    await invoke(extensionHost, {
      method: 'Command.execute',
      params: ['test.test', 'test'],
    })
  ).toBe('test')
})

test.skip('Api - TabCompletion.execute', async () => {
  const extension3 = await getManifest({
    path: `${__dirname}/fixtures/extension-3`,
  })
  await invoke(extensionHost, {
    method: 'enableExtension',
    params: [extension3],
  })
  await invoke(extensionHost, {
    method: 'TextDocument.syncInitial',
    params: [
      /* documentId */ 1,
      /* languageId */ 'html',
      /* text */ 'sample text',
    ],
  })
  expect(
    await invoke(extensionHost, {
      method: 'TabCompletionProvider.execute',
      params: [/* documentId */ 1, /* languageId */ 'html', /* offset */ 0],
    })
  ).toEqual({
    // TODO
  })
  expect(extensionHost.state).toBe('ready')
})

// TODO test when extension crashes extension host

// TODO test when extension hangs extension host
