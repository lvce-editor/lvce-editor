import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'

test('places the renderer process module in the document head', async () => {
  const html = await readFile(new URL('../../../static/index.html', import.meta.url), 'utf8')
  const script = '<script type="module" blocking="render" src="/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js"></script>'
  const headEnd = html.indexOf('</head>')
  const bodyStart = html.indexOf('<body')
  const scriptStart = html.indexOf(script)

  expect(html.match(/<script type="module"/g)).toHaveLength(1)
  expect(scriptStart).toBeGreaterThan(html.indexOf('<head>'))
  expect(scriptStart).toBeLessThan(headEnd)
  expect(bodyStart).toBeGreaterThan(headEnd)
})
