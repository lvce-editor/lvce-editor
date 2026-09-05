import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'

const css = await readFile(new URL('../../../static/css/parts/_Global.css', import.meta.url), 'utf8')
const font = await readFile(new URL('../../../static/fonts/FiraCode-VariableFont.ttf', import.meta.url))
const fontPath = '/fonts/FiraCode-VariableFont.ttf'
const requests = []
const server = createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  if (request.url === fontPath) {
    requests.push(request.url)
    response.setHeader('Content-Type', 'font/ttf')
    response.end(font)
    return
  }
  response.setHeader('Content-Type', 'text/html')
  response.end(`<style>${css}</style><p style="font-family: 'Fira Code'">Bundled editor font</p>`)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
let browser
try {
  // A connection estimate can affect bundled fonts even though they need no internet access.
  browser = await chromium.launch({
    headless: true,
    // The headless shell does not reproduce Chromium's font intervention.
    channel: 'chromium',
    args: ['--force-effective-connection-type=2G'],
  })
  const page = await browser.newPage()
  const session = await page.context().newCDPSession(page)
  const interventions = []
  session.on('Log.entryAdded', ({ entry }) => {
    if (entry.text.includes('Slow network is detected')) {
      interventions.push(entry.text)
    }
  })
  await session.send('Log.enable')
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].some((font) => font.family === 'Fira Code' && font.status === 'loaded')
  })
  assert.equal(loaded, true, 'The bundled editor font must finish loading')
  assert.deepEqual(requests, [fontPath])
  assert.deepEqual(interventions, [], 'Local font loading must not trigger a slow-network intervention')
  console.log('Bundled editor font loads without slow-network warnings')
} finally {
  await browser?.close()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
}
