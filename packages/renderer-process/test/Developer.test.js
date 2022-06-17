/**
 * @jest-environment jsdom
 */
import * as Developer from '../src/parts/Developer/Developer.js'

test('getMemoryUsage - performance.memory is available', () => {
  // @ts-ignore
  performance.memory = {
    jsHeapSizeLimit: 20,
    totalJSHeapSize: 30,
    usedJSHeapSize: 40,
  }
  expect(Developer.getMemoryUsage()).toEqual({
    jsHeapSizeLimit: 20,
    totalJSHeapSize: 30,
    usedJSHeapSize: 40,
  })
})

test('getMemoryUsage - performance.memory is not available', () => {
  // @ts-ignore
  performance.memory = undefined
  expect(Developer.getMemoryUsage()).toBeUndefined()
})
