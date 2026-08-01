import { beforeEach, expect, jest, test } from '@jest/globals'

const addCustomPathsToIndexHtml = jest.fn(async (content: unknown, _config: Readonly<Record<string, string>>) => content)
const issuerRegex = /^[A-Za-z0-9_-]{43}$/
const fsPromises = await import('node:fs/promises')

jest.unstable_mockModule('node:fs/promises', () => ({
  ...fsPromises,
  readFile: jest.fn(async () => Buffer.from('<title>LVCE</title>')),
}))

jest.unstable_mockModule('../src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js', () => ({
  addCustomPathsToIndexHtml,
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isProduction: true,
  scheme: 'lvce',
}))

jest.unstable_mockModule('../src/parts/ShouldTranspileTypescript/ShouldTranspileTypescript.js', () => ({
  shouldTranspileTypescript: jest.fn(() => false),
}))

jest.unstable_mockModule('../src/parts/TranspileTypeScript/TranspileTypeScript.js', () => ({
  transpileTypeScript: jest.fn(),
}))

const GetElectronFileResponseContent = await import('../src/parts/GetElectronFileResponseContent/GetElectronFileResponseContent.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('injects an issuer only for a top-level document navigation', async () => {
  await GetElectronFileResponseContent.getElectronFileResponseContent({ headers: { 'sec-fetch-dest': 'document' } }, '/index.html', '/')

  expect(addCustomPathsToIndexHtml).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ webSocketIssuer: expect.stringMatching(issuerRegex) }),
  )
})

test('generates a fresh issuer for each navigation', async () => {
  const request = { headers: { 'sec-fetch-dest': 'document' } }
  await GetElectronFileResponseContent.getElectronFileResponseContent(request, '/index.html', '/')
  await GetElectronFileResponseContent.getElectronFileResponseContent(request, '/index.html', '/')

  const firstIssuer = addCustomPathsToIndexHtml.mock.calls[0][1].webSocketIssuer
  const secondIssuer = addCustomPathsToIndexHtml.mock.calls[1][1].webSocketIssuer
  expect(firstIssuer).not.toBe(secondIssuer)
})

test('does not expose an issuer when an extension fetches the application root', async () => {
  await GetElectronFileResponseContent.getElectronFileResponseContent({ headers: { 'sec-fetch-dest': 'empty' } }, '/index.html', '/')

  expect(addCustomPathsToIndexHtml).toHaveBeenCalledWith(expect.anything(), {})
})
