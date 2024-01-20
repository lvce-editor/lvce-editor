import * as GetWorkerDisplayName from '../src/parts/GetWorkerDisplayName/GetWorkerDisplayName.js'

test('getWorkerDisplayName', () => {
  expect(GetWorkerDisplayName.getWorkerDisplayName('test-worker')).toBe('test-worker')
})

test('getWorkerDisplayName - use PascalCase', () => {
  expect(GetWorkerDisplayName.getWorkerDisplayName('Extension Host')).toBe('Extension Host Worker')
})
