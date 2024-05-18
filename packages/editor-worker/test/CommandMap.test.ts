import { expect, test } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap', () => {
  expect(typeof CommandMap.commandMap).toBe('object')
})