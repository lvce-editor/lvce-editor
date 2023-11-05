/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

const ViewletLocations = await import('../src/parts/ViewletLocations/ViewletLocations.js')

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})
