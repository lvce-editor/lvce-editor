import * as GetWorkerDisplayName from '../src/parts/GetWorkerDisplayName/GetWorkerDisplayName.ts'
import { beforeEach, test, expect } from '@jest/globals'

test('getWorkerDisplayName', () => {
  expect(GetWorkerDisplayName.getWorkerDisplayName('test-worker')).toBe('test-worker')
})

test('getWorkerDisplayName - use PascalCase', () => {
  expect(GetWorkerDisplayName.getWorkerDisplayName('Extension Host')).toBe('Extension Host Worker')
})
