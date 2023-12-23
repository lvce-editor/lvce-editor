/**
 * @jest-environment jsdom
 */
import * as ViewletAudio from '../src/parts/ViewletAudio/ViewletAudio.js'

test('create', () => {
  const state = ViewletAudio.create()
  expect(state).toBeDefined()
})
