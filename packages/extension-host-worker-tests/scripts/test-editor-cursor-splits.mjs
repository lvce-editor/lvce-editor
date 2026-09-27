import { expect } from '@playwright/test'

const checkClicks = async (page, editor) => {
  const row = editor.locator('.EditorRow').first()
  const original = await row.textContent()
  const { characterWidth, textX, textY } = await row.evaluate((element) => {
    const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()
    const range = document.createRange()
    range.setStart(text, 0)
    range.setEnd(text, 1)
    const bounds = range.getBoundingClientRect()
    return { characterWidth: bounds.width, textX: bounds.x, textY: bounds.y + bounds.height / 2 }
  })
  // Stay inside the text area: its exact left edge can belong to a split sash.
  for (const column of [5, 1, original.length - 1, original.length + 5]) {
    await page.mouse.click(textX + characterWidth * column, textY)
    await expect(editor.locator('textarea')).toBeFocused()
    const expectedColumn = Math.min(column, original.length)
    // Wait for the asynchronous mouse command; allow subpixel rounding of the caret.
    await expect
      .poll(async () => {
        const cursor = await editor.locator('.EditorCursor').boundingBox()
        return cursor && cursor.y <= textY && cursor.y + cursor.height >= textY
          ? Math.abs(cursor.x - textX - expectedColumn * characterWidth)
          : Infinity
      })
      .toBeLessThan(2)
    await page.keyboard.type('X')
    await expect(row).toHaveText(`${original.slice(0, expectedColumn)}X${original.slice(expectedColumn)}`)
    await page.keyboard.press('Backspace')
    await expect(row).toHaveText(original)
  }
}

export const test = async ({ page, name }) => {
  const editors = page.locator('.Editor')
  await expect(editors).toHaveCount(name.includes('unsplit') ? 1 : 2)
  for (const width of [1280, 1100]) {
    await page.setViewportSize({ width, height: 720 })
    for (let index = 0; index < (await editors.count()); index++) {
      await checkClicks(page, editors.nth(index))
    }
  }
  for (let index = 0; index < (await editors.count()); index++) {
    const editor = editors.nth(index)
    const firstRow = editor.locator('.EditorRow').first()
    const before = await firstRow.textContent()
    await editor.hover()
    await page.mouse.wheel(0, 200)
    await expect(firstRow).not.toHaveText(before)
    await checkClicks(page, editor)
  }
  await page.setViewportSize({ width: 1280, height: 720 })
  console.log(`Verified real pointer positioning, focus, resizing and scrolling: ${name}`)
}
