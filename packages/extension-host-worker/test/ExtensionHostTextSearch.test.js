import * as ExtensionHostTextSearch from '../src/parts/ExtensionHostTextSearch/ExtensionHostTextSearch.js'

beforeEach(() => {
  ExtensionHostTextSearch.reset()
})

test('registerTextSearchProvider - no argument provided', () => {
  expect(() =>
    ExtensionHostTextSearch.registerTextSearchProvider()
  ).toThrowError(
    new Error(
      'Failed to register text search provider: textSearchProvider is not defined'
    )
  )
})

test('registerTextSearchProvider - missing scheme', () => {
  expect(() =>
    ExtensionHostTextSearch.registerTextSearchProvider({
      provideTextSearchResults(query) {},
    })
  ).toThrowError(
    new Error(
      'Failed to register text search provider: textSearchProvider is missing scheme'
    )
  )
})

test('registerTextSearchProvider - missing provideTextSearchResults function', () => {
  expect(() =>
    ExtensionHostTextSearch.registerTextSearchProvider({
      provideTextSearchResults(query) {},
    })
  ).toThrowError(
    new Error(
      'Failed to register text search provider: textSearchProvider is missing scheme'
    )
  )
})

test('executeTextSearchProvider - no provider found', async () => {
  await expect(
    ExtensionHostTextSearch.executeTextSearchProvider('xyz', 'abc')
  ).rejects.toThrowError(
    new Error(
      'Failed to execute text search provider: no text search provider for xyz found'
    )
  )
})

test('executeTextSearchProvider - error', async () => {
  ExtensionHostTextSearch.registerTextSearchProvider({
    scheme: 'xyz',
    provideTextSearchResults(query) {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostTextSearch.executeTextSearchProvider('xyz', 'abc')
  ).rejects.toThrowError(
    new Error('Failed to execute text search provider: x is not a function')
  )
})
