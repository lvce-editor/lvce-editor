import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn()

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => ({
    invoke,
  })),
}))

jest.unstable_mockModule('../src/parts/LaunchAuthWorker/LaunchAuthWorker.js', () => ({
  launchAuthWorker: jest.fn(),
}))

const AuthWorker = await import('../src/parts/AuthWorker/AuthWorker.js')

test('signIn forwards the standalone redirect option to the auth worker', async () => {
  await AuthWorker.signIn('https://example.com/', 1, true)

  expect(invoke).toHaveBeenCalledWith('Auth.login', {
    authUseRedirect: true,
    backendUrl: 'https://example.com/',
    platform: 1,
  })
})
