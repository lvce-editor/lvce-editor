import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider-error-invalid-return-value-array-with-undefined-items', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const { Main, Editor, locator } = await runWithExtension({
    name: 'sample.completion-provider-error-invalid-return-value-array-with-undefined-items',
    folder: tmpDir,
  })

  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  const overlayMessage = locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: expected completion item to be of type object but was of type undefined`
  )
})
