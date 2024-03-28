/**
 * @jest-environment jsdom
 */
import * as ViewletAudio from '../src/parts/ViewletAudio/ViewletAudio.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletAudio.create()
  expect(state).toBeDefined()
})
