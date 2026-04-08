import { afterEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Location/Location.js', () => {
  return {
    setPathName: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
afterEach(() => {
  jest.resetAllMocks()
})

test('cleanAuthCallbackUrl resets pathname when code query param is present', async () => {
  // @ts-ignore
  Location.setPathName.mockResolvedValue(undefined)

  await CleanAuthCallbackUrl.cleanAuthCallbackUrl('https://app.example/callback?code=code-1&state=state-1')

  expect(Location.setPathName).toHaveBeenCalledTimes(1)
  expect(Location.setPathName).toHaveBeenCalledWith('/callback')
})

test('cleanAuthCallbackUrl resets pathname when auth error query param is present', async () => {
  // @ts-ignore
  Location.setPathName.mockResolvedValue(undefined)

  await CleanAuthCallbackUrl.cleanAuthCallbackUrl('https://app.example/callback?error=access_denied')

  expect(Location.setPathName).toHaveBeenCalledTimes(1)
  expect(Location.setPathName).toHaveBeenCalledWith('/callback')
})

test('cleanAuthCallbackUrl ignores urls without auth callback params', async () => {
  // @ts-ignore
  Location.setPathName.mockResolvedValue(undefined)

  await CleanAuthCallbackUrl.cleanAuthCallbackUrl('https://app.example/workspace?folder=/tmp/project')

  expect(Location.setPathName).not.toHaveBeenCalled()
    userState: 'loggedIn',
  })

  expect(Location.removeSearchParams).not.toHaveBeenCalled()
})
