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

const name = 'sample.tab-completion-provider'

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7821552259?check_suite_focus=true
test('sample.tab-completion-provider', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `t
`
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 1)
  await Editor.executeTabCompletion()

  // assert
  const editor = Locator('.Viewlet.Editor')
  await expect(editor).toHaveText(`test`)
})
