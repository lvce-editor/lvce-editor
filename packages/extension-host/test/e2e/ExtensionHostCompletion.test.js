import { fork, spawn } from 'child_process'
import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let extensionHost

beforeAll(async () => {
  extensionHost = fork(
    join(__dirname, '..', '..', 'src', 'extensionHostMain.js')
  )
  await new Promise((resolve, reject) => {
    extensionHost.on('message', (message) => {
      if (message === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected message'))
      }
    })
  })
})

afterAll(() => {
  extensionHost.kill()
})

test('extensionHostCompletion', () => {})

test('extensionHostCompletion - no provider registered', () => {})

test('extensionHostCompletion - error', () => {})

test('Completion.execute - error - documentId is not of type number', () => {})

test('Completion.execute - error - offset is not of type number', () => {
  // await extensionHost.invoke({
  // })
})
