/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'
import * as Audio from '../src/parts/Audio/Audio.ts'

// TODO when play fails, log an info message

test('play', async () => {
  const spy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(async () => {})
  await Audio.play('/test/test-sound.oga')
  expect(spy).toHaveBeenCalled()
})
