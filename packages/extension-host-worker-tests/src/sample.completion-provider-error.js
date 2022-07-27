import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider-error', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const { Main, Editor, locator } = await runWithExtension({
    name: 'sample.completion-provider-error',
    folder: tmpDir,
  })

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  // assert
  const overlayMessage = locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Failed to execute completion provider: oops'
  )
})
