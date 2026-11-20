import assert from 'node:assert/strict'
import type { Browser } from 'playwright'

// Hold chat initialization at the network boundary so an intermediate layout
// cannot disappear before the browser assertions observe it.
export const testLayoutTransition = async (browser: Browser, baseUrl: string): Promise<void> => {
  for (const layout of ['AI-Native Chat', 'IDE']) {
    const context = await browser.newContext()
    let finishLoading: () => void = () => {}
    const loading = new Promise<void>((resolve) => {
      finishLoading = resolve
    })
    let startedLoading: () => void = () => {}
    const started = new Promise<void>((resolve) => {
      startedLoading = resolve
    })
    await context.addInitScript(() => {
      localStorage.setItem(
        'settings',
        JSON.stringify({
          'chat2.backendUrl': 'https://layout-transition.test',
        }),
      )
    })
    await context.route('https://layout-transition.test/**', async (route) => {
      startedLoading()
      await loading
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: 'test-model' }] }),
      })
    })
    const page = await context.newPage()
    try {
      await page.goto(new URL('board/', baseUrl).href)
      const board = page.locator('.BoardView')
      // Direct startup can render the board in the IDE sidebar before expanding it.
      await page.waitForFunction(() => {
        const board = globalThis.document.querySelector('.Workbench.AiNativeLayout .BoardView')
        return board && board.getBoundingClientRect().width > globalThis.innerWidth / 2
      })
      const bounds = await board.boundingBox()
      assert.ok(bounds, 'The expanded board must be visible before opening chat')
      const workbench = page.locator('.Workbench')
      const classes = await workbench.getAttribute('class')
      await page.keyboard.press('Control+Shift+P')
      await page.getByRole('combobox').fill(`>Open ${layout} Layout`)
      await page
        .getByRole('option', {
          name: `View: Open ${layout} Layout`,
          exact: true,
        })
        .click()
      await Promise.race([
        started,
        new Promise<never>((_, reject) => {
          const timer = setTimeout(() => reject(new Error('Chat did not begin loading')), 15_000)
          timer.unref()
        }),
      ])
      assert.deepEqual(await board.boundingBox(), bounds, `${layout}: board bounds changed while chat loaded`)
      assert.equal(await workbench.getAttribute('class'), classes, `${layout}: workbench changed while chat loaded`)
      finishLoading()
      const chat = page.locator('.ChatView').first()
      await chat.waitFor()
      await board.waitFor({ state: 'detached' })
      await page.waitForFunction((native) => {
        const workbench = globalThis.document.querySelector('.Workbench')
        const chat = globalThis.document.querySelector('.ChatView')
        return workbench?.classList.contains('AiNativeLayout') === native && chat?.classList.contains('ChatAiNativeLayout') === native
      }, layout === 'AI-Native Chat')
      if (layout === 'IDE') await page.locator('.Main').waitFor()
    } finally {
      finishLoading()
      await context.close()
    }
  }
  process.stdout.write('board layout preserved while chat initializes: pass\n')
}
