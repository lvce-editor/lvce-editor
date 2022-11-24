import * as ParseExtensionSearchValue from '../src/parts/ParseExtensionSearchValue/ParseExtensionSearchValue.js'
import * as SearchExtensionsLocal from '../src/parts/SearchExtensionsLocal/SearchExtensionsLocal.js'

test('searchExtensions - error - extension has no name, use id for filtering', async () => {
  const extensions = [
    {
      id: 'test-author.test-extension',
      main: 'main.js',
    },
  ]
  const searchValue = 'test'
  const expected = [
    {
      id: 'test-author.test-extension',
    },
  ]
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - error - extension has no name and no id', async () => {
  const extensions = [
    {
      main: 'main.js',
    },
  ]
  const searchValue = 'test'
  const expected = []
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - error - extension name is of type number', async () => {
  const extensions = [
    {
      main: 'main.js',
      name: 123,
    },
  ]
  const searchValue = 'test'
  const expected = []
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - error - extension id is of type number', async () => {
  const extensions = [
    {
      main: 'main.js',
      id: 123,
    },
  ]
  const searchValue = 'test'
  const expected = []
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - error - extension is null', async () => {
  const extensions = [null]
  const searchValue = 'test'
  const expected = []
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - error - extension is of type number', async () => {
  const extensions = [123]
  const searchValue = 'test'
  const expected = []
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})

test('searchExtensions - match by lowercase name', async () => {
  const extensions = [
    {
      name: 'Test extension',
      main: 'main.js',
    },
  ]
  const searchValue = 'test'
  const expected = [
    {
      name: 'Test extension',
    },
  ]
  expect(
    await SearchExtensionsLocal.getExtensions(
      extensions,
      ParseExtensionSearchValue.parseValue(searchValue)
    )
  ).toMatchObject(expected)
})
