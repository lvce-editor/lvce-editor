import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
} from './_testFrameWork.js'

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7490211933?check_suite_focus=true
test.skip('viewlet.explorer-create-file', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const { Main, locator, ContextMenu, keyboard } = await runWithExtension({
    folder: tmpDir,
    name: '',
  })

  // act
  const explorer = locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click({
    button: 'right',
  })
  await ContextMenu.selectItem('New File')

  // assert
  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await inputBox.type('created.txt')
  await keyboard.press('Enter')

  // assert
  const newFile = explorer.locator('text=created.txt')
  await expect(newFile).toBeVisible()
})
