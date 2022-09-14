import * as Performance from '../src/parts/Performance/Performance.js'
import { jest } from '@jest/globals'

test('getMemory - performance.memory is not available', () => {
  // @ts-ignore
  performance.memory = undefined
  expect(Performance.getMemory()).toBeUndefined()
})

test('getMemory - performance.memory is available', () => {
  // @ts-ignore
  performance.memory = {
    jsHeapSizeLimit: 20,
    totalJSHeapSize: 30,
    usedJSHeapSize: 40,
  }
  expect(Performance.getMemory()).toEqual({
    jsHeapSizeLimit: 20,
    totalJSHeapSize: 30,
    usedJSHeapSize: 40,
  })
})

test('measureUserAgentSpecificMemory - performance.measureUserAgentSpecificMemory is not available', async () => {
  // @ts-ignore
  performance.measureUserAgentSpecificMemory = undefined
  expect(await Performance.measureUserAgentSpecificMemory()).toBeUndefined()
})

test('measureUserAgentSpecificMemory - performance.measureUserAgentSpecificMemory is available', async () => {
  // @ts-ignore
  performance.measureUserAgentSpecificMemory = jest.fn(() => {
    return {
      breakdown: [
        {
          attribution: [],
          bytes: 0,
          types: [],
        },
        {
          attribution: [],
          bytes: 634056,
          types: ['DOM'],
        },
        {
          attribution: [
            {
              scope: 'Window',
              url: 'http://localhost:3000/',
            },
          ],
          bytes: 1208415,
          types: ['JavaScript'],
        },
        {
          attribution: [],
          bytes: 2242606,
          types: ['Shared'],
        },
        {
          attribution: [
            {
              scope: 'DedicatedWorkerGlobalScope',
              url: 'http://localhost:3000/worker.js',
            },
          ],
          bytes: 3004319,
          types: ['JavaScript'],
        },
      ],
      bytes: 7089396,
    }
  })
  expect(await Performance.measureUserAgentSpecificMemory()).toEqual({
    breakdown: [
      {
        attribution: [],
        bytes: 0,
        types: [],
      },
      {
        attribution: [],
        bytes: 634056,
        types: ['DOM'],
      },
      {
        attribution: [
          {
            scope: 'Window',
            url: 'http://localhost:3000/',
          },
        ],
        bytes: 1208415,
        types: ['JavaScript'],
      },
      {
        attribution: [],
        bytes: 2242606,
        types: ['Shared'],
      },
      {
        attribution: [
          {
            scope: 'DedicatedWorkerGlobalScope',
            url: 'http://localhost:3000/worker.js',
          },
        ],
        bytes: 3004319,
        types: ['JavaScript'],
      },
    ],
    bytes: 7089396,
  })
})
