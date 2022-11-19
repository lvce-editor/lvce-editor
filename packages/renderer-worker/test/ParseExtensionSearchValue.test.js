import * as ParseExtensionSearchValue from '../src/parts/ParseExtensionSearchValue/ParseExtensionSearchValue.js'

test('parseValue - @installed', () => {
  expect(ParseExtensionSearchValue.parseValue('@installed abc')).toMatchObject({
    installed: true,
    query: ' abc',
    isLocal: true,
  })
})

test('parseValue - @enabled', () => {
  expect(ParseExtensionSearchValue.parseValue('@enabled abc')).toMatchObject({
    enabled: true,
    query: ' abc',
    isLocal: true,
  })
})

test('parseValue - @disabled', () => {
  expect(ParseExtensionSearchValue.parseValue('@disabled abc')).toMatchObject({
    disabled: true,
    query: ' abc',
    isLocal: true,
  })
})

test('parseValue - @builtin', () => {
  expect(ParseExtensionSearchValue.parseValue('@builtin')).toMatchObject({
    builtin: true,
  })
})

test('parseValue - @sort', () => {
  expect(ParseExtensionSearchValue.parseValue('@sort')).toMatchObject({
    sort: 'installs',
  })
})

test('parseValue - @id', () => {
  expect(ParseExtensionSearchValue.parseValue('@id abc')).toMatchObject({
    id: 'abc',
  })
})

test('parseValue - @outdated', () => {
  expect(ParseExtensionSearchValue.parseValue('@outdated')).toMatchObject({
    outdated: true,
  })
})
