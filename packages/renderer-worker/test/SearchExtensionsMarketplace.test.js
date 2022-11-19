const SearchExtensionsMarketplace = await import(
  '../src/parts/SearchExtensionsMarketplace/SearchExtensionsMarketplace.js'
)

test('handleInput - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    throw new Error(
      'Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found'
    )
  })
  const extensions = []
  expect(
    await SearchExtensionsMarketplace.getExtensions(extensions, 'test')
  ).toMatchObject({
    error:
      'Failed to load extensions from marketplace: Error: Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found',
  })
})
