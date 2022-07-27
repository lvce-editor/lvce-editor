import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
} from './_testFrameWork.js'

test('viewlet.explorer-delete-multiple-files', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const file1 = explorer.locator('text=file1.txt')
  const file2 = explorer.locator('text=file2.txt')
  const file3 = explorer.locator('text=file3.txt')

  // act
  await explorer.click()

  // assert
  await expect(explorer).toHaveClass('FocusOutline')
  await expect(explorer).toBeFocused()

  // act
  await page.keyboard.press('ArrowUp')

  // assert
  await expect(file3).toHaveClass('FocusOutline')

  // act
  await page.keyboard.press('Delete')

  // assert
  await expect(file3).toBeHidden()
  await expect(file2).toHaveClass('FocusOutline')

  // act
  await page.keyboard.press('Delete')

  // assert
  await expect(file2).toBeHidden()
  await expect(file1).toHaveClass('FocusOutline')

  // act
  await page.keyboard.press('Delete')

  // assert
  await expect(file1).toBeHidden()
  await expect(explorer).toHaveClass('FocusOutline')
})
