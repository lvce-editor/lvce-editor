/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'

const ViewletLocations = await import('../src/parts/ViewletLocations/ViewletLocations.ts')

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})
