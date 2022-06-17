/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Audio from '../src/parts/Audio/Audio.js'

// TODO when play fails, log an info message

test('play', async () => {
  const spy = jest
    .spyOn(HTMLMediaElement.prototype, 'play')
    .mockImplementation(async () => {})
  await Audio.play('/test/test-sound.oga')
  expect(spy).toHaveBeenCalled()
})
