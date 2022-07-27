import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Editor,
  Extension,
  FileSystem,
  Main,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

test('sample.completion-provider-error-invalid-return-value-undefined', async () => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(
      '../fixtures/sample.completion-provider-error-invalid-return-value-undefined',
      import.meta.url
    ).toString()
  )
  await Main.openUri(`${tmpDir}/test.xyz`)

  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO should say failed to load completions because of invalid return value
  // or just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: completion must be of type array but is undefined`
  )
})
