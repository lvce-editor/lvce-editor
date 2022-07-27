import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
} from './_testFrameWork.js'

test('viewlet.explorer-create-file-error-no-name-provided', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const { Main, ContextMenu, locator, keyboard } = await runWithExtension({
    folder: tmpDir,
    name: '',
  })

  const explorer = locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click({
    button: 'right',
  })
  await ContextMenu.selectItem('New File')

  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  await keyboard.press('Enter')

  // TODO there should be an error message below the input box
  const dialog = locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText('Error: file name must not be empty')
})
