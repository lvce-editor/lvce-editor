import { chromium, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const terminalCss = await readFile(new URL('../../../static/css/parts/ViewletTerminal.css', import.meta.url), 'utf8')
const xtermCss = await readFile(new URL('../../../static/lib-css/xterm.css', import.meta.url), 'utf8')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  for (const styles of [[terminalCss, xtermCss], [xtermCss, terminalCss]]) {
    await page.setContent(`<style>${styles.join('\n')}</style>
      <style id="theme"></style>
      <div class="XtermTerminal" style="height: 200px">
        <div class="xterm">
          <div class="xterm-viewport"></div>
          <div class="xterm-screen"><span style="background-color: rgb(128, 0, 0)">ANSI background</span></div>
        </div>
      </div>`)
    const cases = [
      { colors: '--EditorBackground: #1e2324; --PanelBackground: #1b2020;', expected: 'rgb(30, 35, 36)' },
      { colors: '--EditorBackground: #fafafa; --PanelBackground: #eeeeee;', expected: 'rgb(250, 250, 250)' },
      { colors: '--EditorBackground: #fafafa; --TerminalBackground: #123456;', expected: 'rgb(18, 52, 86)' },
      { colors: '--EditorBackground: #fafafa; --TerminalBackground: #000000;', expected: 'rgb(0, 0, 0)' },
      { colors: '--EditorBackGround: #1e2324;', expected: 'rgb(30, 35, 36)' },
      { colors: '--MainBackground: #292d3e;', expected: 'rgb(41, 45, 62)' },
    ]
    for (const { colors, expected } of cases) {
      await page.locator('#theme').evaluate((element, css) => {
        element.textContent = `:root { ${css} }`
      }, colors)
      await expect(page.locator('.XtermTerminal')).toHaveCSS('background-color', expected)
      await expect(page.locator('.xterm-viewport')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
      await expect(page.locator('.xterm-screen span')).toHaveCSS('background-color', 'rgb(128, 0, 0)')
    }
  }
  console.log('Terminal background follows theme changes and overrides without covering ANSI backgrounds')
} finally {
  await browser.close()
}
