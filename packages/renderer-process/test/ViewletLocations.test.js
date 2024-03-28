/**
 * @jest-environment jsdom
 */
const ViewletLocations = await import('../src/parts/ViewletLocations/ViewletLocations.js')
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})
