import * as Markdown from '../src/parts/Markdown/Markdown.js'

test('toHtml', () => {
  expect(Markdown.toHtml('# test')).toBe(`<h1 id=\"test\">test</h1>
`)
})
