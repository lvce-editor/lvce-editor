import * as IframeSrc from '../src/parts/IframeSrc/IframeSrc.js'

test('localhost url', () => {
  expect(IframeSrc.toIframeSrc('http://localhost:3000')).toBe(
    'http://localhost:3000'
  )
})

test('http url', () => {
  expect(IframeSrc.toIframeSrc('http://example.com')).toBe('http://example.com')
})

test('https url', () => {
  expect(IframeSrc.toIframeSrc('https://example.com')).toBe(
    'https://example.com'
  )
})

test('url without protocol', () => {
  expect(IframeSrc.toIframeSrc('example.com')).toBe('https://example.com')
})

test('search term', () => {
  expect(IframeSrc.toIframeSrc('example')).toBe(
    'https://www.google.com/search?q=example'
  )
})

test('not a url', () => {
  expect(IframeSrc.toIframeSrc('https://example')).toBe('https://example')
})

test('british url', () => {
  expect(IframeSrc.toIframeSrc('https://example.co.uk')).toBe(
    'https://example.co.uk'
  )
})
