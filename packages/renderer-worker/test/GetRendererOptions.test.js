import { expect, jest, test } from '@jest/globals'

const getPreference = jest.fn()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
}))

const GetRendererOptions = await import('../src/parts/GetRendererOptions/GetRendererOptions.js')

test('disables recycling by default', () => {
  getPreference.mockReturnValue(undefined)

  expect(GetRendererOptions.getRendererOptions()).toEqual({
    cache: {
      dom: 0,
      text: 0,
    },
  })
})

test('enables bounded element and text recycling', () => {
  getPreference.mockImplementation((key) => {
    if (key === 'virtualDom.recycling.enabled') {
      return true
    }
    return 25
  })

  expect(GetRendererOptions.getRendererOptions()).toEqual({
    cache: {
      dom: 25,
      text: 25,
    },
  })
})

test('uses a safe default for malformed capacity', () => {
  getPreference.mockImplementation((key) => {
    if (key === 'virtualDom.recycling.enabled') {
      return true
    }
    return 'large'
  })

  expect(GetRendererOptions.getRendererOptions()).toEqual({
    cache: {
      dom: 100,
      text: 100,
    },
  })
})
