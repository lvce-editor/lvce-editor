import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { getSimpleBrowserVirtualDom } from '../packages/renderer-worker/src/parts/GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as Elements from '../packages/renderer-worker/src/parts/VirtualDomElements/VirtualDomElements.js'

const requireTests = createRequire(new URL('../packages/extension-host-worker-tests/package.json', import.meta.url))
const { chromium } = requireTests('playwright')
const css = await readFile(new URL('../static/css/parts/ViewletSimpleBrowser.css', import.meta.url), 'utf8')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  for (const count of [1, 6, 12, 40]) {
    const tabs = Array.from({ length: count }, (_, index) => ({ title: `Long browser tab title ${index}`, favicon: '', isAudioPlaying: true }))
    const dom = getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, tabs)
    await page.setContent('<div id="host" style="display:flex;height:35px"></div>')
    await page.addStyleTag({ content: css })
    await page.evaluate(
      ({ dom, Elements }) => {
        let index = dom.findIndex((node) => node.className === 'SimpleBrowserTabs')
        const render = () => {
          const node = dom[index++]
          if (node.type === Elements.Text) return document.createTextNode(node.text)
          const tag = Object.keys(Elements).find((key) => Elements[key] === node.type)
          const element = document.createElement(tag.toLowerCase())
          if (node.className) element.className = node.className
          if (node.ariaLabel) element.setAttribute('aria-label', node.ariaLabel)
          for (let child = 0; child < node.childCount; child++) element.append(render())
          return element
        }
        const strip = render()
        strip.style.flex = '1'
        document.querySelector('#host').append(strip)
      },
      { dom, Elements },
    )
    for (const width of [1000, 480, 240, 120]) {
      await page.locator('#host').evaluate((element, width) => {
        element.style.width = `${width}px`
      }, width)
      for (const scroll of [0, 10000]) {
        await page.locator('.SimpleBrowserTabItems').evaluate((element, scroll) => {
          element.scrollLeft = scroll
        }, scroll)
        const geometry = await page.evaluate(() => {
          const button = document.querySelector('.SimpleBrowserNewTab')
          const rect = button.getBoundingClientRect()
          const strip = document.querySelector('.SimpleBrowserTabs').getBoundingClientRect()
          const items = document.querySelector('.SimpleBrowserTabItems').getBoundingClientRect()
          const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
          return {
            width: rect.width,
            inside: rect.x >= strip.x && rect.right <= strip.right,
            separate: items.right <= rect.x,
            hit: button.contains(target),
          }
        })
        assert.equal(geometry.width, 24)
        assert(geometry.inside && geometry.separate && geometry.hit, JSON.stringify({ count, width, scroll, geometry }))
        await page.getByRole('button', { name: 'New Tab', exact: true }).click({ timeout: 1000 })
      }
    }
  }
  console.log('Simple Browser tab layout: 32 crowded/narrow/scrolled cases passed')
} finally {
  await browser.close()
}
