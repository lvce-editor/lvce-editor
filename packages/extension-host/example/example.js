import { fork } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const isMacOs = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

const stdio = 'inherit' // set this to 'inherit' if a test is failing and you need to debug

const getManifest = async (props) => {
  const content = await readFile(`${props.path}/extension.json`, 'utf-8')
  const json = JSON.parse(content)
  return {
    ...json,
    ...props,
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

const EXTENSION_HOST_PATH = `${__dirname}/../src/extensionHostMain.js`

const createExtensionHostViaFork = async () => {
  const extensionHost = fork(EXTENSION_HOST_PATH, {
    execArgv: ['--max-old-space-size=10'],
    stdio: 'inherit',
  })
  await new Promise((resolve, reject) => {
    extensionHost.once('message', (message) => {
      if (message === 'ready') {
        // @ts-ignore
        resolve()
      } else {
        reject()
      }
    })
  })
  return {
    send(method, ...params) {
      extensionHost.send({
        jsonrpc: '2.0',
        method,
        params,
      })
    },
    dispose() {
      extensionHost.kill()
    },
    set onMessage(fn) {
      extensionHost.on('message', fn)
    },
  }
}

const main = async () => {
  const extensionHost = await createExtensionHostViaFork()
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
  "main": "src/non-existent.js"
}
`
  )
  const extension = await getManifest({
    path: tmpDir,
  })
  const messagePromise = new Promise((resolve) => {
    extensionHost.onMessage = resolve
  })
  extensionHost.send('enableExtension', extension)
  const message = await messagePromise
}

main()
