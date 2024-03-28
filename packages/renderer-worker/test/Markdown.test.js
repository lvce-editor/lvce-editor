import { jest } from '@jest/globals'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LoadMarked/LoadMarked.js', () => {
  const marked = jest.fn()
  return {
    loadMarked() {
      return marked
    },
  }
})

const Markdown = await import('../src/parts/Markdown/Markdown.js')
const LoadMarked = await import('../src/parts/LoadMarked/LoadMarked.js')

test('toHtml', async () => {
  const marked = await LoadMarked.loadMarked()
  marked.mockImplementation(() => {
    return '<h1 id="test">test</h1>\n'
  })
  expect(await Markdown.toHtml('# test')).toBe('<h1 id="test">test</h1>\n')
  expect(marked).toHaveBeenCalledTimes(1)
  expect(marked).toHaveBeenCalledWith('# test', { baseUrl: '' })
})
