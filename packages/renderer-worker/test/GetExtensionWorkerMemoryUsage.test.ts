import { expect, test } from '@jest/globals'
import { getExtensionWorkerMemoryUsage } from '../src/parts/GetExtensionWorkerMemoryUsage/GetExtensionWorkerMemoryUsage.js'

test('returns zero when memory measurement is unavailable', () => {
  expect(getExtensionWorkerMemoryUsage(undefined, '/extensions/sample/main.js')).toBe(0)
})

test('returns zero when the worker url is unavailable', () => {
  expect(getExtensionWorkerMemoryUsage({ breakdown: [] }, undefined)).toBe(0)
})

test('sums memory attributed to the matching dedicated worker', () => {
  const measurement = {
    breakdown: [
      {
        attribution: [{ scope: 'Window', url: 'https://example.test/' }],
        bytes: 100,
      },
      {
        attribution: [{ scope: 'DedicatedWorkerGlobalScope', url: 'https://example.test/extensions/sample/main.js' }],
        bytes: 200,
      },
      {
        attribution: [{ scope: 'DedicatedWorkerGlobalScope', url: 'https://example.test/extensions/sample/main.js' }],
        bytes: 300,
      },
      {
        attribution: [{ scope: 'DedicatedWorkerGlobalScope', url: 'https://example.test/extensions/other/main.js' }],
        bytes: 400,
      },
    ],
  }

  expect(getExtensionWorkerMemoryUsage(measurement, '/extensions/sample/main.js')).toBe(500)
})

test('ignores invalid and unattributed breakdown entries', () => {
  const measurement = {
    breakdown: [
      { attribution: [], bytes: 100 },
      { attribution: [{ scope: 'DedicatedWorkerGlobalScope', url: '/extensions/sample/main.js' }], bytes: -1 },
      { attribution: [{ scope: 'DedicatedWorkerGlobalScope', url: '/extensions/sample/main.js' }], bytes: Number.NaN },
      { bytes: 200 },
    ],
  }

  expect(getExtensionWorkerMemoryUsage(measurement, '/extensions/sample/main.js')).toBe(0)
})
