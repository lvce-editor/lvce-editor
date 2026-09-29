import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (command) => {
  if (command === 'Markdown.renderMarkdown') {
    return '<p><a target="_blank">link</a></p>'
  }
  return [
    { childCount: 1, type: 4 },
    { childCount: 0, text: 'link', type: 0 },
  ]
})

jest.unstable_mockModule('../src/parts/MarkdownWorker/MarkdownWorker.js', () => ({ invoke }))

const Markdown = await import('../src/parts/Markdown/Markdown.js')

test('getVirtualDomFromMarkdown renders Markdown and converts the HTML to virtual DOM', async () => {
  await expect(Markdown.getVirtualDomFromMarkdown('[link](https://example.com)')).resolves.toEqual([
    { childCount: 1, type: 4 },
    { childCount: 0, text: 'link', type: 0 },
  ])
  expect(invoke.mock.calls).toEqual([
    ['Markdown.renderMarkdown', '[link](https://example.com)', { linksExternal: true }],
    ['Markdown.getMarkDownVirtualDom', '<p><a target="_blank">link</a></p>'],
  ])
})
