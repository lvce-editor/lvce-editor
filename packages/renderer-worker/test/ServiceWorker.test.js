import { jest } from '@jest/globals'
import * as ServiceWorker from '../src/parts/ServiceWorker/ServiceWorker.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as Preferences from '../src/parts/Preferences/Preferences.js'

test('hydrate', async () => {
  Preferences.state['serviceWorker.enabled'] = true
  RendererProcess.state.send = jest.fn((message) => {
    if (message[0] === 909090 && message[2] === 43725) {
      RendererProcess.state.handleMessage([67330, message[1], undefined])
    } else {
      throw new Error('unexpected message')
    }
  })
  await ServiceWorker.hydrate()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    43725,
    '/serviceWorker.js',
  ])
})

test('uninstall', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await ServiceWorker.uninstall()
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    42726,
  ])
})
