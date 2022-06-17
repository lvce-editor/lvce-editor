import { jest } from '@jest/globals'
import * as Audio from '../src/parts/Audio/Audio.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('playBell', async () => {
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
        throw new Error('unexpected message')
    }
  })
  await Audio.playBell()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3211,
    '/sounds/bell.oga',
  ])
})
