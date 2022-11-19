const SearchExtensions = await import(
  '../src/parts/SearchExtensions/SearchExtensions.js'
)

test('searchExtensions - error - extension has no name, use id for filtering', async () => {
  const extensions = [
    {
      id: 'test-author.test-extension',
      main: 'main.js',
    },
  ]
  const expected = [
    {
      id: 'test-author.test-extension',
      main: 'main.js',
    },
  ]
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})

test('searchExtensions - error - extension has no name and no id', async () => {
  const extensions = [
    {
      main: 'main.js',
    },
  ]
  const expected = []
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})

test('searchExtensions - error - extension name is of type number', async () => {
  const extensions = [
    {
      main: 'main.js',
      name: 123,
    },
  ]
  const expected = []
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})

test('searchExtensions - error - extension id is of type number', async () => {
  const extensions = [
    {
      main: 'main.js',
      id: 123,
    },
  ]
  const expected = []
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})

test('searchExtensions - error - extension is null', async () => {
  const extensions = [null]
  const expected = []
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})

test('searchExtensions - error - extension is of type number', async () => {
  const extensions = [123]
  const expected = []
  expect(await SearchExtensions.searchExtensions(extensions, 'test')).toEqual(
    expected
  )
})
