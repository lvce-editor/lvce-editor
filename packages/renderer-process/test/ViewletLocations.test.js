/**
 * @jest-environment jsdom
 */
const ViewletLocations = await import('../src/parts/ViewletLocations/ViewletLocations.ts')
import { expect, test } from '@jest/globals'

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})
