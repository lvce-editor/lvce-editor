/**
 * @jest-environment jsdom
 */
import * as ViewletAudio from '../src/parts/ViewletAudio/ViewletAudio.js'

test('create', () => {
  const state = ViewletAudio.create()
  expect(state).toBeDefined()
})

test('setSrc', () => {
  const state = ViewletAudio.create()
  ViewletAudio.setSrc(state, 'test://example.mp3')
  const { $Audio } = state
  expect($Audio.src).toBe('test://example.mp3')
})
