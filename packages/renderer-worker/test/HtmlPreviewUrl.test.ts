import { expect, test } from '@jest/globals'
import { encode, decode } from '../src/parts/HtmlPreviewUrl/HtmlPreviewUrl.js'

test.each(['/tmp/hello # %.html', 'file:///tmp/a%20b.html?x=1#heading', 'vscode-remote://host/C:/a&b.html'])('source URI round trips: %s', (uri) => {
  expect(decode(encode(uri))).toBe(uri)
})

test('file URLs keep path separators readable', () => {
  const uri = 'file:///home/example/index.html'
  const url = encode(uri)
  expect(url).toBe('html-preview:///file/home/example/index.html')
  expect(decode(url)).toBe(uri)
})

test('memfs URLs keep path separators readable', () => {
  const uri = 'memfs://inventing-on-principles.html'
  const url = encode(uri)
  expect(url).toBe('html-preview:///memfs/inventing-on-principles.html')
  expect(decode(url)).toBe(uri)
})

test.each([
  'memfs://inventing-on-principles/inventing-on-principle.html',
  'memfs:////inventing-on-principles/inventing-on-principle.html',
])('nested memfs URLs retain their source path: %s', (uri) => {
  const url = encode(uri)
  expect(url).toContain('/memfs/')
  expect(url).not.toContain('%2F')
  expect(decode(url)).toBe(uri)
})

test.each([
  'memfs://folder/a b%#.html?x=one#heading',
  'memfs://folder/%2520.html',
])('memfs URLs escape reserved characters and round trip: %s', (uri) => {
  const url = encode(uri)
  expect(decode(url)).toBe(uri)
})

test.each([
  'file:///home/example/a b%#.html?x=one#heading',
  'file:///C:/Users/example/index.html',
  'file:///home/example/%2520.html',
])('file URLs escape reserved path characters and round trip: %s', (uri) => {
  const url = encode(uri)
  expect(url).toContain('/file/')
  expect(decode(url)).toBe(uri)
})

test('legacy fully encoded file URLs remain decodable', () => {
  const uri = 'file:///hello #%.html'
  expect(decode(`html-preview:///${encodeURIComponent(uri)}`)).toBe(uri)
})

test('legacy fully encoded memfs URLs remain decodable', () => {
  const uri = 'memfs://folder/a b%#.html?x=one#heading'
  expect(decode(`html-preview:///${encodeURIComponent(uri)}`)).toBe(uri)
})

test('malformed encoding fails before opening a native browser', () => {
  expect(() => decode('html-preview:///%xy')).toThrow()
})
