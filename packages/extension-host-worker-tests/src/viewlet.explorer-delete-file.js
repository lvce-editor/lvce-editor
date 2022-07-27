import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
} from './_testFrameWork.js'

test('viewlet.explorer-delete-file', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const { Main, locator, ContextMenu } = await runWithExtension({
    folder: tmpDir,
    name: '',
  })

  // act
  const explorer = locator('.Viewlet[data-viewlet-id="Explorer"]')
  const file1 = explorer.locator('text=file1.txt')
  await file1.click({
    button: 'right',
  })

  // assert
  await ContextMenu.selectItem('Delete')
  await expect(file1).toBeHidden()
})
