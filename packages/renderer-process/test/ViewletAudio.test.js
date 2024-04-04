/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletAudio from '../src/parts/ViewletAudio/ViewletAudio.ts'

test('create', () => {
  const state = ViewletAudio.create()
  expect(state).toBeDefined()
})
