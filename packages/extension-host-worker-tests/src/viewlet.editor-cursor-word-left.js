import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Editor,
  FileSystem,
  Main,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

test('viewlet.editor-cursor-word-left', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 15)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('left', '142px')

  // act
  await Editor.cursorWordLeft()

  // assert
  await expect(cursor).toHaveCSS('left', '66px')
})
