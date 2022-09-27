/**
 * @jest-environment jsdom
 */
import * as SanitizeHtml from '../src/parts/SanitizeHtml/SanitizeHtml.js'

test('sanitizeHtml - remove script', () => {
  expect(
    SanitizeHtml.sanitizeHtml('<h1>hello world<script>alert(1)</script></h1>')
  ).toBe('<h1>hello world</h1>')
})

test('sanitizeHtml - remove image onerror handling', () => {
  expect(
    SanitizeHtml.sanitizeHtml(
      '<h1>hello world<img onerror="alert(1)" src="/test/image.jpg"></h1>'
    )
  ).toBe('<h1>hello world<img src="/test/image.jpg"></h1>')
})
