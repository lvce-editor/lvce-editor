import { expect, jest, test } from '@jest/globals'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isProduction: true,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getUserPreferences: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js', () => ({
  getLinkedWorkerPreferences: jest.fn(() => ({
    'develop.mainAreaWorkerPath': '/test/main-area-worker',
  })),
}))

const AddCustomPathsToIndexHtml = await import('../src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

test('addCustomPathsToIndexHtml - adds linked worker urls in production', async () => {
  const content = '<title>Test</title>'
  const mainAreaWorkerUrl = GetRemoteUrl.getRemoteUrl('/test/main-area-worker')

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)

  expect(Preferences.getUserPreferences).not.toHaveBeenCalled()
  expect(result).toContain(`"develop.mainAreaWorkerPath": "${mainAreaWorkerUrl}"`)
})
