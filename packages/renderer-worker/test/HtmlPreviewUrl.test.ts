import { expect, test } from '@jest/globals'
import { encode, decode } from '../src/parts/HtmlPreviewUrl/HtmlPreviewUrl.js'

test.each(['/tmp/hello # %.html', 'file:///tmp/a%20b.html?x=1#heading', 'vscode-remote://host/C:/a&b.html'])('source URI round trips: %s', (uri) => {
  expect(decode(encode(uri))).toBe(uri)
})

test('malformed encoding fails before opening a native browser', () => {
  expect(() => decode('html-preview:///%xy')).toThrow()
})
