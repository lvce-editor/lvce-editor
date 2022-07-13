import {
  runWithExtension,
  test,
  expect,
  getTmpDir,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    ['   line   ', '   line   ', '   line   '].join('\n')
  )
  const page = await runWithExtension({
    name: 'sample.completion-provider',
    folder: tmpDir,
  })
  const testTxt = page.locator('text=test.xyz')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text').nth(1)
  await tokenText.click()

  const cursor = page.locator('.EditorCursor')
  await expect(cursor).toHaveCount(1)
  await expect(cursor).toHaveCSS('top', '0px')
  await expect(cursor).toHaveCSS('left', '0px')

  await page.keyboard.press('End')
  await expect(cursor).toHaveCSS('top', '0px')
  await expect(cursor).toHaveCSS('left', '95px')

  await page.keyboard.press('Control+Space')

  const completions = page.locator('#Completions')
  await expect(completions).toBeVisible()
  // TODO widget is not positioned correctly, especially with variable width fonts and unicode characters
  await expect(completions).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 90, 75)')

  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems).toHaveCount(3)
  await expect(completionItems.nth(0)).toHaveText('Option A')
  await expect(completionItems.nth(1)).toHaveText('Option B')
  await expect(completionItems.nth(2)).toHaveText('Option C')

  // TODO first option should be focused

  // await page.keyboard.press('Escape')
  // await expect(completions).toBeHidden()

  // // reset cursor
  // await page.keyboard.press('Home')
  // await page.keyboard.press('Home')
  // for (let i = 0; i < 4; i++) {
  //   await page.keyboard.press('ArrowRight')
  // }
  // await expect(cursor).toHaveCSS('top', '20px')
  // await expect(cursor).toHaveCSS('left', '36px')

  // // TODO test that completion popup moves accordingly to cursor position

  // // trigger completion
  // await page.keyboard.press('Control+Space')
  // await expect(completions).toBeVisible()

  // // move cursor left (matches same word)
  // await page.keyboard.press('ArrowLeft')
  // await expect(completions).toBeVisible()

  // TODO enable advanced tests again
  // await expect(completions).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 27, 95)')

  // // move cursor left (doesn't match word)
  // await page.keyboard.press('ArrowLeft')
  // await expect(completions).toBeHidden()

  // // reset cursor
  // await page.keyboard.press('End')
  // for (let i = 0; i < 4; i++) {
  //   await page.keyboard.press('ArrowLeft')
  // }

  // // trigger completion
  // await page.keyboard.press('Control+Space')
  // await expect(completions).toBeVisible()
  // await expect(completions).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 54, 95)')

  // // move cursor right (matches word)
  // await page.keyboard.press('ArrowRight')
  // await expect(completions).toBeVisible()
  // await expect(completions).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 63, 95)')

  // // move cursor right (doesn't match word)
  // await page.keyboard.press('ArrowRight')
  // await expect(completions).toBeHidden()
})
