import { jest } from '@jest/globals'

jest.unstable_mockModule(
  'file:///test/file.js',
  () => {
    console.log('mock import called')
    return {}
  },
  { virtual: true }
)

const WebWorkerWithMessagePort = await import(
  '../src/parts/WebWorker/WebWorkerWithMessagePort.js'
)

test.skip('create', async () => {
  await WebWorkerWithMessagePort.create('/test/file.js')
})
