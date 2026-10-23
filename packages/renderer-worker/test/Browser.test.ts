import { afterEach, expect, test } from '@jest/globals'

const Browser = await import('../src/parts/Browser/Browser.js')
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')

const setNavigator = (userAgent, userAgentData) => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent,
      ...(userAgentData ? { userAgentData } : {}),
    },
  })
}

afterEach(() => {
  if (originalNavigator) {
    Object.defineProperty(globalThis, 'navigator', originalNavigator)
  } else {
    Reflect.deleteProperty(globalThis, 'navigator')
  }
})

test('getBrowserName recognizes Firefox from userAgentData', () => {
  setNavigator('', {
    brands: [{ brand: 'Firefox', version: '140' }],
  })

  expect(Browser.getBrowserName()).toBe('Firefox')
})

test('getBrowserName recognizes Firefox without userAgentData', () => {
  setNavigator('Mozilla/5.0 Firefox/140.0', undefined)

  expect(Browser.getBrowserName()).toBe('Firefox')
})

test('getBrowserName recognizes Safari without userAgentData', () => {
  setNavigator('Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', undefined)

  expect(Browser.getBrowserName()).toBe('Safari')
})

test('getBrowserName does not mistake Chromium for Safari', () => {
  setNavigator('Mozilla/5.0 AppleWebKit/537.36 Chrome/140.0 Safari/537.36', {
    brands: [{ brand: 'Chromium', version: '140' }],
  })

  expect(Browser.getBrowserName()).toBeUndefined()
})

test('getBrowserName keeps unidentified browsers generic', () => {
  setNavigator('Mozilla/5.0', undefined)

  expect(Browser.getBrowserName()).toBeUndefined()
})
